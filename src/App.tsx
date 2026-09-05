import React from 'react';
import { GuideProvider, useGuide } from './context/GuideContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SearchModal } from './components/SearchModal';
import { PostJobModal } from './components/PostJobModal';
import { FreelancerProfileModal } from './components/FreelancerProfileModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProposalModal } from './components/ProposalModal';
import { CreateGigModal } from './components/CreateGigModal';
import { ShortcutsHelpModal } from './components/ShortcutsHelpModal';
import { ToastContainer } from './components/ToastContainer';
import { OfflineNoticeBanner } from './components/OfflineNoticeBanner';
import { AuthGateway } from './components/AuthGateway';
import { ProfileCompletionBarrier } from './components/ProfileCompletionBarrier';
import { SellerStatusBanner } from './components/SellerStatusBanner';
import { useGlobalKeyShortcuts } from './hooks/useGlobalKeyShortcuts';

// Talentio Marketplace Pages
import { HomePage } from './pages/HomePage';
import { FreelancersPage } from './pages/FreelancersPage';
import { ServicesPage } from './pages/ServicesPage';
import { WorkstationPage } from './pages/WorkstationPage';
import { ChatPage } from './pages/ChatPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlaybookPage } from './pages/PlaybookPage';
import { AdminPage } from './pages/AdminPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { GigDetailsPage } from './pages/GigDetailsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NoticesPage } from './pages/NoticesPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpSupportPage } from './pages/HelpSupportPage';

const AppContent: React.FC = () => {
  const { activePage, isAuthenticated, user, authLoading } = useGuide();
  const { theme } = useTheme();

  // Initialize Global Key Listener Hook for Fast Navigation (⌘K, ESC, ⌘J, Alt+1-7, ?, Alt+T)
  useGlobalKeyShortcuts();

  // Strict Global Authentication Gate — Unauthenticated visitors must sign in before accessing the marketplace
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen w-full bg-[#0E0B1F]">
        <OfflineNoticeBanner />
        <AuthGateway initialMode={activePage === 'register' ? 'register' : 'login'} />
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
        return <AuthGateway initialMode="login" />;
      case 'register':
        return <AuthGateway initialMode="register" />;
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
        return <AdminPage />;
      case 'leaderboard':
      case 'ranking':
      case 'rankings':
        return <LeaderboardPage />;
      default:
        return <HomePage />;
    }
  };

  const isChatPage = activePage === 'chat' || activePage === 'messages';

  return (
    <div className={`min-h-screen max-w-full overflow-x-hidden w-full flex flex-col font-sans transition-colors duration-200 selection:bg-[#3D2FD1] selection:text-white ${
      isChatPage ? 'h-screen overflow-hidden pb-0' : 'pb-24 sm:pb-28'
    } ${
      theme === 'high-contrast' 
        ? 'bg-black text-white' 
        : theme === 'dark' 
          ? 'bg-[#0F0B1E] text-slate-100' 
          : 'bg-slate-50 text-[#1A1633]'
    }`}>
      
      {/* Sticky Compact Global Navigation (Hidden on dedicated Message page as per Requirement 1) */}
      <OfflineNoticeBanner />
      {!isChatPage && <Navbar />}

      {/* Main Dynamic Page Content */}
      <main className={`flex-1 w-full max-w-full ${isChatPage ? 'h-full overflow-hidden' : 'overflow-x-hidden'}`}>
        {renderActivePage()}
      </main>

      {/* Global Talentio Marketplace Footer (hidden in full-screen Messenger mode or Admin desk) */}
      {!isChatPage && activePage !== 'admin' && <Footer />}

      {/* Mobile Bottom Quick Navigation Bar (Hidden on dedicated Message page) */}
      {!isChatPage && <MobileBottomNav />}

      {/* Global Instant Search Modal Triggered by ⌘K / Ctrl+K */}
      <SearchModal />

      {/* Post Project / RFP Escrow Modal */}
      <PostJobModal />

      {/* Freelancer Profile & Hire Modal */}
      <FreelancerProfileModal />

      {/* Service Scoping & 3-Tier Escrow Checkout Modal */}
      <ServiceDetailModal />

      {/* Authentication Modal (Email, Phone OTP, GitHub OAuth) */}
      <AuthModal />

      {/* Mandatory 6-Step Profile Onboarding Wizard */}
      <OnboardingModal />

      {/* Escrow Proposal & Bid Modal for Freelancers */}
      <ProposalModal />

      {/* Create & Publish Milestone Service Gig Modal */}
      <CreateGigModal />

      {/* Global Keyboard Shortcuts Reference Modal (Triggered by ? or Cmd+/) */}
      <ShortcutsHelpModal />

      {/* Toast Notification Container */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <GuideProvider>
        <AppContent />
      </GuideProvider>
    </ThemeProvider>
  );
}
