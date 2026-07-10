import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
