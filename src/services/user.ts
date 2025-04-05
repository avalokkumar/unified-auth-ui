// Import the axios instance for making HTTP requests
import axiosInstance from './axios';

/**
 * Fetches the list of API keys from the server.
 * @returns {Promise} A promise that resolves to the list of API keys.
 */
export const getApiKeys = async () => {
  return await axiosInstance.get('/api-keys');
};

/**
 * Creates a new API key by sending a POST request to the server.
 * @returns {Promise} A promise that resolves to the newly created API key.
 */
export const createApiKey = async () => {
  return await axiosInstance.post('/api-keys');
};

/**
 * Deletes an API key by its ID.
 * @param {string} id - The ID of the API key to delete.
 * @returns {Promise} A promise that resolves when the API key is deleted.
 */
export const deleteApiKey = async (id: string) => {
  return await axiosInstance.delete(`/api-keys/${id}`);
};
