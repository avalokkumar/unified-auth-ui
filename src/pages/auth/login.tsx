import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { refreshUser } from '../../store/authSlice';
import { login } from '../../services/auth';

/**
 * A React component for user login.
 * Allows users to log in using email/password, OAuth, or SAML.
 */
export default function LoginPage() {
  const [email, setEmail] = useState(''); // State for the email input
  const [password, setPassword] = useState(''); // State for the password input
  const [error, setError] = useState(''); // State for error messages
  const dispatch = useDispatch(); // Redux dispatch function

  // Handle the login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      dispatch(refreshUser(response.data.user)); // Update the Redux store with user data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // Handle OAuth login for a specific provider
  const handleOAuthLogin = (provider: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/${provider}`;
  };

  // Handle SAML login
  const handleSAMLLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/saml/login`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="mb-6 text-2xl font-bold text-center text-primary">Login</h1>
        {error && <p className="mb-4 text-sm text-danger">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={() => handleOAuthLogin('google')}
            className="w-full px-4 py-2 text-white bg-secondary rounded hover:bg-purple-700"
          >
            Login with Google
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleSAMLLogin}
            className="w-full px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-800"
          >
            Login via SSO (SAML)
          </button>
        </div>
      </div>
    </div>
  );
}
