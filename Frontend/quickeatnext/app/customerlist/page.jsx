"use client";
import DashBoard from "../Pages/DashBoard";
import CustomerList from "../Admin/CustomerList";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
const CustomerData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      {StateContext.login && (
        <DashBoard>
          <CustomerList />
        </DashBoard>
      )}
    </>
  );
};

export default CustomerData;
