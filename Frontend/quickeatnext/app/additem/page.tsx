"use client";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import AddItem from "../Pages/AddItem";
const CategoryData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      {" "}
      <AddItem />
    </>
  );
};

export default CategoryData;
