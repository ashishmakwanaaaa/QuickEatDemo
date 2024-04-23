"use client";

import Dashboard from "../Pages/DashBoard";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import BookTable from "../UserPage/BookTable";

const ItemData = () => {
  return (
    <>
      <Dashboard>
        <BookTable />
      </Dashboard>
    </>
  );
};
export default ItemData;
