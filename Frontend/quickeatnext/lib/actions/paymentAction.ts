import { Action, ActionCreator, createAsyncThunk } from "@reduxjs/toolkit";
import { PaymentType } from "../reducers/paymentSlice/paymentReducers";

export interface PaymentData {
  AllPayments: PaymentType[];
  AllCardPayments: PaymentType[];
  AllCashPayment: PaymentType[];
}
export interface FetchPaymentsPayload {
  userId: string;
}

export const fetchPayments = createAsyncThunk(
  "fetchPayments",
  async (userId: string) => {
    const response = await fetch(
      `http://localhost:5000/payment/allpayment/${userId}`
    );
    const data = await response.json();
    console.log("Item Data", data);
    return {
      AllPayments: data.payments,
      AllCardPayments: data.cardPayment,
      AllCashPayment: data.cashPayment,
    };
  }
);
