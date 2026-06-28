import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import PortraitIcon from '@mui/icons-material/Portrait';
import LandscapeIcon from '@mui/icons-material/Landscape';
import BusinessIcon from '@mui/icons-material/Business';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useTranslation } from 'react-i18next';
import studioImage from '/skillset_studio_setup_1768795996549.png';
import urbanImage from '/skillset_urban_photographer_1768796012189.png';
import cameraImage from '/postproduction_service_composition_1768795547698.png';

const SkillsetSection: React.FC = () => {
    const { t } = useTranslation();

    const skills = [
        { icon: <PortraitIcon fontSize="large" />, title: t('home.skillset.skills.portraits.title'), desc: t('home.skillset.skills.portraits.desc') },
        { icon: <LandscapeIcon fontSize="large" />, title: t('home.skillset.skills.landscapes.title'), desc: t('home.skillset.skills.landscapes.desc') },
        { icon: <BusinessIcon fontSize="large" />, title: t('home.skillset.skills.commercial.title'), desc: t('home.skillset.skills.commercial.desc') },
        { icon: <FavoriteIcon fontSize="large" />, title: t('home.skillset.skills.weddings.title'), desc: t('home.skillset.skills.weddings.desc') },
    ];

    return (
        <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.paper', color: 'text.primary', overflow: 'hidden' }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 8, md: 8 }, alignItems: 'center' }}>

                    {/* Left Column: Text & Skills Grid */}
                    <Box sx={{ flex: 1, width: '100%' }}>
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: 3, fontWeight: 'bold' }}>
                                {t('home.skillset.overline')}
                            </Typography>
                            <Typography variant="h2" className="section-main-title" sx={{ fontWeight: 900, mt: 2, mb: 3, lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                                {t('home.skillset.title')}
                            </Typography>
                            <Box sx={{ width: 100, height: 4, backgroundColor: 'primary.main', mb: 6 }} />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 4 }}>
                            {skills.map((skill, index) => (
                                <Box key={index}>
                                    <Box sx={{ mb: 2, color: 'primary.main' }}>
                                        {skill.icon}
                                    </Box>
                                    <Typography variant="h6" className="section-main-title" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {skill.title}
                                    </Typography>
                                    <Typography variant="body2" className="section-main-muted" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                                        {skill.desc}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Right Column: Image Collage */}
                    <Box sx={{ flex: 1, width: '100%', position: 'relative', height: { xs: 400, md: 600 } }}>
                        {/* Image 1: Top Left (Studio) */}
                        <Paper
                            elevation={12}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '55%',
                                height: '45%',
                                backgroundImage: `url(${studioImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 2,
                                zIndex: 2,
                                border: '4px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            }}
                        />

                        {/* Image 2: Bottom Center (Urban) */}
                        <Paper
                            elevation={12}
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: '25%',
                                width: '55%',
                                height: '45%',
                                backgroundImage: `url(${urbanImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 2,
                                zIndex: 3,
                                border: '4px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            }}
                        />

                        {/* Image 3: Top Right (Camera/Detail) */}
                        <Paper
                            elevation={8}
                            sx={{
                                position: 'absolute',
                                top: '15%',
                                right: 0,
                                width: '45%',
                                height: '35%',
                                backgroundImage: `url(${cameraImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 2,
                                zIndex: 1,
                                opacity: 0.6,
                                filter: 'grayscale(100%)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    opacity: 1,
                                    filter: 'grayscale(0%)',
                                    zIndex: 4,
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default SkillsetSection;
