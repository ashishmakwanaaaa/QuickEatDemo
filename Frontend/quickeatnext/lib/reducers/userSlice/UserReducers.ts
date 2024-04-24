import { fetchUser, fetchUsers } from "@/lib/actions/userAction";
import { createSlice } from "@reduxjs/toolkit";

export interface User {
  _id?: string | undefined | any;
  restaurantname: string;
  ownername: string;
  emailid: string;
  password: string;
  confirmpassword: string;
  image: string;
  resimage: string;
  isAdmin: boolean;
  isActive: boolean;
  lat: string | number | any;
  long: string | number | any;
}

export interface initialStateTypeForUsers {
  users: User[];
  user: User;
  activeusers: User[];
  loading: boolean;
  error: null | string | undefined;
}
const initialState: initialStateTypeForUsers = {
  users: [],
  user: {
    restaurantname: "",
    ownername: "",
    emailid: "",
    password: "",
    confirmpassword: "",
    image: "",
    resimage: "",
    isAdmin: false,
    isActive: false,
    lat: undefined,
    long: undefined
  },
  activeusers: [],
  loading: false,
  error: null,
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logoutUser(state) {
      state.user.isActive = false;
      state.loading = false;
      state.error = null;
    },
    updateUser(state,action){
      state.user = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.AllUser;
        state.activeusers = action.payload.AllActiveUser;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logoutUser,updateUser } = UserSlice.actions;
export default UserSlice.reducer;
