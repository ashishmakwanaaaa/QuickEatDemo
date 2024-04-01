"use client";

import Dashboard from "../Pages/DashBoard";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import PaymentList from "../Admin/PaymentList";

const ItemData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      {StateContext.login && (
        <Dashboard>
          <PaymentList />
        </Dashboard>
      )}
    </>
  );
};
export default ItemData;
