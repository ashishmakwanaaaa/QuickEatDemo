import { OrderDataType } from "@/app/Admin/Orders";
import { fetchSpecificOrder } from "@/lib/actions/orderAction";
import { createSlice } from "@reduxjs/toolkit";

export interface initialStateTypeForOrder {
  orders: OrderDataType;
  loading: boolean;
  error: null | string | undefined;
}
const initialState: initialStateTypeForOrder = {
  orders: {
    _id: undefined,
    userId: "",
    customerID: undefined,
    customerfirstname: "",
    customerlastname: "",
    customeremailid: "",
    customerphoneno: 0,
    selectedItem: [],
    totalAmount: undefined,
    Date: "",
  },
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
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
