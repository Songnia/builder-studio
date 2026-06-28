import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/template/context/CartContext';
import WhatsAppOrderForm from './WhatsAppOrderForm';

const CartDrawer: React.FC = () => {
    const { t } = useTranslation();
    const { isCartOpen, closeCart, items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [isOrderFormOpen, setIsOrderFormOpen] = React.useState(false);

    return (
        <>
            <Drawer
                anchor="right"
                open={isCartOpen}
                onClose={closeCart}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: 400 } }
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Header */}
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight="bold">
                            {t('shop.cart.title')} ({items.length})
                        </Typography>
                        <IconButton onClick={closeCart}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Cart Items */}
                    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                        {items.length === 0 ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 3, textAlign: 'center' }}>
                                <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    {t('shop.cart.empty')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {t('shop.cart.emptyDesc')}
                                </Typography>
                                <Button variant="outlined" onClick={closeCart}>
                                    {t('shop.cart.continueShopping')}
                                </Button>
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {items.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    variant="rounded"
                                                    src={item.image}
                                                    alt={item.name}
                                                    sx={{ width: 60, height: 60, mr: 2 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {item.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                sx={{ p: 0.5 }}
                                                            >
                                                                <Typography variant="body2">-</Typography>
                                                            </IconButton>
                                                            <Typography variant="body2" sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                                                                {item.quantity}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                sx={{ p: 0.5 }}
                                                            >
                                                                <Typography variant="body2">+</Typography>
                                                            </IconButton>
                                                        </Box>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {item.price}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                            <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)} size="small" sx={{ mt: 0.5 }}>
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </ListItem>
                                        <Divider component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Box>

                    {/* Footer */}
                    {items.length > 0 && (
                        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="subtitle1">{t('shop.cart.subtotal')}</Typography>
                                <Typography variant="subtitle1" fontWeight="bold">{cartTotal.toLocaleString()} Fcfa</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={() => setIsOrderFormOpen(true)}
                                startIcon={<WhatsAppIcon />}
                                color="success"
                                sx={{
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    color: 'white'
                                }}
                            >
                                {t('shop.cart.checkoutWhatsApp')}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
            <WhatsAppOrderForm open={isOrderFormOpen} onClose={() => setIsOrderFormOpen(false)} />
        </>
    );
};

export default CartDrawer;
