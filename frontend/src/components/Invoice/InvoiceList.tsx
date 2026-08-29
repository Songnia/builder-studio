import React, { useEffect, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { api } from '@/services/api';
import { FileText, Trash2, Eye, Share2, MoreHorizontal, FileDown, Printer } from 'lucide-react';
import DeleteConfirmDialog from '@/components/Common/DeleteConfirmDialog';
import { toast } from 'sonner';
import { pdf } from '@react-pdf/renderer';
import InvoicePDFDocument from './InvoicePDFDocument';
import RecordPaymentDialog from './RecordPaymentDialog';
import { CreditCard } from 'lucide-react';

interface InvoiceListProps {
    onCreateNew: () => void;
    onEdit: (invoice: any) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ onCreateNew, onEdit }) => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [invoiceToPay, setInvoiceToPay] = useState<any>(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await api.get('/admin/invoices');
                const sortedData = response.data.sort((a: any, b: any) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                setInvoices(sortedData);
            } catch (error) {
                console.error("Erreur lors de la récupération des factures", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const confirmDelete = async () => {
        if (!invoiceToDelete) return;

        try {
            await api.delete(`/admin/invoices/${invoiceToDelete.id}`);
            setInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete.id));
            toast.success(`La facture ${invoiceToDelete.invoice_number} a été supprimée.`);
        } catch (error) {
            console.error("Erreur suppression", error);
            toast.error("Impossible de supprimer la facture.");
            throw error;
        }
    };

    const handleRecordPayment = async (amount: number) => {
        if (!invoiceToPay) return;
        try {
            const response = await api.post(`/admin/invoices/${invoiceToPay.id}/payment`, { amount });
            const updatedInvoice = response.data;
            setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
            toast.success(`Paiement de ${amount.toLocaleString('fr-FR')} FCFA enregistré.`);
        } catch (error) {
            console.error("Erreur paiement", error);
            toast.error("Impossible d'enregistrer le paiement.");
            throw error;
        }
    };

    const handleEditClick = (inv: any) => {
        // Mapping de l'API vers le format InvoiceData du frontend
        const mappedInvoice = {
            id: inv.id, // Garder l'ID réel pour le PUT précis
            number: inv.invoice_number,
            issueDate: inv.issue_date,
            dueDate: inv.due_date,
            client: {
                name: inv.client_name,
                email: inv.client_email,
                phone: inv.client_phone || '',
                address: inv.client_address || ''
            },
            items: inv.items.map((item: any) => ({
                id: item.id.toString(),
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unit_price,
                total: item.total
            })),
            taxRate: inv.tax_rate,
            includeTax: inv.include_tax,
            totalAmount: inv.total_amount,
            amountPaid: inv.amount_paid,
            status: inv.status,
            studio: inv.studio_info || {
                logoUrl: '/favicon.png',
                photographerName: 'Vanda Studio',
                email: 'contact@vanda-studio.org',
                address: 'Paris, France',
                phone: '+221 00 000 00 00'
            }
        };
        onEdit(mappedInvoice);
    };

    // Prépare le studio et le logo base64 communs aux deux actions
    const preparePDFData = async (inv: any) => {
        let studio;
        try {
            studio = typeof inv.studio_info === 'string' ? JSON.parse(inv.studio_info) : (inv.studio_info || {
                logoUrl: '',
                photographerName: 'Vanda Studio',
                email: 'contact@vanda-studio.org',
                address: 'Paris, France',
                phone: '+221 00 000 00 00'
            });
        } catch {
            studio = { logoUrl: '', photographerName: 'Vanda Studio', email: 'contact@vanda-studio.org', address: 'Paris, France', phone: '+221 00 000 00 00' };
        }

        let logoBase64: string | undefined;
        if (studio.logoUrl) {
            // Si c'est déjà un data URL base64, l'utiliser directement
            if (studio.logoUrl.startsWith('data:')) {
                logoBase64 = studio.logoUrl;
            } else {
                const absoluteUrl = studio.logoUrl.startsWith('http')
                    ? studio.logoUrl
                    : `${window.location.origin}${studio.logoUrl.startsWith('/') ? '' : '/'}${studio.logoUrl}`;
                try {
                    const res = await fetch(absoluteUrl);
                    const blob = await res.blob();
                    logoBase64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    });
                } catch { /* logo indisponible */ }
            }
        }

        const subtotal = inv.items.reduce((sum: number, item: any) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
        const taxAmount = inv.include_tax ? (subtotal * Number(inv.tax_rate)) / 100 : 0;
        const total = subtotal + taxAmount;

        return { studio, logoBase64, subtotal, taxAmount, total };
    };

    // Télécharger en PDF
    const handleDownload = async (inv: any) => {
        toast.loading('Génération du PDF...');
        try {
            const { studio, logoBase64, subtotal, taxAmount, total } = await preparePDFData(inv);
            const blob = await pdf(
                <InvoicePDFDocument
                    inv={inv}
                    studio={studio}
                    logoBase64={logoBase64}
                    subtotal={subtotal}
                    taxAmount={taxAmount}
                    total={total}
                />
            ).toBlob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Facture_${inv.invoice_number}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
            toast.dismiss();
            toast.success('PDF téléchargé !');
        } catch (e) {
            toast.dismiss();
            toast.error('Erreur lors de la génération du PDF.');
            console.error(e);
        }
    };

    // Imprimer via le PDF
    const handlePrint = async (inv: any) => {
        toast.loading('Préparation de l\'impression...');
        try {
            const { studio, logoBase64, subtotal, taxAmount, total } = await preparePDFData(inv);
            const blob = await pdf(
                <InvoicePDFDocument
                    inv={inv}
                    studio={studio}
                    logoBase64={logoBase64}
                    subtotal={subtotal}
                    taxAmount={taxAmount}
                    total={total}
                />
            ).toBlob();
            const url = URL.createObjectURL(blob);
            const win = window.open(url);
            if (win) {
                win.onload = () => { win.print(); };
            }
            toast.dismiss();
        } catch (e) {
            toast.dismiss();
            toast.error('Erreur lors de l\'impression.');
            console.error(e);
        }
    };

    // Partager le PDF directement via l'API Web Share (WhatsApp, Telegram, etc.)
    const handleShareWhatsApp = async (inv: any) => {
        const toastId = toast.loading('Préparation du partage...');
        try {
            const { studio, logoBase64, subtotal, taxAmount, total } = await preparePDFData(inv);
            const filename = `Facture_${inv.invoice_number}.pdf`;
            const blob = await pdf(
                <InvoicePDFDocument inv={inv} studio={studio} logoBase64={logoBase64} subtotal={subtotal} taxAmount={taxAmount} total={total} />
            ).toBlob();
            const file = new File([blob], filename, { type: 'application/pdf' });
            const amount = Number(inv.total_amount).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            const clientName = inv.client_name || 'Client';

            // Web Share API — partage natif (mobile : ouvre le sélecteur d'app dont WhatsApp)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                toast.dismiss(toastId);
                await navigator.share({
                    title: `Facture ${inv.invoice_number}`,
                    text: `Bonjour ${clientName} 👋\nVoici votre facture *${inv.invoice_number}* — *${amount} FCFA*`,
                    files: [file],
                });
            } else {
                // Fallback desktop : télécharger le PDF + ouvrir WhatsApp avec message
                toast.dismiss(toastId);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = filename; a.click();
                URL.revokeObjectURL(url);

                const phone = inv.client_phone ? inv.client_phone.replace(/[\s\-()+.]/g, '') : '';
                const msg = `Bonjour ${clientName} 👋\nVoici votre facture *${inv.invoice_number}* d'un montant de *${amount} FCFA*.\nLe fichier PDF a été téléchargé sur votre appareil.`;
                const waUrl = phone
                    ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
                    : `https://wa.me/?text=${encodeURIComponent(msg)}`;

                setTimeout(() => window.open(waUrl, '_blank'), 400);
                toast.success('PDF téléchargé — WhatsApp ouvert !');
            }
        } catch (e: any) {
            toast.dismiss(toastId);
            if (e?.name !== 'AbortError') {
                toast.error('Partage annulé ou non supporté.');
            }
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Payé</span>;
            case 'partially_paid':
                return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Acompte</span>;
            case 'pending':
            default:
                return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">En attente</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800">Historique des factures</h2>
                <button
                    onClick={onCreateNew}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-full hover:bg-green-700 transition-all text-sm font-bold shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                >
                    + Créer une facture
                </button>
            </div>

            {invoices.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">Aucune facture pour le moment</h3>
                    <p className="text-slate-500 text-sm mb-6">Commencez par créer votre première prestation.</p>
                </div>
            ) : (
                <>
                    {/* Vue Mobile & Tablette (Cartes) - Visible jusqu'à 1024px */}
                    <div className="lg:hidden space-y-4">
                        {invoices.map((inv) => (
                            <div key={inv.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Facture</div>
                                        <div className="font-mono font-bold text-slate-900">{inv.invoice_number}</div>
                                        <div className="mt-1">{getStatusBadge(inv.status)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-block">
                                            {Number(inv.total_amount).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} FCFA
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client</div>
                                    <div className="font-semibold text-slate-900">{inv.client_name}</div>
                                    <div className="text-xs text-slate-500">{inv.client_email}</div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                    <div className="text-xs text-slate-500">
                                        {new Date(inv.issue_date).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleShareWhatsApp(inv)}
                                            className="p-2.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(inv)}
                                            className="p-2.5 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger asChild>
                                                <button className="p-2.5 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Portal>
                                                <DropdownMenu.Content
                                                    className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 w-56 animate-in fade-in zoom-in-95 duration-200 z-[100]"
                                                    align="end"
                                                >
                                                    <DropdownMenu.Item onClick={() => handleDownload(inv)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                                                        <div className="bg-slate-100 p-1.5 rounded-lg text-slate-600">
                                                            <FileDown size={18} />
                                                        </div>
                                                        Télécharger PDF
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item onClick={() => handlePrint(inv)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                                                        <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                                                            <Printer size={18} />
                                                        </div>
                                                        Imprimer
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Item 
                                                        onClick={() => {
                                                            setInvoiceToPay(inv);
                                                            setIsPaymentOpen(true);
                                                        }}
                                                        disabled={inv.status === 'paid'}
                                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 rounded-xl cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                                                    >
                                                        <div className="bg-green-50 p-1.5 rounded-lg text-green-600">
                                                            <CreditCard size={18} />
                                                        </div>
                                                        Paiement
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                                                    <DropdownMenu.Item 
                                                        onClick={() => {
                                                            setInvoiceToDelete(inv);
                                                            setIsDeleteOpen(true);
                                                        }}
                                                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 outline-none hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                                                    >
                                                        <div className="bg-red-50 p-1.5 rounded-lg">
                                                            <Trash2 size={18} />
                                                        </div>
                                                        Supprimer
                                                    </DropdownMenu.Item>
                                                </DropdownMenu.Content>
                                            </DropdownMenu.Portal>
                                        </DropdownMenu.Root>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Vue Ordinateur (Tableau) - Masqué sur Tablette & Mobile */}
                    <div className="hidden lg:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.1em] border-b border-slate-100">
                                    <th className="px-6 py-4">N° Facture</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Montant</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-mono font-bold text-slate-700">{inv.invoice_number}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{inv.client_name}</div>
                                            <div className="text-xs text-slate-500">{inv.client_email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{new Date(inv.issue_date).toLocaleDateString('fr-FR')}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-green-600">
                                                {Number(inv.total_amount).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} FCFA
                                            </div>
                                            <div className="mt-1">{getStatusBadge(inv.status)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => handleEditClick(inv)}
                                                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger asChild>
                                                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors outline-none">
                                                            <MoreHorizontal size={18} />
                                                        </button>
                                                    </DropdownMenu.Trigger>
                                                    <DropdownMenu.Portal>
                                                        <DropdownMenu.Content
                                                            className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 w-56 animate-in fade-in zoom-in-95 duration-200 z-[100]"
                                                            align="end"
                                                        >
                                                            <DropdownMenu.Item onClick={() => handleDownload(inv)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                                                                <div className="bg-slate-100 p-1.5 rounded-lg text-slate-600">
                                                                    <FileDown size={18} />
                                                                </div>
                                                                Télécharger PDF
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item onClick={() => handlePrint(inv)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                                                                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                                                                    <Printer size={18} />
                                                                </div>
                                                                Imprimer
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item
                                                                onClick={() => handleShareWhatsApp(inv)}
                                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                                                            >
                                                                <div className="bg-green-50 p-1.5 rounded-lg text-green-600">
                                                                    <Share2 size={18} />
                                                                </div>
                                                                Partager media
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item 
                                                                onClick={() => {
                                                                    setInvoiceToPay(inv);
                                                                    setIsPaymentOpen(true);
                                                                }}
                                                                disabled={inv.status === 'paid'}
                                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 rounded-xl cursor-pointer transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                                                            >
                                                                <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600">
                                                                    <CreditCard size={18} />
                                                                </div>
                                                                Paiement
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />
                                                            <DropdownMenu.Item 
                                                                onClick={() => {
                                                                    setInvoiceToDelete(inv);
                                                                    setIsDeleteOpen(true);
                                                                }}
                                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 outline-none hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
                                                            >
                                                                <div className="bg-red-50 p-1.5 rounded-lg">
                                                                    <Trash2 size={18} />
                                                                </div>
                                                                Supprimer
                                                            </DropdownMenu.Item>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Portal>
                                                </DropdownMenu.Root>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* <InvoiceShareDialog
                open={isShareOpen}
                onClose={() => { setIsShareOpen(false); }}
                inv={selectedInvoice}
            /> */}

            <DeleteConfirmDialog
                open={isDeleteOpen}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setInvoiceToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Supprimer la facture ?"
                description={`Cette action est irréversible. La facture ${invoiceToDelete?.invoice_number} sera définitivement supprimée.`}
                confirmValue={invoiceToDelete?.invoice_number}
                itemName="facture"
            />

            <RecordPaymentDialog
                open={isPaymentOpen}
                onClose={() => {
                    setIsPaymentOpen(false);
                    setInvoiceToPay(null);
                }}
                onConfirm={handleRecordPayment}
                invoice={invoiceToPay}
            />
        </div>
    );
};

export default InvoiceList;
