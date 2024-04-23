"use client";
import DashBoard from "../Pages/DashBoard";
import CustomerList from "../UserPage/CustomerList";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
const CustomerData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      <DashBoard>
        <CustomerList />
      </DashBoard>
    </>
  );
};

export default CustomerData;
