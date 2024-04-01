"use client";

import AdminDashboard from "../Admin/AdminDashboard";
import DashBoard from "../Pages/DashBoard";
import LoginContext from "@/app/LoginState/logincontext";
import { useContext } from "react";

const DashBoardPage = () => {
  const StateContext = useContext(LoginContext);
  return (
    <>
      {StateContext.login && (
        <DashBoard>
          <AdminDashboard />
        </DashBoard>
      )}
    </>
  );
};

export default DashBoardPage;
