import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Box, Button, Drawer, List, ListItem, ListItemButton, ListItemText, useTheme, useMediaQuery, Menu, MenuItem } from '@mui/material'; // Badge removed
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
// import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LanguageIcon from '@mui/icons-material/Language';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { useCart } from '@/template/context/CartContext';
// import { authService } from '../../services/authService'; // Removed for public template
import { useSiteConfig } from '@/context/SiteConfigContext';
import { useSitePath } from '@/template/hooks/useSitePath';
import logo from '@/template/assets/logo/vanda_logo.png';


interface NavbarProps {
    basePath?: string;
}

const Navbar: React.FC<NavbarProps> = ({ basePath }) => {
    const { t, i18n } = useTranslation();
    const { config } = useSiteConfig();
    // const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { getPath } = useSitePath(basePath);

    // Early return ONLY after ALL hooks
    if (!config) return null;

    // Fallback for cart if context is missing or failing (though it should work)
    // const cartContext = useCart();
    // const cartCount = cartContext ? cartContext.cartCount : 0;
    // const openCart = cartContext ? cartContext.openCart : () => { };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLanguageClose = () => {
        setAnchorEl(null);
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        handleLanguageClose();
    };

    const showPortfolio = config?.enabledSections.portfolio && config?.photos && config.photos.length > 0;

    const navItems = [
        { label: t('navbar.home'), path: '/' },
        ...(showPortfolio ? [{ label: t('navbar.portfolio'), path: '/portfolio' }] : []),
        { label: t('navbar.about'), path: '/about' },
        { label: t('navbar.contact'), path: '/contact' },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 2 }}>
            <Box
                component={RouterLink}
                to={getPath('/')}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    textDecoration: 'none'
                }}
            >
                {config.useStudioNameAsLogo ? (
                    <Box sx={{ typography: 'h6', fontWeight: 'bold', color: 'text.primary' }}>
                        {config.siteName}
                    </Box>
                ) : (
                    <img src={config.logo || logo} alt={`${config.siteName} Logo`} style={{ height: '40px', objectFit: 'contain' }} />

                )}
            </Box>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={RouterLink} to={getPath(item.path)} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}

                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1, pt: 1 }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => changeLanguage('en')} sx={{ textAlign: 'center' }}>
                            <ListItemText primary="English" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => changeLanguage('fr')} sx={{ textAlign: 'center' }}>
                            <ListItemText primary="Français" />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </List>
        </Box>
    );

    return (
        <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Left: Hamburger (Mobile) or Spacer (Desktop) */}
                {isMobile ? (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                ) : (
                    <Box sx={{ width: 48 }} />
                )}

                {/* Center: Logo */}
                <Box
                    component={RouterLink}
                    to={getPath('/')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'absolute',
                        left: { xs: '50%', md: '10%' },
                        transform: { xs: 'translateX(-50%)', md: 'none' },
                        textDecoration: 'none',
                        color: 'inherit'
                    }}
                >
                    {config.useStudioNameAsLogo ? (
                        <Box sx={{ typography: 'h6', fontWeight: 'bold', color: 'text.primary', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                            {config.siteName}
                        </Box>
                    ) : (
                        <img
                            src={config.logo || logo}
                            alt={`${config.siteName} Logo`}
                            style={{ height: isMobile ? '32px' : '45px', objectFit: 'contain' }}
                        />
                    )}
                </Box>

                {/* Right: Links (Desktop) & Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
                            {navItems.map((item) => (
                                <Button key={item.label} component={RouterLink} to={getPath(item.path)} color="inherit" sx={{ fontWeight: 500 }}>
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}

                    <IconButton color="inherit" onClick={handleLanguageMenu}>
                        <LanguageIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleLanguageClose}
                    >
                        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
                        <MenuItem onClick={() => changeLanguage('fr')}>Français</MenuItem>
                    </Menu>

                    <IconButton color="inherit">
                        <SearchIcon />
                    </IconButton>
                    {/* 
                    <IconButton color="inherit" onClick={openCart}>
                        <Badge badgeContent={cartCount} color="primary">
                            <ShoppingBagIcon />
                        </Badge>
                    </IconButton>
*/}

                </Box>
            </Toolbar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;
