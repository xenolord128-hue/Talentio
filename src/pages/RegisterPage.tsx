import React from 'react';
import { LoginPage } from './LoginPage';

/**
 * RegisterPage - renders the unified Talentio Auth experience with Register tab pre-selected.
 */
export const RegisterPage: React.FC = () => {
  return <LoginPage initialMode="register" />;
};
