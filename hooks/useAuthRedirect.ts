import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    setIsLoggedIn(!!accessToken);
    setIsCheckingAuth(false);
  };

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      // Store current page for redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('redirectAfterLogin', currentPath);
      router.push('/login');
      return false;
    }
    action();
    return true;
  };

  return {
    isLoggedIn,
    isCheckingAuth,
    requireAuth,
    checkAuthStatus
  };
}