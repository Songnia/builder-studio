import React from 'react';
import { Box, Container, Typography, IconButton, Link, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { useSitePath } from '@/template/hooks/useSitePath';

import logo from '@/template/assets/logo/vanda_logo.png';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const { config } = useSiteConfig();
    const { getPath } = useSitePath();

    if (!config) return null;

    const showPortfolio = config?.enabledSections.portfolio && config?.photos && config.photos.length > 0;

    const quickLinks = [
        { label: t('navbar.home'), path: getPath('/') },
        ...(showPortfolio ? [{ label: t('navbar.portfolio'), path: getPath('/portfolio') }] : []),
        { label: t('navbar.about'), path: getPath('/about') },
        { label: t('navbar.contact'), path: getPath('/contact') },
    ];

    const getSocialLink = (platform: string, value?: string) => {
        if (!value) return '';
        const cleanValue = value.trim();
        if (cleanValue.startsWith('http://') || cleanValue.startsWith('https://')) {
            return cleanValue;
        }

        switch (platform) {
            case 'instagram':
                return `https://instagram.com/${cleanValue.replace(/^@/, '')}`;
            case 'facebook':
                return `https://facebook.com/${cleanValue.replace(/^@/, '')}`;
            case 'twitter':
                return `https://x.com/${cleanValue.replace(/^@/, '')}`;
            case 'youtube':
                return cleanValue.startsWith('@')
                    ? `https://youtube.com/${cleanValue}`
                    : `https://youtube.com/@${cleanValue}`;
            case 'website':
                return cleanValue.startsWith('www.')
                    ? `https://${cleanValue}`
                    : `https://${cleanValue}`;
            default:
                return cleanValue;
        }
    };

    const socialIcons = [
        { key: 'facebook', icon: <FacebookIcon />, url: getSocialLink('facebook', config.socials?.facebook) },
        { key: 'instagram', icon: <InstagramIcon />, url: getSocialLink('instagram', config.socials?.instagram) },
        { key: 'twitter', icon: <TwitterIcon />, url: getSocialLink('twitter', config.socials?.twitter) },
        { key: 'youtube', icon: <YouTubeIcon />, url: getSocialLink('youtube', config.socials?.youtube) },
        { key: 'website', icon: <LanguageIcon />, url: getSocialLink('website', config.socials?.website) },
    ].filter(item => item.url);

    return (
        <Box component="footer" sx={{ backgroundColor: '#181811', color: 'white', pt: 8, pb: 4 }}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {/* Brand Column */}
                    <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' } }}>
                        <Box sx={{ mb: 3 }}>
                            {config.useStudioNameAsLogo ? (
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', letterSpacing: 1 }}>
                                    {config.siteName}
                                </Typography>
                            ) : (
                                <img
                                    src={config.logo || logo}
                                    alt={`${config.siteName} Logo`}
                                    style={{
                                        height: '40px',
                                        filter: config.logo ? 'none' : 'brightness(0) invert(1)', // Don't invert user logo, only default
                                        objectFit: 'contain'
                                    }}
                                />
                            )}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'grey.400', mb: 3, lineHeight: 1.8, maxWidth: '300px' }}>
                            {config.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {socialIcons.map((item) => (
                                <IconButton
                                    key={item.key}
                                    size="small"
                                    sx={{ color: 'white' }}
                                    component="a"
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Box>

                    {/* Quick Links */}
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 25%' } }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                            {t('footer.quickLinks')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {quickLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        color: 'grey.400',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        '&:hover': { 
                                            color: 'primary.main',
                                            pl: 1 
                                        },
                                        display: 'inline-block',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Box>
                    </Box>

                    {/* Contact Info */}
                    <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' } }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                            {t('footer.contactUs')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <LocationOnIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                                    Douala, Cameroun
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <PhoneIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                                    {config.phone || '+237 698 399 985'}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <EmailIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="body2" sx={{ color: 'grey.400' }}>
                                    {config.email || 'contact@example.com'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ color: 'grey.500' }}>
                        © {new Date().getFullYear()} {config.siteName}. {t('footer.rights')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Link href="#" sx={{ color: 'grey.500', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                            {t('footer.privacyPolicy')}
                        </Link>
                        <Link href="#" sx={{ color: 'grey.500', textDecoration: 'none', fontSize: '0.875rem', '&:hover': { color: 'white' } }}>
                            {t('footer.termsOfService')}
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
