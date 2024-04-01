"use client";

import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import MyProfilePage from "../Pages/MyProfilePage";

const Profile = () => {
  const StateContext = useContext(LoginContext);

  return <>{StateContext.login && <MyProfilePage />}</>;
};
export default Profile;
