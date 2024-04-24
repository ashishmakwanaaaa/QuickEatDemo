"use client";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import AddCustomer from "../Pages/AddCustomer";
const CategoryData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      <AddCustomer />
    </>
  );
};

export default CategoryData;
