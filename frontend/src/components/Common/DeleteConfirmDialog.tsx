import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    title: string;
    description: string;
    confirmValue?: string; // Si fourni, l'utilisateur doit taper ce texte pour confirmer
    itemName?: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmValue
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const isConfirmDisabled = confirmValue ? inputValue !== confirmValue : false;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
            setInputValue('');
        } catch (error) {
            console.error("Erreur lors de la suppression", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={(val) => !isDeleting && !val && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[440px] bg-white rounded-[2rem] shadow-2xl z-[151] overflow-hidden animate-in zoom-in-95 duration-300 outline-none">
                    <div className="p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                                <AlertTriangle className="text-red-500" size={24} />
                            </div>
                            <div className="flex-1">
                                <Dialog.Title className="text-xl font-bold text-slate-900 mb-1">
                                    {title}
                                </Dialog.Title>
                                <Dialog.Description className="text-sm text-slate-500 leading-relaxed">
                                    {description}
                                </Dialog.Description>
                            </div>
                        </div>

                        {confirmValue && (
                            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    Veuillez saisir <span className="text-slate-900 underline decoration-red-200 decoration-2 select-all px-1 bg-white rounded border border-slate-200">{confirmValue}</span> pour confirmer
                                </p>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={confirmValue}
                                    autoFocus
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-red-500 transition-all text-sm font-mono"
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isDeleting}
                                className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isConfirmDisabled || isDeleting}
                                className="flex-[1.5] px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-100 text-sm flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Suppression...
                                    </>
                                ) : (
                                    'Supprimer définitivement'
                                )}
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={onClose} 
                        disabled={isDeleting}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default DeleteConfirmDialog;
