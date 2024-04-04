import { fetchSpecificOrder } from "@/lib/actions/orderAction";
import { createSlice } from "@reduxjs/toolkit";

interface initialStateTypeForOrder {
  orders: [];
  loading: boolean;
  error: null | string | undefined;
}
const initialState: initialStateTypeForOrder = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecificOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpecificOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchSpecificOrder.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error;
      });
  },
});

export default orderSlice.reducer;
