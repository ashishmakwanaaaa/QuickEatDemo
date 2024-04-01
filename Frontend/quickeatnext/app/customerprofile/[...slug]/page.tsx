"use client";

import CustomerProfile from "@/app/Admin/CustomerProfile";
import DashBoard from "@/app/Pages/DashBoard";
import LoginContext from "@/app/LoginState/logincontext";
import { useContext } from "react";

const Profile = ({ params }: { params: { slug: string } }) => {
  const id: string = params.slug[0];
  const StateContext = useContext(LoginContext);
  return (
    <>
      {StateContext.login && (
        <DashBoard>
          <CustomerProfile id={id} />
        </DashBoard>
      )}
    </>
  );
};

export default Profile;
