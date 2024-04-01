"use client";
import DashBoard from "../Pages/DashBoard";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import CategoriesList from "../Admin/CategoryList";
const CategoryData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      {StateContext.login && (
        <DashBoard>
          <CategoriesList />
        </DashBoard>
      )}
    </>
  );
};

export default CategoryData;
