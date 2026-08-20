import React, { useState } from 'react';
import vandaLogo from '@/template/assets/logo/vanda_logo.png';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Link,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/authService';
{/*import PublicNavbar from '../components/Layout/PublicNavbar';
import PublicFooter from '../components/Layout/PublicFooter';*/}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login({ email, password });

            // Smart Redirect:
            // If superadmin -> Super Admin Dashboard
            // If user has a site built -> Admin Dashboard (Delivery)
            // If user is new -> Site Builder
            if (response.user.role === 'superadmin') {
                navigate('/superadmin/dashboard');
            } else if (response.has_site) {
                navigate('/admin/dashboard');
            } else {
                navigate('/admin/site-builder');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground linear-theme font-sans flex flex-col">
            {/*<PublicNavbar />*/}
            <div className="flex-grow flex items-center justify-center py-20">
                <Container maxWidth="sm">
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Paper
                            elevation={0}
                            className="glass"
                            sx={{
                                p: 4,
                                width: '100%',
                                borderRadius: 4,
                                bgcolor: 'transparent',
                                color: 'white'
                            }}
                        >
                            {/* Logo */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                                <img src={vandaLogo} alt="Vanda Studio" style={{ height: '45px', objectFit: 'contain' }} />
                                <span style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '-0.5px'
                                }}>VANDA STUDIO</span>
                            </div>
                            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: 'white' }}>
                                Connexion
                            </Typography>
                            <Typography variant="body1" align="center" sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}>
                                Accédez à votre espace VANDA STUDIO
                            </Typography>

                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                                        },
                                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                                        '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Mot de passe"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    margin="normal"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                            '&.Mui-focused fieldset': { borderColor: '#4caf50' },
                                        },
                                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#4caf50' },
                                        '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                    sx={{
                                        mt: 4,
                                        mb: 2,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        bgcolor: '#4caf50',
                                        '&:hover': { bgcolor: '#43a047' },
                                        '&.Mui-disabled': {
                                            bgcolor: 'rgba(76, 175, 80, 0.5)',
                                            color: 'rgba(255, 255, 255, 0.7)'
                                        }
                                    }}
                                >
                                    {loading ? 'Traitement en cours...' : 'Se connecter'}
                                </Button>

                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Vous n'avez pas de compte ?{' '}
                                        <Link component={RouterLink} to="/signup" sx={{ fontWeight: 600, color: '#4caf50' }}>
                                            Inscrivez-vous
                                        </Link>
                                    </Typography>
                                </Box>
                            </form>
                        </Paper>
                    </Box>
                </Container>
            </div>
            {/*<PublicFooter />*/}
        </div>
    );
};

export default Login;
