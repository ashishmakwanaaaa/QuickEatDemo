import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSpecificOrder = createAsyncThunk(
  "fetchSpecificOrder",
  async (id) => {
    const response = await fetch(
      `http://localhost:5000/orders/getOneOrder/${id}`
    );
    const data = await response.json();
    console.log(data);
    return data.order;
  }
);
