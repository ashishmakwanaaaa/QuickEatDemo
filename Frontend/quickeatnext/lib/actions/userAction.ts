import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  const response = await fetch("http://localhost:5000/auth/getalluser");
  const data = await response.json();
  console.log("User data",data);
  return {
    AllUser: data.users,
    AllActiveUser: data.activeusers,
  };
});
