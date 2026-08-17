import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme/theme';
import { useBuilder } from '@/hooks/useBuilder';
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

// ============================================
// BUILDER IMPORTS
// ============================================
import { BuilderLayout } from '@/builder/BuilderLayout';
import { WelcomeStep } from '@/builder/steps/WelcomeStep';
import { InfoStep } from '@/builder/steps/InfoStep';
import { BrandingStep } from '@/builder/steps/BrandingStep';
import { HeroStep } from '@/builder/steps/HeroStep';
import { PortfolioStep } from '@/builder/steps/PortfolioStep';
import { ServicesStep } from '@/builder/steps/ServicesStep';
import { PricingStep } from '@/builder/steps/PricingStep';
import { TestimonialsStep } from '@/builder/steps/TestimonialsStep';
import { ContactStep } from '@/builder/steps/ContactStep';
import { PreviewStep } from '@/builder/steps/PreviewStep';

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
 * Composant Builder (Wizard de configuration)
 */
function BuilderApp() {
  const {
    config,
    currentStep,
    updateConfig,
    addPhoto,
    addPhotos,
    removePhoto,
    updatePhoto,
    addService,
    removeService,
    updateService,
    addPricingPlan,
    removePricingPlan,
    updatePricingPlan,
    addTestimonial,
    removeTestimonial,
    updateTestimonial,
    nextStep,
    prevStep,
    goToStep,
    resetConfig,
    isSaving,
    saveConfig
  } = useBuilder();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />;

      case 1:
        return (
          <InfoStep
            config={config}
            onUpdate={updateConfig}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveConfig}
            isSaving={isSaving}
          />
        );

      case 2:
        return (
          <BrandingStep
            config={config}
            onUpdate={updateConfig}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveConfig}
            isSaving={isSaving}
          />
        );

      case 3:
        return (
          <HeroStep
            config={config}
            onUpdate={updateConfig}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveConfig}
            isSaving={isSaving}
          />
        );

      case 4:
        return (
          <PortfolioStep
            config={config}
            onUpdate={updateConfig}
            onAddPhoto={addPhoto}
            onAddPhotos={addPhotos}
            onRemovePhoto={removePhoto}
            onUpdatePhoto={updatePhoto}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveConfig}
            isSaving={isSaving}
          />
        );

      case 5:
        return (
          <ServicesStep
            config={config}
            onAddService={addService}
            onRemoveService={removeService}
            onUpdateService={updateService}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveConfig}
            isSaving={isSaving}
          />
        );

      case 6:
        return (
          <PricingStep
            config={config}
            onAddPlan={addPricingPlan}
            onRemovePlan={removePricingPlan}
            onUpdatePlan={updatePricingPlan}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveConfig}
            isSaving={isSaving}
          />
        );

      case 7:
        return (
          <TestimonialsStep
            config={config}
            onAddTestimonial={addTestimonial}
            onRemoveTestimonial={removeTestimonial}
            onUpdateTestimonial={updateTestimonial}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveConfig}
            isSaving={isSaving}
          />
        );

      case 8:
        return (
          <ContactStep
            config={config}
            onUpdate={updateConfig}
            onNext={nextStep}
            onPrev={prevStep}
            onSave={saveConfig}
            isSaving={isSaving}
          />
        );

      case 9:
        return (
          <PreviewStep
            config={config}
            onReset={resetConfig}
            onPrev={prevStep}
          />
        );

      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <BuilderLayout
      currentStep={currentStep}
      onStepChange={goToStep}
      onNext={nextStep}
      onPrev={prevStep}
    >
      {renderStep()}
    </BuilderLayout>
  );
}

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
