import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchItems = createAsyncThunk(
  "fetchItems",
  async ({
    userId,
    search = "",
    sort = "",
    category = "",
  }: {
    userId: string;
    search: string;
    sort: string;
    category: string;
  }) => {
    const url = new URL(`http://localhost:5000/items/getAllItems/${userId}`);
    const params = { search, sort, category };
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url, {
      credentials: "include",
    });
    const data = await response.json();
    console.log("Item Data", data);
    return data.items;
  }
);
