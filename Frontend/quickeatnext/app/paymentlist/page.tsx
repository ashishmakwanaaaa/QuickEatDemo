"use client";

import Dashboard from "../Pages/DashBoard";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import PaymentList from "../UserPage/PaymentList";

const ItemData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      <Dashboard>
        <PaymentList />
      </Dashboard>
    </>
  );
};
export default ItemData;
