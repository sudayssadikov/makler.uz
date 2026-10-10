import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';
import { LoginModal } from '../../features/auth/LoginModal';
import { RegisterStepperModal } from '../../features/auth/RegisterStepperModal';
import { useAuthStore } from '../../store/authStore';
import { initStorage } from '../../services/storage';

export const AppLayout = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initStorage();
    initAuth();
  }, [initAuth]);

  return (
    <div className="neo-app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '24px 0' }}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <LoginModal />
      <RegisterStepperModal />
    </div>
  );
};
