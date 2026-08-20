import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme/theme';
import { getSubdomainInfo } from '@/utils/subdomain';

// ============================================
// ADMIN IMPORTS
// ============================================
import AdminDashboard from '@/pages/admin/AdminDashboard';
import NewDelivery from '@/pages/admin/NewDelivery';
import GalleryManagement from '@/pages/admin/GalleryManagement';
import InvoiceBuilder from '@/pages/admin/InvoiceBuilder';
import ProfilePage from '@/pages/admin/ProfilePage';
import Subscription from '@/pages/admin/Subscription';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import SiteBuilder from '@/pages/admin/SiteBuilder';
import AdminLayout from '@/components/Layout/AdminLayout';

// ============================================
// SUPER ADMIN IMPORTS
// ============================================
import RequireSuperAdmin from '@/components/Auth/RequireSuperAdmin';
import SuperAdminLayout from '@/components/Layout/SuperAdminLayout';
import SuperAdminDashboard from '@/pages/superadmin/SuperAdminDashboard';
import PhotographersList from '@/pages/superadmin/PhotographersList';
import SubscriptionPlans from '@/pages/superadmin/SubscriptionPlans';
import TransactionsList from '@/pages/superadmin/TransactionsList';
import SuperAdminSettings from '@/pages/superadmin/SuperAdminSettings';

// ============================================
// CLIENT IMPORTS
// ============================================
import ClientGalleryView from '@/pages/client/ClientGalleryView';

// ============================================
// PUBLIC PAGES IMPORTS
// ============================================
import LandingPage from '@/pages/LandingPage';
import PricingPage from '@/pages/PricingPage';
import SeoPageView from '@/pages/seo/SeoPageView';

// ============================================
// TEMPLATE IMPORTS  
// ============================================
import TemplateLayout from '@/template/components/Layout/Layout';
import TemplateHome from '@/template/pages/Home';
import TemplatePortfolio from '@/template/pages/Portfolio';
import TemplateShop from '@/template/pages/Shop';
import TemplateContact from '@/template/pages/Contact';
import TemplateAbout from '@/template/pages/About';

// PUBLIC PAGES IMPORTS (Default Site) - Removed as they do not exist
// The template /:slug handles public sites


/**
 * APP PRINCIPALE UNIFIÉE
 * Routing par sous-domaine :
 *   - vanda-studio.org           → Pages publiques (landing, pricing, auth)
 *   - app.vanda-studio.org       → Admin + Builder
 *   - slug.vanda-studio.org      → Site du photographe (template)
 *   - localhost                  → Tout (développement)
 */
function App() {
  const { type: subdomainType, slug: photographerSlug } = getSubdomainInfo();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>

          {/* Root-level gallery for subdomains and shared links */}
          <Route path="/g/:uuid" element={<ClientGalleryView />} />

          {/* =========================================
              SITE PHOTOGRAPHE (sous-domaine wildcard)
              slug.vanda-studio.org → site du photographe
              =========================================
          */}
          {subdomainType === 'photographer' && photographerSlug && (
            <Route path="/*" element={<TemplateLayout slug={photographerSlug} />}>
              <Route index element={<TemplateHome />} />
              <Route path="portfolio" element={<TemplatePortfolio />} />
              <Route path="shop" element={<TemplateShop />} />
              <Route path="contact" element={<TemplateContact />} />
              <Route path="about" element={<TemplateAbout />} />
            </Route>
          )}

          {/* =========================================
              ADMIN (app.vanda-studio.org)
              Accessible aussi en local via /admin/*
              =========================================
          */}
          {(subdomainType === 'admin' || subdomainType === 'main') && (
            <>
              {/* Auth */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<SignUp />} />
              <Route path="/login" element={<Navigate to="/auth/login" replace />} />
              <Route path="/signup" element={<Navigate to="/auth/register" replace />} />
              <Route path="/profile" element={<Navigate to="/admin/profile" replace />} />

              {/* Admin protégé */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/profile" element={<ProfilePage />} />
                  <Route path="/admin/new-delivery" element={<NewDelivery />} />
                  <Route path="/admin/gallery/:uuid" element={<GalleryManagement />} />
                  <Route path="/admin/invoices" element={<InvoiceBuilder />} />
                  <Route path="/admin/invoices/new" element={<InvoiceBuilder />} />
                  <Route path="/admin/site-builder" element={<SiteBuilder />} />
                  <Route path="/admin/subscription" element={<Subscription />} />
                </Route>
              </Route>

              {/* Super Admin Protégé */}
              <Route element={<RequireSuperAdmin />}>
                <Route element={<SuperAdminLayout />}>
                  <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
                  <Route path="/superadmin/transactions" element={<TransactionsList />} />
                  <Route path="/superadmin/profile" element={<ProfilePage />} />
                  <Route path="/superadmin/photographers" element={<PhotographersList />} />
                  <Route path="/superadmin/plans" element={<SubscriptionPlans />} />
                  <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
                  <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />
                </Route>
              </Route>

              {/* Builder standalone */}
              <Route element={<ProtectedRoute />}>
                <Route path="/builder" element={<Navigate to="/admin/site-builder" replace />} />
              </Route>

              {/* Galerie client partagée — formats: /:slug/g/:uuid et /g/:uuid */}
              <Route path="/:slug/g/:uuid" element={<ClientGalleryView />} />
              <Route path="/g/:uuid" element={<ClientGalleryView />} />

              {/* Redirections */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          )}

          {/* =========================================
              PAGES PUBLIQUES (vanda-studio.org)
              Accessible aussi en local
              =========================================
          */}
          {subdomainType === 'main' && (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />

              {/* Programmatic SEO Marketing Routes */}
              <Route path="/tools/:slug" element={<SeoPageView />} />
              <Route path="/features/:slug" element={<SeoPageView />} />
              <Route path="/solutions/:slug" element={<SeoPageView />} />
              <Route path="/for" element={<SeoPageView />} />
              <Route path="/for/:slug" element={<SeoPageView />} />
              <Route path="/templates/:slug" element={<SeoPageView />} />
              <Route path="/guides/:slug" element={<SeoPageView />} />
              <Route path="/alternatives" element={<SeoPageView />} />
              <Route path="/alternatives/:slug" element={<SeoPageView />} />

              {/* Sites photographes via chemin (fallback dev local) */}
              <Route path="/:slug" element={<TemplateLayout />}>
                <Route index element={<TemplateHome />} />
                <Route path="portfolio" element={<TemplatePortfolio />} />
                <Route path="shop" element={<TemplateShop />} />
                <Route path="contact" element={<TemplateContact />} />
                <Route path="about" element={<TemplateAbout />} />
              </Route>
            </>
          )}

          {/* =========================================
              404
              =========================================
          */}
          <Route
            path="*"
            element={
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                fontFamily: 'system-ui'
              }}>
                <h1 style={{ fontSize: '4rem', margin: 0, color: '#ef4444' }}>404</h1>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>Page non trouvée</p>
              </div>
            }
          />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
