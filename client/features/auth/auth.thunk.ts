import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "@/services/auth.service";

export const login = createAsyncThunk("auth/login", async (_, thunkAPI) => {
      try {
            return await authService.login();
      } catch (error: any) {
            return thunkAPI.rejectWithValue(error?.message ?? "Login failed");
      }
});

export const getCurrentUser = createAsyncThunk(
      "auth/getCurrentUser",
      async (_, thunkAPI) => {
            try {
                  return await authService.getCurrentUser();
            } catch (error: any) {
                  return thunkAPI.rejectWithValue(
                        error?.message ?? "Unable to fetch user",
                  );
            }
      },
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
      try {
            await authService.logout();
      } catch (error: any) {
            return thunkAPI.rejectWithValue(error?.message ?? "Logout failed");
      }
});
