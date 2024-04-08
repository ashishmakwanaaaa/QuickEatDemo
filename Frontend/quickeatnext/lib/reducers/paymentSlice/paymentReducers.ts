import { fetchPayments } from "@/lib/actions/paymentAction";
import { createSlice } from "@reduxjs/toolkit";

export interface PaymentType {
  id?: number;
  _id: string;
  userId: string;
  customerID: string;
  email: string;
  cardHoldername: string;
  billingaddress?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  amount: string;
  paymentMethod: string;
  Date: Date | any;
  invoice?: string;
}

export interface initialStateTypeForPayment {
  payments: PaymentType[];
  loading: boolean;
  cardpayments: PaymentType[];
  cashpayments: PaymentType[];
  error: null | string | undefined;
}
const initialState: initialStateTypeForPayment = {
  payments: [],
  cardpayments: [],
  cashpayments: [],
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.AllPayments;
        state.cardpayments = action.payload.AllCardPayments;
        state.cashpayments = action.payload.AllCashPayment;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default paymentSlice.reducer;
