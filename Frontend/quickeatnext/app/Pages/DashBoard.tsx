"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";

const DashBoard = ({ children }: any) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const handleClick = (moduleName: string) => {
    router.push(moduleName);
  };
  const Menus = [
    {
      title: "Dashboard",
      src: "https://cdn0.iconfinder.com/data/icons/essentials-9/128/__Home-64.png",
      redirect: "/dashboard",
    },
    {
      title: "Customer List",
      src: "https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user-64.png",
      redirect: "/customerlist",
    },
    {
      title: "Item List",
      src: "https://cdn2.iconfinder.com/data/icons/flat-glyph-seo/128/_Checklist_clipboard_itemlist_items_list_shopping_list-46-64.png",
      redirect: "/itemlist",
    },
    {
      title: "Categories",
      src: "https://cdn2.iconfinder.com/data/icons/boxicons-regular-vol-1/24/bx-category-64.png",
      redirect: "/categories",
    },
    {
      title: "Payment History",
      src: "https://cdn0.iconfinder.com/data/icons/mobile-basic-vol-1/32/Wallet-64.png",
      redirect: "/paymentlist",
    },
    {
      title: "Order List",
      src: "https://cdn0.iconfinder.com/data/icons/ecommerce-elements-line/120/My_orders-64.png",
      redirect: "/orderlist",
    },
  ];
  return (
    <>
      <Navbar />
      <div className="flex flex-row font-[Poppins]">
        <Sidebar
          open={open}
          setOpen={setOpen}
          menus={Menus}
          onModuleClick={handleClick}
        />
        <div className="p-7 text-2xl font-semibold flex-1 h-screen">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashBoard;
