import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@/types/auth.type";
import { getCurrentUser, login, logout } from "./auth.thunk";

const initialState: AuthState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
};

const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {
            clearAuthError(state) {
                  state.error = null;
            },

            resetAuth(state) {
                  state.user = null;
                  state.isAuthenticated = false;
                  state.isLoading = false;
                  state.error = null;
            },
      },

      extraReducers: (builder) => {
            builder

                  // Login
                  .addCase(login.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })

                  .addCase(login.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.user = action.payload;
                        state.isAuthenticated = true;
                  })

                  .addCase(login.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload as string;
                  })

                  // Get Current User
                  .addCase(getCurrentUser.pending, (state) => {
                        state.isLoading = true;
                  })

                  .addCase(getCurrentUser.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.user = action.payload;
                        state.isAuthenticated = !!action.payload;
                  })

                  .addCase(getCurrentUser.rejected, (state) => {
                        state.isLoading = false;
                        state.user = null;
                        state.isAuthenticated = false;
                  })

                  // Logout
                  .addCase(logout.fulfilled, (state) => {
                        state.user = null;
                        state.isAuthenticated = false;
                        state.error = null;
                  });
      },
});

export const { clearAuthError, resetAuth } = authSlice.actions;

export default authSlice.reducer;
