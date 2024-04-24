"use client";
import DashBoard from "../Pages/DashBoard";
import LoginContext from "../LoginState/logincontext";
import { useContext } from "react";
import CategoriesList from "../UserPage/CategoryList";
const CategoryData = () => {
  const StateContext = useContext(LoginContext);

  return (
    <>
      <DashBoard>
        <CategoriesList />
      </DashBoard>
    </>
  );
};

export default CategoryData;
