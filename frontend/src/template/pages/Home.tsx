import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Button } from '@mui/material';
import { useSiteConfig } from '@/context/SiteConfigContext';
import Hero from '../components/Home/Hero';
import ServicesSection from '../components/Home/ServicesSection';
import PricingSection from '../components/Home/PricingSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import FlashInfo from '../components/Home/FlashInfo';
import FilterChips from '../components/Portfolio/FilterChips';
import MasonryGrid from '../components/Portfolio/MasonryGrid';
import WhatsAppFAB from '../components/Common/WhatsAppFAB';
import PromoBubble from '../components/Home/PromoBubble';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useSitePath } from '@/template/hooks/useSitePath';

const Home: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Work');
    const [visibleCount, setVisibleCount] = useState(9);
    const navigate = useNavigate();
    const { getPath } = useSitePath();
    const { config } = useSiteConfig();

    const showPortfolio = config?.enabledSections.portfolio && config?.photos && config.photos.length > 0;

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setVisibleCount(9); // Reset visible count when category changes
    };

    const handleLoadMore = () => {
        navigate(getPath('/portfolio'), { state: { selectedCategory } });
    };

    return (
        <Box sx={{ width: '100%', m: 0, p: 0 }}>
            <Hero />
            <Container
                maxWidth="lg"
                sx={{
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 3, md: 6 },
                }}
            >
                <FlashInfo />
                {showPortfolio && (
                    <>
                        <Box sx={{ mb: { xs: 3, md: 5 } }}>
                            <FilterChips
                                selectedCategory={selectedCategory}
                                onSelectCategory={handleCategoryChange}
                            />
                        </Box>
                        <MasonryGrid
                            selectedCategory={selectedCategory}
                            visibleCount={visibleCount}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                size="large"
                                endIcon={<AddCircleOutlineIcon />}
                                onClick={handleLoadMore}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'primary.contrastText',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 50,
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                        color: 'primary.contrastText',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Voir plus de {selectedCategory === 'All Work' ? 'projets' : selectedCategory}
                            </Button>
                        </Box>
                    </>
                )}
            </Container>
            <ServicesSection />
            <PricingSection />

            {/* <SkillsetSection /> */}

            <TestimonialsSection />
            <WhatsAppFAB />
            <PromoBubble />
        </Box>
    );
};

export default Home;
