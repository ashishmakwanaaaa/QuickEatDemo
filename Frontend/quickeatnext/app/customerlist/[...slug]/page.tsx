"use client";
import Orders from "../../../app/UserPage/Orders";
import DashBoard from "../../../app/Pages/DashBoard";
import LoginContext from "../../../app/LoginState/logincontext";
import { useContext } from "react";
import CustomerProfile from "../../../app/UserPage/CustomerProfile";
import { useParams, usePathname } from "next/navigation";

const orderpage = ({ params }: { params: { slug: string } }) => {
  console.log(params.slug.includes("customerprofile"));
  console.log(params);
  const StateContext = useContext(LoginContext);

  const id: string = params.slug.length > 1 ? params.slug[1] : params.slug[0];

  const location = usePathname();
  console.log(id);
  return (
    <>
      <DashBoard>
        {params.slug.includes("customerprofile") ? (
          <CustomerProfile id={id} />
        ) : (
          <Orders id={id} />
        )}
      </DashBoard>
    </>
  );
};

export default orderpage;
