import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext';
import FilterChips from '../components/Portfolio/FilterChips';
import MasonryGrid from '../components/Portfolio/MasonryGrid';
import WhatsAppFAB from '../components/Common/WhatsAppFAB';

const Portfolio: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState('All Work');
    const [visibleCount, setVisibleCount] = useState(100); // Show all items by default on Portfolio page
    const { config } = useSiteConfig();

    const showPortfolio = config?.enabledSections.portfolio && config?.photos && config.photos.length > 0;

    useEffect(() => {
        if (location.state && location.state.selectedCategory) {
            setSelectedCategory(location.state.selectedCategory);
            // Scroll to the content
            setTimeout(() => {
                const element = document.getElementById('portfolio-start');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [location.state]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setVisibleCount(100);
    };

    return (
        <Box sx={{ py: { xs: 3, md: 6 } }}>
            <Container
                maxWidth="lg"
                sx={{ px: { xs: 2, sm: 3, md: 4 } }}
            >
                <Box sx={{ mb: { xs: 3, md: 5 } }} id="portfolio-start">
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
                        }}
                    >
                        {t('portfolio.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('portfolio.subtitle')}
                    </Typography>
                </Box>
                {showPortfolio ? (
                    <>
                        <Box sx={{ mb: { xs: 3, md: 4 } }}>
                            <FilterChips
                                selectedCategory={selectedCategory}
                                onSelectCategory={handleCategoryChange}
                            />
                        </Box>
                        <MasonryGrid
                            selectedCategory={selectedCategory}
                            visibleCount={visibleCount}
                        />
                    </>
                ) : (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">
                            Aucune photo disponible pour le moment.
                        </Typography>
                    </Box>
                )}
            </Container>
            <WhatsAppFAB />
        </Box>
    );
};

export default Portfolio;
