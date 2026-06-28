import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Dialog, IconButton } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import CloseIcon from '@mui/icons-material/Close';
// import { useTranslation } from 'react-i18next';
import promoImage from '../../assets/flashInfos/promo.jpeg'; // Fallback image
import { useSiteConfig } from '@/context/SiteConfigContext';

const FlashInfo: React.FC = () => {
    // const { t } = useTranslation();
    const { config } = useSiteConfig();

    if (!config) return null;
    const [open, setOpen] = useState(false);

    if (!config.flashInfo.enabled) {
        return null;
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    mb: { xs: 4, md: 6 },
                    backgroundColor: 'primary.transparent', // Slightly stronger yellow background
                    border: '1px solid',
                    borderColor: 'primary.main',
                    borderRadius: 4,
                    overflow: 'hidden', // To clip the image
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch', // Stretch to match height
                    position: 'relative',
                    height: { md: '280px' }, // Fixed height for desktop
                }}
            >
                {/* Left Content Side */}
                <Box
                    sx={{
                        p: { xs: 2, md: 3 }, // Reduced padding
                        flex: '1 1 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: 1 // Reduced gap
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box
                            sx={{
                                backgroundColor: 'primary.main',
                                borderRadius: '50%',
                                p: 1, // Reduced padding
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px primary.main'
                            }}
                        >
                            <BoltIcon sx={{ color: 'secondary.main', fontSize: 24 }} /> {/* Slightly smaller icon */}
                        </Box>
                        <Box>
                            <Typography
                                variant="h6" // Reduced from h5
                                sx={{
                                    fontWeight: '900',
                                    lineHeight: 1.2,
                                    color: 'text.primary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {config.flashInfo.title}
                            </Typography>
                            <Typography
                                variant="body2" // Reduced from body1
                                color="text.secondary"
                                sx={{ mt: 0.5, fontWeight: 'medium' }}
                            >
                                {config.flashInfo.subtitle}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        size="medium" // Reduced size
                        onClick={() => {
                            if (config.flashInfo.redirectUrl) {
                                window.open(config.flashInfo.redirectUrl, '_blank');
                            } else {
                                const message = config.flashInfo.whatsappMessage;
                                const phoneNumber = config.phone.replace(/\D/g, ''); // Clean phone number
                                const encodedMessage = encodeURIComponent(message);
                                window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
                            }
                        }}
                        sx={{
                            backgroundColor: 'primary.main', // Yellow background
                            color: 'secondary.main', // Black text
                            px: 3,
                            py: 1,
                            borderRadius: 2, // Slightly rounded
                            fontWeight: 'bold',
                            boxShadow: '0 4px 14px 0 ,primary.transparent', //transparent primary
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px primary.main',
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {config.flashInfo.buttonText}
                    </Button>
                </Box>


                {/* Right Image Side */}
                <Box
                    onClick={handleOpen}
                    sx={{
                        flex: '0 0 40%', // Takes 40% of the width on desktop
                        minHeight: { xs: 200, md: '100%' }, // Fixed height on desktop via parent, minHeight for mobile
                        height: { md: '100%' },
                        position: 'relative',
                        clipPath: { md: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }, // Angled cut effect
                        ml: { md: -4 }, // Overlap slightly
                        cursor: 'pointer', // Indicate clickable
                        transition: 'filter 0.3s ease',
                        '&:hover': {
                            filter: 'brightness(1.1)',
                        }
                    }}
                >
                    <img
                        src={config.flashInfo.backgroundImage || promoImage}
                        alt="Flash Sale Promo"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                    {/* Overlay gradient for better text readability if needed, or just style */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to right, primary , transparent)',
                            pointerEvents: 'none'
                        }}
                    />
                </Box>
            </Paper>

            {/* Lightbox Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        backgroundColor: 'primary.transparent',
                        boxShadow: 'none',
                        overflow: 'hidden',
                        m: 1,
                        maxHeight: '90vh',
                        maxWidth: '90vw'
                    }
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)',
                            },
                            zIndex: 1
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={config.flashInfo.backgroundImage || promoImage}
                        alt="Flash Sale Promo Fullscreen"
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            display: 'block',
                            borderRadius: 8
                        }}
                    />
                </Box>
            </Dialog>
        </>
    );
};

export default FlashInfo;
