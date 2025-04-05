import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axios';

// Define the structure of an API key object
interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
}

/**
 * A React component for managing API keys.
 * Allows users to view, create, and delete API keys.
 */
export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]); // State for storing API keys
  const [newKey, setNewKey] = useState<string | null>(null); // State for the newly created key
  const [error, setError] = useState(''); // State for error messages

  // Fetch API keys when the component mounts
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await axiosInstance.get('/api-keys');
        setApiKeys(response.data);
      } catch (err: any) {
        setError('Failed to fetch API keys');
      }
    };
    fetchApiKeys();
  }, []);

  // Handle creating a new API key
  const handleCreateKey = async () => {
    try {
      const response = await axiosInstance.post('/api-keys');
      setNewKey(response.data.key);
      setApiKeys((prev) => [...prev, response.data]);
    } catch (err: any) {
      setError('Failed to create API key');
    }
  };

  // Handle deleting an API key
  const handleDeleteKey = async (id: string) => {
    try {
      await axiosInstance.delete(`/api-keys/${id}`);
      setApiKeys((prev) => prev.filter((key) => key.id !== id));
    } catch (err: any) {
      setError('Failed to delete API key');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-primary">API Key Management</h1>
        {error && <p className="mt-4 text-danger">{error}</p>}
        <div className="mt-6">
          <button
            onClick={handleCreateKey}
            className="px-4 py-2 text-white bg-primary rounded hover:bg-blue-700"
          >
            Create New API Key
          </button>
          {newKey && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
              <p className="text-green-700">New API Key: {newKey}</p>
              <p className="text-sm text-gray-600">Copy this key now. You won't see it again!</p>
            </div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Your API Keys</h2>
          <ul className="mt-4 space-y-4">
            {apiKeys.map((key) => (
              <li key={key.id} className="flex items-center justify-between p-4 bg-white rounded shadow">
                <span>{key.key}</span>
                <button
                  onClick={() => handleDeleteKey(key.id)}
                  className="px-4 py-2 text-white bg-danger rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
