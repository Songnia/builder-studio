import React from 'react';
import { Box, Container, Typography, Card, CardContent, CardActions, Button, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext';

const PricingSection: React.FC = () => {
    const { t } = useTranslation();
    const { config } = useSiteConfig();

    if (!config || !config.enabledSections.pricing || !config.pricingPlans || config.pricingPlans.length === 0) return null;

    // Use config.pricingPlans
    const displayPackages = config.pricingPlans.map(plan => ({
        title: plan.name,
        price: plan.price,
        description: plan.description,
        features: plan.features || [],
        buttonText: 'Réserver',
        highlight: plan.recommended || false
    }));

    return (
        <Box id="pricing-section" sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'secondary.main' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                        {t('home.pricing.overline')}
                    </Typography>
                    <Typography variant="h3" className="section-alt-title" sx={{ fontWeight: 'bold', mt: 1, mb: 2 }}>
                        {t('home.pricing.title')}
                    </Typography>
                    <Typography variant="body1" className="section-alt-subtitle" sx={{ maxWidth: 'md', mx: 'auto' }}>
                        {t('home.pricing.subtitle')}
                    </Typography>
                </Box>

                {/* Pricing Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, alignItems: 'end' }}>
                    {displayPackages.map((pkg, index) => (
                        <Box key={index}>
                            <Card
                                elevation={pkg.highlight ? 8 : 1}
                                sx={{
                                    borderRadius: 4,
                                    position: 'relative',
                                    overflow: 'visible',
                                    border: pkg.highlight ? '2px solid' : '1px solid',
                                    borderColor: pkg.highlight ? 'primary.main' : 'divider',
                                    transform: pkg.highlight ? { md: 'scale(1.05)' } : 'none',
                                    zIndex: pkg.highlight ? 2 : 1,
                                    transition: 'transform 0.3s',
                                    '&:hover': {
                                        transform: pkg.highlight ? { md: 'scale(1.08)' } : 'translateY(-8px)',
                                    },
                                }}
                            >
                                {pkg.highlight && (
                                    <Chip
                                        icon={<StarIcon sx={{ color: 'primary.contrastText !important' }} />}
                                        label={t('home.pricing.recommended')}
                                        color="primary"
                                        sx={{
                                            position: 'absolute',
                                            top: -16,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontWeight: 'bold',
                                            color: 'primary.contrastText',
                                        }}
                                    />
                                )}
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                                        {pkg.title}
                                    </Typography>
                                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
                                        {pkg.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                        {pkg.description}
                                    </Typography>

                                    <List sx={{ textAlign: 'left', mb: 2 }}>
                                        {pkg.features.map((feature, idx) => (
                                            <ListItem key={idx} disablePadding sx={{ mb: 1.5 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <CheckCircleIcon sx={{ color: 'primary.main' }} />
                                                </ListItemIcon>
                                                <ListItemText primary={feature} primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                                <CardActions sx={{ p: 4, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant={pkg.highlight ? 'contained' : 'outlined'}
                                        color="primary"
                                        size="large"
                                        onClick={() => {
                                            const message = t('home.pricing.whatsappTemplate', {
                                                title: pkg.title,
                                                price: pkg.price
                                            });
                                            const phoneNumber = config.phone.replace(/\D/g, '') || '237698399985';
                                            const encodedMessage = encodeURIComponent(message);
                                            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
                                        }}
                                        sx={{
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            borderRadius: 2,
                                            color: pkg.highlight ? 'primary.contrastText' : 'primary.main',
                                            borderWidth: 2,
                                            borderColor: 'primary.main',
                                            '&:hover': {
                                                borderWidth: 2,
                                                borderColor: 'primary.main',
                                                backgroundColor: pkg.highlight ? 'primary.dark' : 'primary.transparent',
                                            }
                                        }}
                                    >
                                        {pkg.buttonText}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default PricingSection;
