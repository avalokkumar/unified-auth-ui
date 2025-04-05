import { configureStore, createSlice } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Import the auth reducer

// Example placeholder reducer for demonstration purposes
const placeholderSlice = createSlice({
  name: 'placeholder',
  initialState: {},
  reducers: {},
});

// Configure the Redux store with reducers
export const store = configureStore({
  reducer: {
    auth: authReducer, // Add the auth reducer for authentication state
    placeholder: placeholderSlice.reducer, // Add your actual reducers here
  },
});

// Define TypeScript types for the store's state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
