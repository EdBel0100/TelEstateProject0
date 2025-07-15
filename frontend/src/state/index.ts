import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  filters: any; 
}

export const initialState: GlobalState = {
  filters: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = action.payload;
    },
  },
});

export const { setFilters } = globalSlice.actions;

export default globalSlice.reducer;
