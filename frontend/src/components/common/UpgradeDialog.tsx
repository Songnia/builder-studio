import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Rocket, Star, TrendingUp, X } from 'lucide-react';
import { useEffect } from 'react';

interface UpgradeDialogProps {
    open: boolean;
    onClose: () => void;
    feature: 'photos' | 'galleries' | 'domain' | 'branding' | 'publish';
    currentPlan?: 'starter' | 'pro' | 'studio';
}

export function UpgradeDialog({ open, onClose, feature, currentPlan = 'starter' }: UpgradeDialogProps) {
    const navigate = useNavigate();

    // Track when dialog is shown
    useEffect(() => {
        if (open) {
            // Original tracking removed
        }
    }, [open, feature, currentPlan]);

    const getFeatureContext = () => {
        switch (feature) {
            case 'photos':
                return {
                    title: '📸 Plus de photos pour briller',
                    message: 'Vous avez atteint la limite de 20 photos pour le plan Starter.',
                    currentLimit: '20 photos',
                    proLimit: '500 photos',
                    icon: <Rocket className="w-12 h-12 text-blue-600" />
                };
            case 'galleries':
                return {
                    title: '🎨 Créez plus de galeries',
                    message: 'Vous avez atteint la limite de 4 galeries par mois pour le plan Starter.',
                    currentLimit: '4 galeries/mois',
                    proLimit: '20 galeries/mois',
                    icon: <Star className="w-12 h-12 text-blue-600" />
                };
            case 'domain':
                return {
                    title: '🌐 Connectez votre domaine',
                    message: 'Le domaine personnalisé est une fonctionnalité PRO.',
                    currentLimit: 'Sous-domaine uniquement',
                    proLimit: 'Domaine personnalisé inclus',
                    icon: <TrendingUp className="w-12 h-12 text-blue-600" />
                };
            case 'branding':
                return {
                    title: '✨ Retirez le watermark',
                    message: 'Retirez la marque VANDA STUDIO et utilisez votre propre branding.',
                    currentLimit: 'Avec watermark',
                    proLimit: 'Sans watermark',
                    icon: <Star className="w-12 h-12 text-blue-600" />
                };
            case 'publish':
                return {
                    title: '🚀 Publiez votre site',
                    message: 'La publication de votre site nécessite un abonnement actif.',
                    currentLimit: 'Brouillon',
                    proLimit: 'En ligne',
                    icon: <Rocket className="w-12 h-12 text-blue-600" />
                };
            default:
                return {
                    title: 'Débloquez plus de puissance',
                    message: 'Passez au plan PRO pour accéder à cette fonctionnalité.',
                    currentLimit: '',
                    proLimit: '',
                    icon: <Rocket className="w-12 h-12 text-blue-600" />
                };
        }
    };

    const context = getFeatureContext();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 rounded-full"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>

                <DialogHeader>
                    <div className="flex flex-col items-center text-center mb-4">
                        <div className="mb-4 p-4 bg-blue-50 rounded-full">
                            {context.icon}
                        </div>
                        <DialogTitle className="text-2xl font-bold mb-2">
                            {context.title}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            {context.message}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Comparison */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-xs text-gray-500 uppercase mb-1">Starter</div>
                            <div className="font-semibold text-gray-700">{context.currentLimit}</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg text-center border-2 border-blue-200">
                            <div className="text-xs text-blue-600 uppercase mb-1 font-bold">PRO ⭐</div>
                            <div className="font-bold text-blue-600">{context.proLimit}</div>
                        </div>
                    </div>

                    {/* Benefits List */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 text-sm">Débloquez avec PRO :</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                                <span className="text-blue-600">✓</span> Pages illimitées
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-blue-600">✓</span> 500 photos portfolio
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-blue-600">✓</span> 20 galeries/mois
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-blue-600">✓</span> Domaine personnalisé
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-blue-600">✓</span> Sans watermark
                            </li>
                        </ul>
                    </div>

                    {/* Pricing */}
                    <div className="text-center py-2">
                        <div className="text-3xl font-bold text-gray-900">15 000 FCFA</div>
                        <div className="text-sm text-gray-500">/mois</div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Rester sur Starter
                    </Button>
                    <Button
                        onClick={() => {
                            navigate('/admin/subscription');
                            onClose();
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        Passer à PRO →
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
