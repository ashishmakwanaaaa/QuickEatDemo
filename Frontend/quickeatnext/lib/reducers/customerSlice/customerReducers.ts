import { Customer } from "@/app/Admin/CustomerList";
import { fetchCustomer, fetchCustomerById } from "@/lib/actions/customerAction";
import { createSlice } from "@reduxjs/toolkit";

export interface initialStateTypeForCustomer {
  customer: Customer[];
  specificcustomer: {};
  loading: boolean;
  error: null | string | undefined;
}
export const initialState: initialStateTypeForCustomer = {
  customer: [],
  specificcustomer: {},
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.specificcustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
