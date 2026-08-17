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
    Person as PersonIcon,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/authService';
{/*import PublicNavbar from '../components/Layout/PublicNavbar';
import PublicFooter from '../components/Layout/PublicFooter';*/}

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.register({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            const selectedPlan = localStorage.getItem('selectedPlan');
            if (selectedPlan) {
                navigate(`/admin/subscription?auto_checkout=${selectedPlan}`);
            } else {
                navigate('/admin/site-builder');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
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
                                Inscription
                            </Typography>
                            <Typography variant="body1" align="center" sx={{ mb: 4, color: 'rgba(255,255,255,0.7)' }}>
                                Rejoignez l'aventure VANDA STUDIO
                            </Typography>

                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Nom complet"
                                    variant="outlined"
                                    margin="normal"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                                                <PersonIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
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
                                <TextField
                                    fullWidth
                                    label="Confirmer le mot de passe"
                                    type={showPassword ? 'text' : 'password'}
                                    variant="outlined"
                                    margin="normal"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                                    {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                                </Button>

                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Vous avez déjà un compte ?{' '}
                                        <Link component={RouterLink} to="/login" sx={{ fontWeight: 600, color: '#4caf50' }}>
                                            Connectez-vous
                                        </Link>
                                    </Typography>
                                </Box>
                            </form>
                        </Paper>
                    </Box>
                </Container>
            </div>
           {/* <PublicFooter />*/}
        </div>
    );
};

export default SignUp;
