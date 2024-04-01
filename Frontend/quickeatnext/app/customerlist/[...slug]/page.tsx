"use client";
import Orders from "@/app/Admin/Orders";
import DashBoard from "@/app/Pages/DashBoard";
import LoginContext from "@/app/LoginState/logincontext";
import { useContext } from "react";

const orderpage = ({ params }: { params: { slug: string } }) => {
  const StateContext = useContext(LoginContext);

  const id: string = params.slug[0];
  console.log(id);
  return (
    <>
      {StateContext.login && (
        <DashBoard>
          <Orders id={id} />
        </DashBoard>
      )}
    </>
  );
};

export default orderpage;
