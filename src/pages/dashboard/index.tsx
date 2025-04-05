import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
  };

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-primary">Welcome, {user?.name}!</h1>
        <p className="mt-4 text-lg">This is your dashboard.</p>
        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 text-white bg-danger rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
