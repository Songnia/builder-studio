import React from 'react';
import { Fab, Zoom, Box, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useSiteConfig } from '@/context/SiteConfigContext';

const WhatsAppFAB: React.FC = () => {
    const { config } = useSiteConfig();

    const handleClick = () => {
        const phoneNumber = config?.phone?.replace(/\D/g, '') || '237698399985';
        const message = "Bonjour, je souhaite faire une réservation.";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Zoom in={true}>
            <Box
                role="presentation"
                sx={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    zIndex: 1000,
                }}
            >
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="reserve"
                    onClick={handleClick}
                    sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'primary.main',
                        color:'secondary.main',
                        px: 3,
                        '&:hover': {
                            filter: 'brightness(0.95)',
                            backgroundColor:'secondary.main',
                            color:'primary.main'
                        },
                    }}
                >
                    <WhatsAppIcon sx={{ mr: 1 }} />
                    <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                        Réserver
                    </Typography>
                </Fab>
            </Box>
        </Zoom>
    );
};

export default WhatsAppFAB;
