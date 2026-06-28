import React from 'react';
import { Box, Container, Typography, Avatar, Paper } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext';

const TestimonialsSection: React.FC = () => {
    const { t } = useTranslation();
    const { config } = useSiteConfig();

    if (!config || !config.enabledSections.testimonials || !config.testimonials || config.testimonials.length === 0) return null;

    const testimonials = [
        {
            id: 1,
            name: t('home.testimonials.items.1.name'),
            role: t('home.testimonials.items.1.role'),
            content: t('home.testimonials.items.1.content'),
            rating: 5,
            avatar: 'https://source.unsplash.com/random/100x100?couple',
        },
        {
            id: 2,
            name: t('home.testimonials.items.2.name'),
            role: t('home.testimonials.items.2.role'),
            content: t('home.testimonials.items.2.content'),
            rating: 5,
            avatar: 'https://source.unsplash.com/random/100x100?man',
        },
        {
            id: 3,
            name: t('home.testimonials.items.3.name'),
            role: t('home.testimonials.items.3.role'),
            content: t('home.testimonials.items.3.content'),
            rating: 5,
            avatar: 'https://source.unsplash.com/random/100x100?woman',
        },
    ];

    // Use config.testimonials
    const displayTestimonials = config.testimonials;

    return (
        <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'grey.50' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                        {t('home.testimonials.overline')}
                    </Typography>
                    <Typography variant="h3" className="section-main-title" sx={{ fontWeight: 'bold', mt: 1, mb: 2 }}>
                        {t('home.testimonials.title')}
                    </Typography>
                    <Typography variant="body1" className="section-main-subtitle" sx={{ maxWidth: 'md', mx: 'auto' }}>
                        {t('home.testimonials.subtitle')}
                    </Typography>
                </Box>

                {/* Testimonials Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 4,
                    }}
                >
                    {displayTestimonials.map((testimonial) => (
                        <Paper
                            key={testimonial.id}
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 4,
                                backgroundColor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                position: 'relative',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: 4,
                                    borderColor: 'primary.main',
                                },
                            }}
                        >
                            <FormatQuoteIcon
                                sx={{
                                    position: 'absolute',
                                    top: 24,
                                    right: 24,
                                    fontSize: 40,
                                    color: 'primary.main',
                                    opacity: 0.2,
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Typography key={i} component="span" sx={{ color: 'primary.main' }}>★</Typography>
                                ))}
                            </Box>

                            <Typography variant="body1" sx={{ mb: 4, fontStyle: 'italic', lineHeight: 1.6 }}>
                                "{testimonial.content}"
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    sx={{ width: 48, height: 48, border: '2px solid', borderColor: 'primary.main' }}
                                />
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                                        {testimonial.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {testimonial.role}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default TestimonialsSection;
