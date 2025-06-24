import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name:'auth',
    initialState:{
        loggedIn: false,
        user: null,
        loading: true
    },

    reducers:{
        login(state, action) {
            state.loggedIn = true;
            state.user = action.payload;
            state.loading = false;
        },
        logout(state) {
            state.loggedIn = false;
            state.user = null;
            state.loading = false;
        },
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer