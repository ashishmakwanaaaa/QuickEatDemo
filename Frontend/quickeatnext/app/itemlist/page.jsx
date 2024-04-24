"use client";

import Dashboard from "../Pages/DashBoard";
import ItemList from "../UserPage/ItemList";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";

const ItemData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      <Dashboard>
        <ItemList />
      </Dashboard>
    </>
  );
};
export default ItemData;
