import { createAsyncThunk } from "@reduxjs/toolkit";

export interface FetchCustomerPayload {
  id: string;
}

export const fetchCustomer = createAsyncThunk(
  "fetchCustomer",
  async (userId:string) => {
    const response = await fetch(
      `http://localhost:5000/customer/getAllCustomer/${userId}`
    );
    console.log(response);

    const data = await response.json();
    console.log("Item Data", data);
    return data.customers;
  }
);

export const fetchCustomerById = createAsyncThunk(
  "fetchcustomerbyid",
  async (id:string) => {
    console.log(id);
    const response = await fetch(
      `http://localhost:5000/customer/getCustomer/${id}`
    );
    const data = await response.json();
    console.log(data);
    return data.customer;
  }
);
