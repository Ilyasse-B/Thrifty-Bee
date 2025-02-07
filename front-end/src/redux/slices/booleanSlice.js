import { createSlice } from '@reduxjs/toolkit';

const booleanSlice = createSlice({
    name: 'boolean',
    initialState: { value: false }, // Default state (false)
    reducers: {
        toggle: (state) => {
            state.value = !state.value; // Toggle the boolean value
        },
        setTrue: (state) => {
            state.value = true; // Set the value to true
        },
        setFalse: (state) => {
            state.value = false; // Set the value to false
        },
    },
});

export const { toggle, setTrue, setFalse } = booleanSlice.actions;
export default booleanSlice.reducer;