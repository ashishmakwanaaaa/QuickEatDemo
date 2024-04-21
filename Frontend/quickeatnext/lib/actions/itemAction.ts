

import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchItems = createAsyncThunk("fetchItems", async (userId:string) => {
  const response = await fetch(
    `http://localhost:5000/items/getAllItems/${userId}`
  );
  const data = await response.json();
  console.log("Item Data",data)
  return data.items;
});


