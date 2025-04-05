// Import the axios instance and token management utilities
import axiosInstance from './axios';
import { setToken, clearToken } from '../lib/tokenManager';

/**
 * Logs in a user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise} A promise that resolves to the login response.
 */
export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  setToken(response.data.token); // Store the token in cookies
  return response;
};

/**
 * Logs out the current user by clearing the session.
 * @returns {Promise} A promise that resolves when the user is logged out.
 */
export const logout = async () => {
  await axiosInstance.post('/auth/logout');
  clearToken(); // Clear the token from cookies
};

/**
 * Fetches the current user's information.
 * @returns {Promise} A promise that resolves to the user's data.
 */
export const getUser = async () => {
  return await axiosInstance.get('/auth/me');
};

/**
 * Refreshes the user's session by obtaining a new token.
 * @returns {Promise} A promise that resolves to the refreshed session data.
 */
export const refreshSession = async () => {
  try {
    const response = await axiosInstance.get('/auth/refresh');
    setToken(response.data.token); // Update the token in cookies
    return response;
  } catch (error) {
    console.error('Failed to refresh session:', error);
    throw error; // Re-throw the error to propagate it
  }
};

/**
 * Redirects the user to the OAuth login page for the specified provider.
 * @param {string} provider - The OAuth provider (e.g., 'google').
 */
export const oauthLogin = (provider: string) => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/${provider}`;
};
