import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { InvoiceLineItem } from '@/types/invoice';

interface LineItemsProps {
    items: InvoiceLineItem[];
    onUpdateItem: (id: string, field: any, value: any) => void;
    onAddItem: () => void;
    onRemoveItem: (id: string) => void;
}

const InvoiceLineItems: React.FC<LineItemsProps> = ({ items, onUpdateItem, onAddItem, onRemoveItem }) => {
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 mb-2">
                <div className="col-span-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</div>
                <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qté</div>
                <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Prix Unitaire</div>
                <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Total HT</div>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.id} className="group relative grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-green-200 transition-all">
                        <div className="lg:col-span-4">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest lg:hidden mb-1 block ml-2">Description</label>
                            <input 
                                type="text"
                                placeholder="Nom de la prestation..."
                                value={item.description || ''}
                                onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                                className="w-full bg-white rounded-lg px-3 py-2 outline-none text-slate-800 font-semibold text-sm border border-black focus:ring-1 focus:ring-green-500"
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest lg:hidden mb-1 block ml-2">Quantité</label>
                            <input 
                                type="number"
                                step="any"
                                value={item.quantity === 0 ? '' : item.quantity}
                                min="0"
                                onChange={(e) => {
                                    const val = e.target.value.replace(',', '.');
                                    const parsed = parseFloat(val);
                                    onUpdateItem(item.id, 'quantity', isNaN(parsed) ? 0 : parsed);
                                }}
                                className="w-full bg-white rounded-lg px-2 py-2 outline-none text-center font-mono text-xs border border-black focus:ring-1 focus:ring-green-500"
                            />
                        </div>
                        <div className="lg:col-span-3">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest lg:hidden mb-1 block ml-2 text-right mr-2">Prix Unitaire</label>
                            <div className="relative">
                                <input 
                                    type="number"
                                    step="any"
                                    value={item.unitPrice === 0 ? '' : item.unitPrice}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(',', '.');
                                        const parsed = parseFloat(val);
                                        onUpdateItem(item.id, 'unitPrice', isNaN(parsed) ? 0 : parsed);
                                    }}
                                    className="w-full bg-white rounded-lg pl-2 pr-10 py-2 outline-none text-right font-mono text-xs border border-black focus:ring-1 focus:ring-green-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">FCFA</span>
                            </div>
                        </div>
                        <div className="lg:col-span-3 flex lg:flex-row flex-col items-end lg:items-center justify-end gap-3 lg:translate-x-2">
                             <div className="text-right flex lg:block justify-between w-full lg:w-auto items-baseline gap-4">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest lg:hidden">Total HT</span>
                                <span className="font-bold text-slate-900 tabular-nums text-sm">
                                    {Number(item.total).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} <span className="text-[10px]">FCFA</span>
                                </span>
                            </div>
                            <div className="relative">
                                {confirmingId === item.id ? (
                                    <button 
                                        onClick={() => { onRemoveItem(item.id); setConfirmingId(null); }}
                                        onMouseLeave={() => setConfirmingId(null)}
                                        className="bg-red-600 text-white text-[9px] px-3 py-2 rounded-full font-bold shadow-lg shadow-red-100 whitespace-nowrap"
                                    >
                                        SÛR ?
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setConfirmingId(item.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onAddItem}
                className="w-full mt-4 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-green-400 hover:text-green-600 transition-all"
            >
                <Plus size={14} />
                <span className="text-sm font-bold">Ajouter une prestation</span>
            </button>
        </div>
    );
};

export default InvoiceLineItems;
