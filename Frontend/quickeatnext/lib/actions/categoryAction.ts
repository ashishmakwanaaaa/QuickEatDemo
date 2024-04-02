import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
  "fetchCategories",
  async (userId) => {
    const response = await fetch(
      `http://localhost:5000/category/getAllCategories/${userId}`
    );
    const data = await response.json();
    console.log("Item Data", data);
    return data.categories;
  }
);
