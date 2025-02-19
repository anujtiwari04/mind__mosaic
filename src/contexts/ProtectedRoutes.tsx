import AuthModal from '../components/AuthModal';
import { useAuth } from '../contexts/AuthContext';
// import AuthModal from '../contexts/AuthContext';
import { useState } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
  }
  
  export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(!isLoggedIn);
  
    const handleAuthSuccess = () => {
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
    };
  
    if (!isLoggedIn) {
      return (
        <>
          <div className={isAuthModalOpen ? 'filter blur-sm' : ''}>
            {children}
          </div>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => {}} // Empty function since we don't want to allow closing
            onSuccess={handleAuthSuccess}
          />
        </>
      );
    }
  
    return <>{children}</>;
  }