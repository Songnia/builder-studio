import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useInvoiceState } from '@/hooks/useInvoiceState';
import InvoiceHeaderForm from '@/components/Invoice/InvoiceHeaderForm';
import InvoiceLineItems from '@/components/Invoice/InvoiceLineItems';
import InvoicePreview from '@/components/Invoice/InvoicePreview';
import InvoiceSummary from '@/components/Invoice/InvoiceSummary';
import InvoiceList from '@/components/Invoice/InvoiceList';
import { api } from '@/services/api';
import { siteConfigService } from '@/services/siteConfigService';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Eye, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const MOCK_STUDIO_DATA = {
    logoUrl: '/logo.png',
    photographerName: 'Vanda Studio',
    email: 'contact@vanda-studio.org',
    address: 'Paris, France',
    phone: '+221 00 000 00 00'
};

type InvoiceTab = 'list' | 'create';

function getTabFromPath(pathname: string): InvoiceTab {
    return pathname === '/admin/invoices/new' ? 'create' : 'list';
}

const InvoiceBuilder: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<InvoiceTab>(() => getTabFromPath(location.pathname));
    const [isSaving, setIsSaving] = useState(false);
    const {
        invoice,
        totals,
        updateMetadata,
        updateClient,
        updateStudio,
        updateLineItem,
        addLineItem,
        removeLineItem,
        setFullInvoice,
        resetInvoice
    } = useInvoiceState(MOCK_STUDIO_DATA);

    const isEditing = !!(invoice as any).id;

    useEffect(() => {
        setActiveTab(getTabFromPath(location.pathname));
    }, [location.pathname]);

    // Charger les informations du photographe depuis la config du site
    useEffect(() => {
        const loadStudioInfo = async () => {
            try {
                const configs = await siteConfigService.getMyConfigs();
                if (configs && configs.length > 0) {
                    const primaryConfig = configs[0].config_data;
                    updateMetadata('studio', {
                        logoUrl: primaryConfig.logo || '/logo.png',
                        photographerName: primaryConfig.siteName || 'Vanda Studio',
                        email: primaryConfig.email || 'contact@vanda-studio.org',
                        address: `${primaryConfig.address || ''} ${primaryConfig.city || ''}, ${primaryConfig.country || ''}`.trim() || 'Paris, France',
                        phone: primaryConfig.phone || '+221 00 000 00 00'
                    });
                }
            } catch (error) {
                console.error("Erreur lors du chargement de la config du studio", error);
            }
        };

        if (!isEditing) {
            loadStudioInfo();
        }
    }, [isEditing]);

    const handleEditInvoice = (invData: any) => {
        setFullInvoice(invData);
        navigate('/admin/invoices/new');
    };

    const handleCreateNew = () => {
        resetInvoice();
        navigate('/admin/invoices/new');
    };

    const handleTabChange = (value: string) => {
        const nextTab = value as InvoiceTab;
        setActiveTab(nextTab);
        navigate(nextTab === 'create' ? '/admin/invoices/new' : '/admin/invoices');
    };

    const handleSave = async () => {
        if (!invoice.client.name || !invoice.client.email) {
            toast.error("Informations client incomplètes.");
            return;
        }

        // Filtrage des items valides (on ignore ceux sans description)
        const validItems = invoice.items.filter(item => item.description.trim() !== "");

        if (validItems.length === 0) {
            toast.error("Veuillez ajouter au moins une prestation avec une description.");
            return;
        }

        const payload = {
            invoice_number: invoice.number,
            issue_date: invoice.issueDate,
            due_date: invoice.dueDate,
            client_name: invoice.client.name,
            client_email: invoice.client.email,
            client_phone: invoice.client.phone,
            client_address: invoice.client.address,
            items: validItems.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                total: item.total
            })),
            tax_rate: invoice.taxRate,
            include_tax: invoice.includeTax,
            total_amount: totals.grandTotal,
            amount_paid: invoice.amountPaid || 0,
            studio_info: JSON.stringify(invoice.studio)
        };

        setIsSaving(true);
        try {
            if (isEditing) {
                await api.put(`/admin/invoices/${(invoice as any).id}`, payload);
                toast.success("Modifications enregistrées !");
            } else {
                await api.post('/admin/invoices', payload);
                toast.success("Facture enregistrée !");
            }
            resetInvoice();
            navigate('/admin/invoices');
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f8f5] p-3 md:p-8">
            <div className="max-w-7xl mx-auto mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">Module de Facturation</h1>
                    <p className="text-xs md:text-sm text-slate-500">Gérez vos prestations et vos revenus</p>
                </div>
            </div>

            <Tabs.Root value={activeTab} onValueChange={handleTabChange} className="max-w-7xl mx-auto">
                <Tabs.List className="flex gap-4 md:gap-8 mb-6 md:mb-10 border-b border-slate-200 overflow-x-auto no-scrollbar scroll-smooth">
                    <Tabs.Trigger
                        value="list"
                        className={`pb-4 text-[11px] md:text-[13px] font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeTab === 'list' ? 'text-green-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Liste des factures
                        {activeTab === 'list' && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-600 rounded-t-full" />
                        )}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="create"
                        className={`pb-4 text-[11px] md:text-[13px] font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${activeTab === 'create' ? 'text-green-600' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        {isEditing ? "Modifier la facture" : "Nouvelle Facture"}
                        {activeTab === 'create' && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-600 rounded-t-full" />
                        )}
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="list" className="outline-none">
                    <InvoiceList
                        onCreateNew={handleCreateNew}
                        onEdit={handleEditInvoice}
                    />
                </Tabs.Content>

                <Tabs.Content value="create" className="outline-none space-y-8 pb-20">
                    <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm sm:hidden mb-6">
                        <Dialog.Root>
                            <Dialog.Trigger asChild>
                                <button className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-all font-bold flex items-center justify-center gap-2 text-xs">
                                    <Eye size={16} />
                                    Aperçu Facture
                                </button>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] animate-in fade-in" />
                                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-[101] animate-in zoom-in-95 duration-300">
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="text-xl font-bold">Aperçu</h2>
                                            <Dialog.Close asChild>
                                                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                                    <X size={24} />
                                                </button>
                                            </Dialog.Close>
                                        </div>
                                        <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm scale-90 origin-top">
                                            <InvoicePreview invoice={invoice} totals={totals} />
                                        </div>
                                    </div>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Zone de formulaire (Gauche) */}
                        <div className="space-y-8">
                            <section className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-sm">
                                <InvoiceHeaderForm
                                    invoice={invoice}
                                    onUpdateMetadata={updateMetadata}
                                    onUpdateClient={updateClient}
                                    onUpdateStudio={updateStudio}
                                />
                            </section>

                            <section className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Prestations</h2>
                                    <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase">
                                        {invoice.items.length} Ligne(s)
                                    </div>
                                </div>
                                <InvoiceLineItems
                                    items={invoice.items}
                                    onUpdateItem={updateLineItem}
                                    onAddItem={addLineItem}
                                    onRemoveItem={removeLineItem}
                                />
                            </section>

                            <section className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-3xl border border-slate-100 shadow-sm">
                                <InvoiceSummary
                                    totals={totals}
                                    taxRate={invoice.taxRate}
                                    includeTax={invoice.includeTax}
                                    onToggleTax={(val) => updateMetadata('includeTax', val)}
                                    onUpdateTaxRate={(val) => updateMetadata('taxRate', val)}
                                />
                                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => {
                                            resetInvoice();
                                            navigate('/admin/invoices');
                                        }}
                                        className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-base order-2 sm:order-1"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 bg-green-600 text-white px-8 py-4 rounded-2xl hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-xl shadow-green-100 font-bold text-base flex items-center justify-center gap-3 order-1 sm:order-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Enregistrement...
                                            </>
                                        ) : (
                                            isEditing ? "Mettre à jour" : "Enregistrer la facture"
                                        )}
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Zone d'aperçu en direct (Droite - Visible uniquement sur Desktop) */}
                        <div className="hidden lg:block sticky top-8">
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden transform transition-transform hover:scale-[1.01] duration-500">
                                <div className="bg-slate-900 px-8 py-4 flex justify-between items-center">
                                    <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Aperçu en temps réel</span>
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
                                    </div>
                                </div>
                                <div className="p-4 scale-[0.85] origin-top bg-white">
                                    <InvoicePreview invoice={invoice} totals={totals} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
};

export default InvoiceBuilder;
