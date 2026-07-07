import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vps, VpsState } from "@/types/vps.types";
import {
      createVps,
      deleteVps,
      getAllVps,
      getVpsById,
      restartVps,
      startVps,
      stopVps,
} from "./vps.thunk";

const initialState: VpsState = {
      list: [],
      selected: null,

      isLoading: false,
      isCreating: false,
      isDeleting: false,

      error: null,
};

const vpsSlice = createSlice({
      name: "vps",
      initialState,
      reducers: {
            setLoading(state, action: PayloadAction<boolean>) {
                  state.isLoading = action.payload;
            },

            setCreating(state, action: PayloadAction<boolean>) {
                  state.isCreating = action.payload;
            },

            setDeleting(state, action: PayloadAction<boolean>) {
                  state.isDeleting = action.payload;
            },

            setError(state, action: PayloadAction<string | null>) {
                  state.error = action.payload;
            },

            setVpsList(state, action: PayloadAction<Vps[]>) {
                  state.list = action.payload;
            },

            setSelectedVps(state, action: PayloadAction<Vps | null>) {
                  state.selected = action.payload;
            },

            addVps(state, action: PayloadAction<Vps>) {
                  state.list.unshift(action.payload);
            },

            removeVps(state, action: PayloadAction<string>) {
                  state.list = state.list.filter(
                        (vps: Vps) => vps.id !== action.payload,
                  );
            },

            updateVps(state, action: PayloadAction<Vps>) {
                  const index = state.list.findIndex(
                        (vps: Vps) => vps.id === action.payload.id,
                  );

                  if (index !== -1) {
                        state.list[index] = action.payload;
                  }

                  if (state.selected?.id === action.payload.id) {
                        state.selected = action.payload;
                  }
            },

            updateVpsStatus(
                  state,
                  action: PayloadAction<{
                        id: string;
                        status: Vps["status"];
                  }>,
            ) {
                  const vps = state.list.find(
                        (v: Vps) => v.id === action.payload.id,
                  );

                  if (vps) {
                        vps.status = action.payload.status;
                  }

                  if (state.selected?.id === action.payload.id) {
                        state.selected.status = action.payload.status;
                  }
            },

            resetVpsState() {
                  return initialState;
            },
      },
      extraReducers: (builder) => {
            builder
                  // Get All
                  .addCase(getAllVps.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getAllVps.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.list = action.payload;
                  })
                  .addCase(getAllVps.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload as string;
                  })

                  // Get By Id
                  .addCase(getVpsById.pending, (state) => {
                        state.isLoading = true;
                        state.error = null;
                  })
                  .addCase(getVpsById.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.selected = action.payload;
                  })
                  .addCase(getVpsById.rejected, (state, action) => {
                        state.isLoading = false;
                        state.error = action.payload as string;
                  })

                  // Create
                  .addCase(createVps.fulfilled, (state, action) => {
                        state.list.unshift(action.payload);
                  })

                  // Delete
                  .addCase(deleteVps.fulfilled, (state, action) => {
                        state.list = state.list.filter(
                              (vps) => vps.id !== action.payload,
                        );

                        if (state.selected?.id === action.payload) {
                              state.selected = null;
                        }
                  })

                  // Start
                  .addCase(startVps.fulfilled, (state, action) => {
                        const updated = action.payload;

                        const index = state.list.findIndex(
                              (vps) => vps.id === updated.id,
                        );

                        if (index !== -1) {
                              state.list[index] = updated;
                        }

                        if (state.selected?.id === updated.id) {
                              state.selected = updated;
                        }
                  })

                  // Stop
                  .addCase(stopVps.fulfilled, (state, action) => {
                        const updated = action.payload;

                        const index = state.list.findIndex(
                              (vps) => vps.id === updated.id,
                        );

                        if (index !== -1) {
                              state.list[index] = updated;
                        }

                        if (state.selected?.id === updated.id) {
                              state.selected = updated;
                        }
                  })

                  // Restart
                  .addCase(restartVps.fulfilled, (state, action) => {
                        const updated = action.payload;

                        const index = state.list.findIndex(
                              (vps) => vps.id === updated.id,
                        );

                        if (index !== -1) {
                              state.list[index] = updated;
                        }

                        if (state.selected?.id === updated.id) {
                              state.selected = updated;
                        }
                  });
      },
});

export const {
      setLoading,
      setCreating,
      setDeleting,
      setError,
      setVpsList,
      setSelectedVps,
      addVps,
      removeVps,
      updateVps,
      updateVpsStatus,
      resetVpsState,
} = vpsSlice.actions;

export default vpsSlice.reducer;
