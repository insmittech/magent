import React, { useContext, useState, useEffect } from 'react';
import { StoreProvider, StoreContext } from './context/StoreContext';
import { Storefront } from './components/storefront/Storefront';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginPage } from './components/admin/AdminLoginPage';

const AppContent = () => {
  const { isAdmin, setIsAdmin } = useContext(StoreContext);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Automatically reset admin login status if we exit the admin flow
  useEffect(() => {
    if (!isAdmin) {
      setIsAdminAuthenticated(false);
    }
  }, [isAdmin]);

  if (isAdmin) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage 
          onLoginSuccess={() => setIsAdminAuthenticated(true)} 
          onCancel={() => setIsAdmin(false)} 
        />
      );
    }
    return <AdminDashboard />;
  }

  return <Storefront />;
};

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
