import { fetchCustomer, fetchCustomerById } from "../../../lib/actions/customerAction";
import { Customer } from "../../../app/UserPage/CustomerList";

import { createSlice } from "@reduxjs/toolkit";

export interface initialStateTypeForCustomer {
  customer: Customer[];
  specificcustomer: Customer;
  loading: boolean;
  error: null | string | undefined;
}
export const initialState: initialStateTypeForCustomer = {
  customer: [],
  specificcustomer: {
    userId: "",
    firstname: "",
    lastname: "",
    emailid: "",
    phoneno: 0,
    address: "",
    state: "",
    city: "",
    pincode: "",
  },
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
