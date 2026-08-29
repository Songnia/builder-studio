import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// Placeholder images
const shootingImage = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500';
const postProductionImage = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500';
const formationImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500';
const locationImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500';

const ServicesSection: React.FC = () => {
    const { t } = useTranslation();
    const { config } = useSiteConfig();

    if (!config || !config.enabledSections.services || !config.services || config.services.length === 0) return null;

    // Default images for services
    const defaultServiceImages = [shootingImage, postProductionImage, formationImage, locationImage];

    // Use config.services
    const displayServices = config.services.map((service, index) => ({
        id: parseInt(service.id) || index,
        title: service.title,
        description: service.description,
        details: service.features || [],
        image: service.image || defaultServiceImages[index % defaultServiceImages.length],
        ctaText: 'Contactez-nous',
        whatsappMessage: `Je suis intéressé par ${service.title}`
    }));

    const handleWhatsAppClick = (message: string) => {
        const phoneNumber = config.phone.replace(/\D/g, '') || '237698399985';
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'background.default' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Section Header */}
                <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        className="section-main-title"
                        sx={{
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        }}
                    >
                        {t('home.services.title')}
                    </Typography>
                    <Typography
                        variant="h6"
                        className="section-main-subtitle"
                        sx={{ maxWidth: 'md', mx: 'auto' }}
                    >
                        {t('home.services.subtitle')}
                    </Typography>
                </Box>

                {/* Services Grid - Alternating Layout */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 6, md: 10 } }}>
                    {displayServices.map((service, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <Box
                                key={service.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: {
                                        xs: 'column',
                                        md: isEven ? 'row' : 'row-reverse',
                                    },
                                    alignItems: 'center',
                                    gap: { xs: 3, md: 6 },
                                }}
                            >
                                {/* Image Side */}
                                <Box
                                    sx={{
                                        flex: '0 0 auto',
                                        width: { xs: '100%', md: '45%' },
                                        height: { xs: 250, md: 350 },
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        boxShadow: 3,
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>

                                {/* Text Content Side */}
                                <Box sx={{ flex: '1 1 auto', width: { xs: '100%', md: '55%' } }}>
                                    <Typography
                                        variant="h4"
                                        className="section-main-title"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                        }}
                                    >
                                        {service.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        className="section-main-text"
                                        sx={{ mb: 3, fontSize: { xs: '0.95rem', md: '1.1rem' } }}
                                    >
                                        {service.description}
                                    </Typography>

                                    <Box component="ul" sx={{ pl: 2, m: 0, mb: 3 }}>
                                        {service.details.map((detail, idx) => (
                                            <Typography
                                                key={idx}
                                                component="li"
                                                variant="body2"
                                                className="section-main-muted"
                                                sx={{
                                                    mb: 1,
                                                    fontSize: { xs: '0.9rem', md: '1rem' },
                                                }}
                                            >
                                                {detail}
                                            </Typography>
                                        ))}
                                    </Box>

                                    {/* CTA Link */}
                                    <Link
                                        component="button"
                                        onClick={() => handleWhatsAppClick(service.whatsappMessage)}
                                        underline="none"
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 1.5,
                                            color: 'primary.contrastText',
                                            backgroundColor: 'primary.main',
                                            px: 3,
                                            py: 1.25,
                                            borderRadius: '9999px',
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            boxShadow: '0 2px 8px var(--primary-color)33',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 12px var(--primary-color)55',
                                            }
                                        }}
                                    >
                                        <WhatsAppIcon fontSize="small" />
                                        {service.ctaText}
                                    </Link>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
};

export default ServicesSection;
