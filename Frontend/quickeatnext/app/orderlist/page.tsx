"use client";

import Dashboard from "../Pages/DashBoard";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import OrderListPage from "../UserPage/OrderList";

const ItemData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      <Dashboard>
        <OrderListPage />
      </Dashboard>
    </>
  );
};
export default ItemData;
