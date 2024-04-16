import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  const response = await fetch("http://localhost:5000/auth/getalluser");
  const data = await response.json();
  console.log("User data", data);
  return {
    AllUser: data.users,
    AllActiveUser: data.activeusers,
  };
});

export const fetchUser = createAsyncThunk("fetchUser", async (formData) => {
  const response = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  console.log(response);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.user;
});
