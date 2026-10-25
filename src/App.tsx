import React from 'react';
import { GuideProvider, useGuide } from './context/GuideContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TalentioAIAssistant } from './components/TalentioAIAssistant';
import { TalentioAIProvider } from './context/TalentioAIContext';
import { AdProvider } from './context/AdContext';
import { AdPlacement } from './components/ads/AdPlacement';
import { ToastContainer } from './components/ToastContainer';
import { OfflineNoticeBanner } from './components/OfflineNoticeBanner';
import { AdminAuthGatewayCheck } from './components/AuthGateway';
import { useGlobalKeyShortcuts } from './hooks/useGlobalKeyShortcuts';
import { SEOHead } from './components/SEOHead';
import { PageSkeleton } from './components/PageSkeleton';
import { Loader2 } from 'lucide-react';
import { TalentioLogo } from './components/TalentioLogo';

// Core Critical Entry Pages (Eagerly Loaded for Fast First Contentful Paint)
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Route-Split Lazy Pages (Loaded on Demand)
const FreelancersPage = React.lazy(() => import('./pages/FreelancersPage').then(m => ({ default: m.FreelancersPage })));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const WorkstationPage = React.lazy(() => import('./pages/WorkstationPage').then(m => ({ default: m.WorkstationPage })));
const ChatPage = React.lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const PlaybookPage = React.lazy(() => import('./pages/PlaybookPage').then(m => ({ default: m.PlaybookPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const LeaderboardPage = React.lazy(() => import('./pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const GigDetailsPage = React.lazy(() => import('./pages/GigDetailsPage').then(m => ({ default: m.GigDetailsPage })));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const SearchResultsPage = React.lazy(() => import('./pages/SearchResultsPage').then(m => ({ default: m.SearchResultsPage })));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const NoticesPage = React.lazy(() => import('./pages/NoticesPage').then(m => ({ default: m.NoticesPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const HelpSupportPage = React.lazy(() => import('./pages/HelpSupportPage').then(m => ({ default: m.HelpSupportPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const AccessDeniedPage = React.lazy(() => import('./pages/AccessDeniedPage').then(m => ({ default: m.AccessDeniedPage })));
const KycVerificationPage = React.lazy(() => import('./pages/KycVerificationPage').then(m => ({ default: m.KycVerificationPage })));

// Lazy-Loaded Dialog Modals (Loaded only when user triggers action)
const SearchModal = React.lazy(() => import('./components/SearchModal').then(m => ({ default: m.SearchModal })));
const PostJobModal = React.lazy(() => import('./components/PostJobModal').then(m => ({ default: m.PostJobModal })));
const FreelancerProfileModal = React.lazy(() => import('./components/FreelancerProfileModal').then(m => ({ default: m.FreelancerProfileModal })));
const ServiceDetailModal = React.lazy(() => import('./components/ServiceDetailModal').then(m => ({ default: m.ServiceDetailModal })));
const AuthModal = React.lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const OnboardingModal = React.lazy(() => import('./components/OnboardingModal').then(m => ({ default: m.OnboardingModal })));
const ProposalModal = React.lazy(() => import('./components/ProposalModal').then(m => ({ default: m.ProposalModal })));
const CreateGigModal = React.lazy(() => import('./components/CreateGigModal').then(m => ({ default: m.CreateGigModal })));
const ShortcutsHelpModal = React.lazy(() => import('./components/ShortcutsHelpModal').then(m => ({ default: m.ShortcutsHelpModal })));
const WidgetManagerModal = React.lazy(() => import('./components/WidgetManagerModal').then(m => ({ default: m.WidgetManagerModal })));

const AppContent: React.FC = () => {
  const { 
    activePage, 
    isAuthenticated, 
    user, 
    authLoading, 
    setActivePage,
    isSearchModalOpen,
    isPostJobModalOpen,
    isHireModalOpen,
    selectedFreelancer,
    isServiceModalOpen,
    selectedService,
    isAuthModalOpen,
    isOnboardingModalOpen,
    isProposalModalOpen,
    isCreateGigModalOpen,
    isShortcutsModalOpen,
    isWidgetManagerOpen
  } = useGuide();
  const { theme } = useTheme();

  // Initialize Global Key Listener Hook for Fast Navigation (⌘K, ESC, ⌘J, Alt+1-7, ?, Alt+T)
  useGlobalKeyShortcuts();

  // Seamless transition to marketplace home when user authenticates from a dedicated auth page
  React.useEffect(() => {
    if (isAuthenticated && user && (activePage === 'login' || activePage === 'register' || activePage === 'forgot-password')) {
      setActivePage('home');
    }
  }, [isAuthenticated, user, activePage, setActivePage]);

  // Loading state while checking Firebase authentication session on initial load or refresh
  if (authLoading) {
    return (
      <div className="min-h-screen w-full bg-[#23324A] flex items-center justify-center text-[#E3EDF9]">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <TalentioLogo size="lg" />
          <div className="flex items-center gap-2 text-[#E3EDF9]/80 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-[#3A5A86]" />
            <span>Connecting to Talentio...</span>
          </div>
        </div>
      </div>
    );
  }

  // Strict Global Authentication Gate — Unauthenticated visitors must sign in before accessing the marketplace
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen w-full bg-[#23324A]">
        <SEOHead />
        <OfflineNoticeBanner />
        {activePage === 'forgot-password' ? (
          <ForgotPasswordPage />
        ) : activePage === 'register' ? (
          <RegisterPage />
        ) : (
          <LoginPage />
        )}
        <TalentioAIAssistant />
        <ToastContainer />
      </div>
    );
  }

  // Render Page Content based on Active Multi-Page Route
  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
      case 'explore':
        return <HomePage />;
      case 'marketplace':
      case 'services':
      case 'catalog':
        return <ServicesPage />;
      case 'gig-details':
        return <GigDetailsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'search':
        return <SearchResultsPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'access-denied':
        return <AccessDeniedPage />;
      case 'profile':
        return <UserProfilePage />;
      case 'favorites':
      case 'saved':
        return <FavoritesPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'notice':
      case 'notices':
        return <NoticesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
      case 'support':
        return <HelpSupportPage />;
      case 'freelancers':
      case 'talent':
        return <FreelancersPage />;
      case 'workstation':
      case 'escrow':
      case 'orders':
      case 'order-lifecycle':
        return <WorkstationPage />;
      case 'chat':
      case 'messages':
        return <ChatPage />;
      case 'dashboard':
      case 'earnings':
      case 'payouts':
        return <DashboardPage />;
      case 'playbook':
      case 'guides':
      case 'security':
      case 'defense':
        return <PlaybookPage />;
      case 'admin':
        return (
          <AdminAuthGatewayCheck>
            <AdminPage />
          </AdminAuthGatewayCheck>
        );
      case 'kyc':
      case 'verify-kyc':
        return <KycVerificationPage />;
      case 'leaderboard':
      case 'ranking':
      case 'rankings':
        return <LeaderboardPage />;
      default:
        return <HomePage />;
    }
  };

  const isChatPage = activePage === 'chat' || activePage === 'messages';
  const isDedicatedAuthPage = activePage === 'login' || activePage === 'register' || activePage === 'forgot-password';

  return (
    <div className={`min-h-screen max-w-full overflow-x-hidden w-full flex flex-col font-sans transition-colors duration-200 selection:bg-[#3A5A86] selection:text-white ${
      isChatPage ? 'h-screen overflow-hidden pb-0' : isDedicatedAuthPage ? 'pb-0' : 'pb-24 sm:pb-28'
    } ${
      isDedicatedAuthPage
        ? 'bg-[#23324A] text-[#E3EDF9]'
        : theme === 'high-contrast' 
          ? 'bg-black text-white' 
          : theme === 'dark' 
            ? 'bg-[#23324A] text-[#E3EDF9]' 
            : 'bg-[#E3EDF9] text-[#23324A]'
    }`}>
      
      {/* Sticky Compact Global Navigation (Hidden on dedicated Message and Auth pages) */}
      <SEOHead />
      <OfflineNoticeBanner />

      {!isChatPage && !isDedicatedAuthPage && <Navbar />}

      {/* Main Dynamic Page Content */}
      <main className={`flex-1 w-full max-w-full ${isChatPage ? 'h-full overflow-hidden' : 'overflow-x-hidden'}`}>
        <React.Suspense fallback={<PageSkeleton />}>
          {renderActivePage()}
        </React.Suspense>
      </main>

      {/* Before Footer Placement (Public Pages) */}
      {!isChatPage && !isDedicatedAuthPage && activePage !== 'admin' && (
        <div className="w-full flex justify-center py-4 bg-transparent border-t border-slate-100 dark:border-white/5">
          <AdPlacement placement="before_footer" />
        </div>
      )}

      {/* Global Talentio Marketplace Footer (hidden in full-screen Messenger mode, Admin desk, or dedicated Auth page) */}
      {!isChatPage && !isDedicatedAuthPage && activePage !== 'admin' && <Footer />}

      {/* Mobile Banner Placement */}
      {!isChatPage && !isDedicatedAuthPage && activePage !== 'admin' && (
        <div className="sm:hidden w-full flex justify-center pb-16">
          <AdPlacement placement="mobile_banner" />
        </div>
      )}

      {/* Mobile Bottom Quick Navigation Bar (Hidden on dedicated Message and Auth pages) */}
      {!isChatPage && !isDedicatedAuthPage && <MobileBottomNav />}

      {/* Modals & Dialogs (Loaded on-demand and mounted only when active) */}
      <React.Suspense fallback={null}>
        {/* Global Instant Search Modal Triggered by ⌘K / Ctrl+K */}
        {isSearchModalOpen && <SearchModal />}

        {/* Post Project / RFP Escrow Modal */}
        {isPostJobModalOpen && <PostJobModal />}

        {/* Freelancer Profile & Hire Modal */}
        {(isHireModalOpen || !!selectedFreelancer) && <FreelancerProfileModal />}

        {/* Service Scoping & 3-Tier Escrow Checkout Modal */}
        {(isServiceModalOpen || !!selectedService) && <ServiceDetailModal />}

        {/* Authentication Modal (Hidden when on dedicated Auth pages) */}
        {!isDedicatedAuthPage && isAuthModalOpen && <AuthModal />}

        {/* Mandatory 6-Step Profile Onboarding Wizard */}
        {isOnboardingModalOpen && <OnboardingModal />}

        {/* Escrow Proposal & Bid Modal for Freelancers */}
        {isProposalModalOpen && <ProposalModal />}

        {/* Create & Publish Milestone Service Gig Modal */}
        {isCreateGigModalOpen && <CreateGigModal />}

        {/* Global Keyboard Shortcuts Reference Modal (Triggered by ? or Cmd+/) */}
        {isShortcutsModalOpen && <ShortcutsHelpModal />}

        {/* Android Live Home Screen Widget Manager & Customizer Modal */}
        {isWidgetManagerOpen && <WidgetManagerModal />}
      </React.Suspense>

      {/* TALENTIO AI Built-in Assistant & Voice Companion */}
      <TalentioAIAssistant />

      {/* Toast Notification Container */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <GuideProvider>
        <TalentioAIProvider>
          <AdProvider>
            <AppContent />
          </AdProvider>
        </TalentioAIProvider>
      </GuideProvider>
    </ThemeProvider>
  );
}
