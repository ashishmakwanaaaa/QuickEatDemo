"use client";

import Dashboard from "../Pages/DashBoard";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import BookTable from "../Admin/BookTable";

const ItemData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      {StateContext.login && (
        <Dashboard>
          <BookTable />
        </Dashboard>
      )}
    </>
  );
};
export default ItemData;
