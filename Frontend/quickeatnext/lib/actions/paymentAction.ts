"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPayments = createAsyncThunk("fetchPayments", async (userId) => {
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
});


