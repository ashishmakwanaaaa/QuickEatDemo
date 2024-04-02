import { ItemType } from "@/app/Admin/ItemList";
import { fetchItems } from "@/lib/actions/itemAction";

import { createSlice } from "@reduxjs/toolkit";

export interface initialStateTypeForItems {
  items: ItemType[];
  loading: boolean;
  error: null | string | undefined;
}
const initialState: initialStateTypeForItems = {
  items: [],
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default itemSlice.reducer;
