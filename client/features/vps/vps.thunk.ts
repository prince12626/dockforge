import { createAsyncThunk } from "@reduxjs/toolkit";
import { vpsService } from "./vps.service";
import { CreateVpsPayload, UpdateVpsPayload } from "@/types/vps.types";

const getErrorMessage = (error: unknown): string => {
      if (error instanceof Error) return error.message;
      return "Something went wrong";
};

export const getAllVps = createAsyncThunk("vps/getAll", async (_, thunkAPI) => {
      try {
            return await vpsService.getAll();
      } catch (error) {
            return thunkAPI.rejectWithValue(getErrorMessage(error));
      }
});

export const getVpsById = createAsyncThunk(
      "vps/getById",
      async (id: string, thunkAPI) => {
            try {
                  return await vpsService.getById(id);
            } catch (error) {
                  return thunkAPI.rejectWithValue(getErrorMessage(error));
            }
      },
);

export const createVps = createAsyncThunk(
      "vps/create",
      async (data: CreateVpsPayload, thunkAPI) => {
            try {
                  return await vpsService.create(data);
            } catch (error) {
                  return thunkAPI.rejectWithValue(getErrorMessage(error));
            }
      },
);

export const deleteVps = createAsyncThunk(
      "vps/delete",
      async (id: string, thunkAPI) => {
            try {
                  await vpsService.delete(id);
                  return id;
            } catch (error) {
                  return thunkAPI.rejectWithValue(getErrorMessage(error));
            }
      },
);

export const startVps = createAsyncThunk(
      "vps/start",
      async (id: string, thunkAPI) => {
            try {
                  return await vpsService.start(id);
            } catch (error) {
                  return thunkAPI.rejectWithValue(getErrorMessage(error));
            }
      },
);

export const stopVps = createAsyncThunk(
      "vps/stop",
      async (id: string, thunkAPI) => {
            try {
                  return await vpsService.stop(id);
            } catch (error) {
                  return thunkAPI.rejectWithValue(getErrorMessage(error));
            }
      },
);

export const restartVps = createAsyncThunk(
      "vps/restart",
      async (id: string, thunkAPI) => {
            try {
                  return await vpsService.restart(id);
            } catch (error) {
                  return thunkAPI.rejectWithValue(getErrorMessage(error));
            }
      },
);
