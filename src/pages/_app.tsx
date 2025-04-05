import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshSession } from '../services/auth';
import { refreshUser } from '../store/authSlice';
import { useRouter } from 'next/router';
import { RootState } from '../store';

function ProtectedRoutes({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await refreshSession();
        dispatch(refreshUser(response.data.user));
      } catch (error) {
        console.error('Session refresh failed', error);
      }
    };
    initializeSession();
  }, [dispatch]);

  useEffect(() => {
    const protectedRoutes = ['/dashboard'];
    if (!isAuthenticated && protectedRoutes.includes(router.pathname)) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  return <Component {...pageProps} />;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ProtectedRoutes Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

export default MyApp;