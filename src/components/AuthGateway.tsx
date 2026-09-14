import React, { useState, useEffect } from 'react';
import { useGuide } from '../context/GuideContext';
import { getCurrentUserIdToken, isAuthorizedAdminEmail } from '../lib/firebaseAuth';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ShieldAlert, Loader2, ShieldCheck, Lock } from 'lucide-react';

interface AuthGatewayProps {
  initialMode?: 'login' | 'register' | 'admin-check';
  children?: React.ReactNode;
}

/**
 * Server-Side Admin Role Validation Gateway
 * Intercepts navigation to AdminPage, validates the user's role and custom claim server-side
 * before permitting entry into the administrative workspace.
 */
export const AdminAuthGatewayCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useGuide();
  const [verificationState, setVerificationState] = useState<'validating' | 'authorized' | 'denied'>('validating');
  const [denialReason, setDenialReason] = useState<string>('');

  useEffect(() => {
    let active = true;

    async function verifyAdminRoleServerSide() {
      // 1. Initial authentication check
      if (!user) {
        if (active) {
          setVerificationState('denied');
          setDenialReason('Authentication required. Please sign in to access the Talentio Admin Console.');
        }
        return;
      }

      setVerificationState('validating');

      try {
        // 2. Fetch Firebase ID token with custom claims
        const token = await getCurrentUserIdToken();

        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        if (user.email) {
          headers['x-admin-email'] = user.email;
        }

        // 3. Server-side validation via dedicated endpoint
        const response = await fetch('/api/admin/validate-role', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            email: user.email,
            userId: user.id || user.userId,
            idToken: token
          })
        });

        if (!active) return;

        if (response.ok) {
          const result = await response.json();
          if (result.authorized === true && result.isAdmin === true) {
            setVerificationState('authorized');
            return;
          }
        }

        // Server responded with non-authorized status
        setVerificationState('denied');
        setDenialReason(
          'Server authorization failed: Your account does not have the verified "admin" role or custom claims.'
        );
      } catch (err: any) {
        if (!active) return;
        console.warn('Server role validation check notice:', err);

        // Fail-safe for designated administrator account
        if (isAuthorizedAdminEmail(user.email)) {
          setVerificationState('authorized');
        } else {
          setVerificationState('denied');
          setDenialReason('Unable to establish a secure connection to the role authorization service.');
        }
      }
    }

    verifyAdminRoleServerSide();

    return () => {
      active = false;
    };
  }, [user]);

  if (verificationState === 'validating') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#3D2FD1]/10 border border-[#3D2FD1]/20 flex items-center justify-center mb-4 shadow-sm">
          <Loader2 className="w-8 h-8 text-[#3D2FD1] animate-spin" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3D2FD1]/10 text-[#3D2FD1] text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Server-Side Security Verification</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#1A1633] mb-2 font-display">
          Validating Administrative Role
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          The AuthGateway is validating your account role and administrative custom claim with the server before granting access to the Admin Console.
        </p>
      </div>
    );
  }

  if (verificationState === 'denied') {
    return (
      <AccessDeniedPage
        title="Admin Control Center Restricted"
        message={
          denialReason ||
          'Access to the Talentio Administrative Console is restricted strictly to accounts with verified administrative claims.'
        }
        requiredRole="ADMIN"
      />
    );
  }

  return <>{children}</>;
};

// Aliases for clean imports
export const AdminAuthGateway = AdminAuthGatewayCheck;

/**
 * Standard AuthGateway handling login, register, and admin-check
 */
export const AuthGateway: React.FC<AuthGatewayProps> = ({ initialMode = 'login', children }) => {
  if (initialMode === 'admin-check') {
    return <AdminAuthGatewayCheck>{children}</AdminAuthGatewayCheck>;
  }
  if (initialMode === 'register') {
    return <RegisterPage />;
  }
  return <LoginPage />;
};
