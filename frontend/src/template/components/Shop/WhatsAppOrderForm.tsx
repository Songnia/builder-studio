import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/template/context/CartContext';
import { useSiteConfig } from '@/context/SiteConfigContext';

interface WhatsAppOrderFormProps {
    open: boolean;
    onClose: () => void;
}

const WhatsAppOrderForm: React.FC<WhatsAppOrderFormProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const { items, cartTotal } = useCart();
    const { config } = useSiteConfig();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({ name: false, phone: false });

    const validate = () => {
        const newErrors = {
            name: !name.trim(),
            phone: !phone.trim(),
        };
        setErrors(newErrors);
        return !newErrors.name && !newErrors.phone;
    };

    const handleOrder = () => {
        if (!validate()) return;

        // Construct the message
        let message = t('shop.orderForm.whatsappMessage');
        items.forEach(item => {
            message += `• ${item.name} x${item.quantity} - ${item.price}\n`;
        });
        message += `\nTotal: ${cartTotal.toLocaleString()} Fcfa\n\n`;
        message += t('contact.form.name') + `: ${name}\n`;
        message += t('contact.form.phone') + `: ${phone}`;

        // Encode and redirect
        const encodedMessage = encodeURIComponent(message);
        // Use the configured phone number
        const phoneNumber = config?.phone ? config.phone.replace(/\D/g, '') : "237698399985";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {t('shop.orderForm.title')}
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    <TextField
                        label={t('shop.orderForm.name')}
                        required
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                        helperText={errors.name ? t('shop.orderForm.nameRequired') : ""}
                    />
                    <TextField
                        label={t('shop.orderForm.phone')}
                        required
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={errors.phone}
                        helperText={errors.phone ? t('shop.orderForm.phoneRequired') : ""}
                    />

                    <Box sx={{ p: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                            {t('shop.orderForm.yourOrder')}
                        </Typography>
                        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'text.secondary' }}>
                            {t('shop.orderForm.whatsappMessage')}
                            {items.map(item => `• ${item.name} x${item.quantity} - ${item.price}\n`)}
                            {`\nTotal: ${cartTotal.toLocaleString()} Fcfa`}
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    {t('shop.orderForm.cancel')}
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleOrder}
                    startIcon={<WhatsAppIcon />}
                    sx={{ fontWeight: 'bold', color: 'white' }}
                >
                    {t('shop.orderForm.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WhatsAppOrderForm;
