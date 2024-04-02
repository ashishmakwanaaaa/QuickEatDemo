import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCustomer = createAsyncThunk(
  "fetchCategories",
  async (userId) => {
    const response = await fetch(
      `http://localhost:5000/customer/getAllCustomer/${userId}`
    );
    const data = await response.json();
    console.log("Item Data", data);
    return data.customers;
  }
);

export const fetchCustomerById = createAsyncThunk(
  "fetchcustomerbyid",
  async (id) => {
    console.log(id);
    const response = await fetch(
      `http://localhost:5000/customer/getCustomer/${id}`
    );
    const data = await response.json();
    console.log(data);
    return data.customer;
  }
);
