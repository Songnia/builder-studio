import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme/theme';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import NewDelivery from '@/pages/admin/NewDelivery';
import GalleryManagement from '@/pages/admin/GalleryManagement';
import InvoiceBuilder from '@/pages/admin/InvoiceBuilder';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import SiteBuilder from '@/pages/admin/SiteBuilder';
import AdminLayout from '@/components/Layout/AdminLayout';
import ClientGalleryView from '@/pages/client/ClientGalleryView';

function AppAdmin() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    {/* Auth */}
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<SignUp />} />
                    <Route path="/login" element={<Navigate to="/auth/login" replace />} />
                    <Route path="/signup" element={<Navigate to="/auth/register" replace />} />

                    {/* Admin protégé */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/new-delivery" element={<NewDelivery />} />
                            <Route path="/admin/gallery/:uuid" element={<GalleryManagement />} />
                            <Route path="/admin/invoices" element={<InvoiceBuilder />} />
                            <Route path="/admin/invoices/new" element={<InvoiceBuilder />} />
                            <Route path="/admin/site-builder" element={<SiteBuilder />} />
                            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                        </Route>
                    </Route>

                    {/* Builder standalone */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/builder" element={<Navigate to="/admin/site-builder" replace />} />
                    </Route>

                    {/* Galerie client partagée (peut être ici ou public, gardons ici pour accès auth si besoin) */}
                    <Route path="/g/:uuid" element={<ClientGalleryView />} />

                    {/* 404 */}
                    <Route path="*" element={
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', fontFamily: 'system-ui' }}>
                            <h1 style={{ fontSize: '4rem', margin: 0, color: '#ef4444' }}>404</h1>
                            <p style={{ fontSize: '1.2rem', color: '#666' }}>Page non trouvée (Admin)</p>
                        </div>
                    } />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default AppAdmin;
