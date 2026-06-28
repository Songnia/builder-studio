import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface RecordPaymentDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => Promise<void>;
    invoice: any;
}

const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({ open, onClose, onConfirm, invoice }) => {
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!invoice) return null;

    const remainingAmount = invoice.total_amount - (invoice.amount_paid || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = Number(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            toast.error("Veuillez entrer un montant valide.");
            return;
        }

        if (numAmount > remainingAmount) {
            toast.error(`Le montant ne peut pas dépasser le reste à payer (${remainingAmount} FCFA).`);
            return;
        }

        setIsSubmitting(true);
        try {
            await onConfirm(numAmount);
            setAmount('');
            onClose();
        } catch (error) {
            // Error handling is managed by the parent
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] animate-in fade-in duration-200" />
                <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-3xl shadow-2xl p-6 w-[90vw] max-w-md z-[201] animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <div className="bg-green-50 p-2.5 rounded-xl">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                        <Dialog.Close className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <Dialog.Title className="text-xl font-bold text-slate-800 mb-2">
                        Enregistrer un paiement
                    </Dialog.Title>
                    <Dialog.Description className="text-slate-500 text-sm mb-6">
                        Facture N° <span className="font-mono font-bold text-slate-700">{invoice.invoice_number}</span>
                    </Dialog.Description>

                    <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">Total facture :</span>
                            <span className="font-bold text-slate-700">{Number(invoice.total_amount).toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">Déjà payé :</span>
                            <span className="font-bold text-green-600">{Number(invoice.amount_paid || 0).toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                            <span className="font-bold text-slate-700">Reste à payer :</span>
                            <span className="font-bold text-red-600">{Number(remainingAmount).toLocaleString('fr-FR')} FCFA</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Montant du paiement (FCFA)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                max={remainingAmount}
                                step="any"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all font-mono"
                                placeholder={`Ex: ${remainingAmount}`}
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !amount}
                                className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-200 flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    "Confirmer"
                                )}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default RecordPaymentDialog;
