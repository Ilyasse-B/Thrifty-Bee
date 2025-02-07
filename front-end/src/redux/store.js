import { configureStore } from '@reduxjs/toolkit';
import booleanReducer from './slices/booleanSlice'; // Import the reducer

const store = configureStore({
    reducer: {
        boolean: booleanReducer, // Register the reducer in the store
    },
});

export default store;

