import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { pdf } from '@react-pdf/renderer';
import { toast } from 'sonner';
import {
    X,
    Share2,
    Copy,
    Check,
    Mail,
    FileDown,
    Loader2,
    ExternalLink,
} from 'lucide-react';
import InvoicePDFDocument from './InvoicePDFDocument';

interface InvoiceShareDialogProps {
    open: boolean;
    onClose: () => void;
    inv: any;
}

const preparePDFBlob = async (inv: any): Promise<{ blob: Blob; studio: any }> => {
    let studio: any;
    try {
        studio = typeof inv.studio_info === 'string'
            ? JSON.parse(inv.studio_info)
            : (inv.studio_info || { logoUrl: '', photographerName: 'Vanda Studio', email: 'contact@vanda-studio.org', address: '', phone: '' });
    } catch {
        studio = { logoUrl: '', photographerName: 'Vanda Studio', email: 'contact@vanda-studio.org', address: '', phone: '' };
    }

    let logoBase64: string | undefined;
    if (studio.logoUrl) {
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

    const subtotal = inv.items.reduce((s: number, i: any) => s + Number(i.quantity) * Number(i.unit_price), 0);
    const taxAmount = inv.include_tax ? (subtotal * Number(inv.tax_rate)) / 100 : 0;
    const total = subtotal + taxAmount;

    const blob = await pdf(
        <InvoicePDFDocument inv={inv} studio={studio} logoBase64={logoBase64} subtotal={subtotal} taxAmount={taxAmount} total={total} />
    ).toBlob();

    return { blob, studio };
};

const InvoiceShareDialog: React.FC<InvoiceShareDialogProps> = ({ open, onClose, inv }) => {
    const [loading, setLoading] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    if (!inv) return null;

    const filename = `Facture_${inv.invoice_number}.pdf`;
    const amount = Number(inv.total_amount).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    const clientName = inv.client_name || 'Client';

    // --- Télécharger PDF ---
    const handleDownload = async () => {
        setLoading('download');
        try {
            const { blob } = await preparePDFBlob(inv);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename; a.click();
            URL.revokeObjectURL(url);
            toast.success('PDF téléchargé !');
        } catch { toast.error('Erreur lors du téléchargement.'); }
        finally { setLoading(null); }
    };

    // --- Partager via Web Share API (mobile) ---
    const handleNativeShare = async () => {
        setLoading('share');
        try {
            const { blob } = await preparePDFBlob(inv);
            const file = new File([blob], filename, { type: 'application/pdf' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `Facture ${inv.invoice_number}`,
                    text: `Voici votre facture de ${amount} FCFA`,
                    files: [file],
                });
            } else {
                // Fallback : copier le lien texte
                await navigator.clipboard.writeText(`Facture ${inv.invoice_number} - ${amount} FCFA`);
                toast.info('Lien copié (partage de fichier non supporté sur ce navigateur)');
            }
        } catch (e: any) {
            if (e?.name !== 'AbortError') toast.error('Partage annulé.');
        }
        finally { setLoading(null); }
    };

    // --- Partager via WhatsApp ---
    const handleWhatsApp = async () => {
        setLoading('whatsapp');
        try {
            const { blob } = await preparePDFBlob(inv);
            const url = URL.createObjectURL(blob);

            // Télécharger d'abord le PDF (WhatsApp ne peut pas recevoir de blob direct)
            const a = document.createElement('a');
            a.href = url; a.download = filename; a.click();
            URL.revokeObjectURL(url);

            // Ouvrir WhatsApp avec un message pré-rempli
            const phone = inv.client_phone ? inv.client_phone.replace(/[\s\-().+]/g, '') : '';
            const message = `Bonjour ${clientName} 👋\n\nVoici votre facture *${inv.invoice_number}* d'un montant de *${amount} FCFA*.\n\nLe fichier PDF a été téléchargé, vous pouvez l'envoyer depuis votre appareil.`;
            const waUrl = phone
                ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
                : `https://wa.me/?text=${encodeURIComponent(message)}`;

            setTimeout(() => window.open(waUrl, '_blank'), 500);
            toast.success('PDF téléchargé — WhatsApp ouvert !');
        } catch { toast.error('Erreur lors du partage WhatsApp.'); }
        finally { setLoading(null); }
    };

    // --- Partager par Email ---
    const handleEmail = async () => {
        setLoading('email');
        try {
            const { blob } = await preparePDFBlob(inv);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = filename; a.click();
            URL.revokeObjectURL(url);

            const subject = encodeURIComponent(`Facture ${inv.invoice_number} — ${amount} FCFA`);
            const body = encodeURIComponent(`Bonjour ${clientName},\n\nVeuillez trouver ci-joint votre facture ${inv.invoice_number} d'un montant de ${amount} FCFA.\n\nCordialement`);
            const emailUrl = inv.client_email
                ? `mailto:${inv.client_email}?subject=${subject}&body=${body}`
                : `mailto:?subject=${subject}&body=${body}`;

            window.location.href = emailUrl;
            toast.success('PDF téléchargé — Email ouvert !');
        } catch { toast.error('Erreur lors de l\'envoi email.'); }
        finally { setLoading(null); }
    };

    // --- Copier les infos ---
    const handleCopy = () => {
        const text = `Facture ${inv.invoice_number}\nClient : ${clientName}\nMontant : ${amount} FCFA\nDate : ${new Date(inv.issue_date).toLocaleDateString('fr-FR')}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Informations copiées !');
    };

    const Btn = ({
        icon: Icon, label, sublabel, color, action, id, disabled
    }: {
        icon: any; label: string; sublabel?: string; color: string; action: () => void; id: string; disabled?: boolean;
    }) => (
        <button
            onClick={action}
            disabled={disabled || loading === id}
            className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl border transition-all duration-200 text-left group
                ${loading === id ? 'opacity-70 cursor-wait' : 'hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'}
                ${color}`}
        >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/60 group-hover:scale-110 transition-transform">
                {loading === id ? <Loader2 size={20} className="animate-spin" /> : <Icon size={20} />}
            </div>
            <div>
                <div className="font-bold text-sm">{label}</div>
                {sublabel && <div className="text-xs opacity-70 mt-0.5">{sublabel}</div>}
            </div>
            <ExternalLink size={14} className="ml-auto opacity-40 group-hover:opacity-70" />
        </button>
    );

    return (
        <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 pt-6 pb-8">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
                                        <Share2 size={12} /> Partager la facture
                                    </div>
                                    <h2 className="text-white text-xl font-black">{inv.invoice_number}</h2>
                                    <p className="text-green-100 text-sm mt-1">{clientName} · <span className="font-bold text-white">{amount} FCFA</span></p>
                                </div>
                                <Dialog.Close asChild>
                                    <button className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors">
                                        <X size={20} />
                                    </button>
                                </Dialog.Close>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-5 py-5 space-y-3 -mt-4">
                            {/* Card flottante */}
                            <div className="bg-white rounded-2xl shadow-lg p-2 space-y-2">
                                <Btn
                                    id="whatsapp"
                                    icon={() => (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-600">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                    )}
                                    label="WhatsApp"
                                    sublabel={inv.client_phone ? `Envoyer à ${inv.client_phone}` : 'Message + PDF téléchargé'}
                                    color="bg-green-50 border-green-100 text-green-800"
                                    action={handleWhatsApp}
                                />
                                <Btn
                                    id="email"
                                    icon={Mail}
                                    label="Email"
                                    sublabel={inv.client_email ? `Envoyer à ${inv.client_email}` : 'Ouvrir le client mail'}
                                    color="bg-blue-50 border-blue-100 text-blue-800"
                                    action={handleEmail}
                                />
                                {typeof navigator !== 'undefined' && 'share' in navigator && (
                                    <Btn
                                        id="share"
                                        icon={Share2}
                                        label="Partager le fichier"
                                        sublabel="Via l'application de votre choix"
                                        color="bg-purple-50 border-purple-100 text-purple-800"
                                        action={handleNativeShare}
                                    />
                                )}
                                <Btn
                                    id="download"
                                    icon={FileDown}
                                    label="Télécharger PDF"
                                    sublabel="Sauvegarder sur votre appareil"
                                    color="bg-slate-50 border-slate-100 text-slate-700"
                                    action={handleDownload}
                                />
                            </div>

                            {/* Copier infos texte */}
                            <button
                                onClick={handleCopy}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                {copied ? 'Copié !' : 'Copier les informations de la facture'}
                            </button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default InvoiceShareDialog;
