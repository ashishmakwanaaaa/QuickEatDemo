import { ItemType } from "@/app/Admin/ItemList";
import { fetchCategories } from "@/lib/actions/categoryAction";
import { createSlice } from "@reduxjs/toolkit";

export interface initialStateTypeForCategory {
  categories: ItemType[];
  loading: boolean;
  error: null | string | undefined;
}
const initialState: initialStateTypeForCategory = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
