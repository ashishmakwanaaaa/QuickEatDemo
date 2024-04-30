"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { user } from "../../lib/reducers";

const DashBoard = ({ children }: any) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const role = localStorage.getItem("role") || "";
  const user = useSelector((state: user) => state.user.user);
  const handleClick = (moduleName: string) => {
    router.push(moduleName);
  };
  const MenusForUser = [
    {
      title: "Dashboard",
      src:
        "https://cdn0.iconfinder.com/data/icons/essentials-9/128/__Home-64.png",
      redirect: "/dashboard",
    },
    {
      title: "Book A Table",
      src: "https://www.svgrepo.com/show/65745/restaurant-table-and-chairs.svg",
      redirect: "/tablebooking",
    },
    {
      title: "Customer List",
      src: "https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user-64.png",
      redirect: "/customerlist",
    },
    {
      title: "Item List",
      src:
        "https://cdn2.iconfinder.com/data/icons/flat-glyph-seo/128/_Checklist_clipboard_itemlist_items_list_shopping_list-46-64.png",
      redirect: "/itemlist",
    },
    {
      title: "Categories",
      src:
        "https://cdn2.iconfinder.com/data/icons/boxicons-regular-vol-1/24/bx-category-64.png",
      redirect: "/categories",
    },
    {
      title: "Payment History",
      src:
        "https://cdn0.iconfinder.com/data/icons/mobile-basic-vol-1/32/Wallet-64.png",
      redirect: "/paymentlist",
    },
    {
      title: "Order List",
      src:
        "https://cdn0.iconfinder.com/data/icons/ecommerce-elements-line/120/My_orders-64.png",
      redirect: "/orderlist",
    },
  ];

  const MenusForAdmin = [
    {
      title: "Admin Dashboard",
      src:
        "https://cdn0.iconfinder.com/data/icons/essentials-9/128/__Home-64.png",
      redirect: "/adminside",
    },
    {
      title: "View All Restrurant",
      src:
        "https://cdn3.iconfinder.com/data/icons/mail-useful-icons/32/location-512.png",
      redirect: "/allrestrurant",
    },
    {
      title: "Recent Orders",
      src:
        "https://cdn0.iconfinder.com/data/icons/ecommerce-elements-line/120/My_orders-64.png",
      redirect: "/recentorder",
    },
    {
      title: "Manage User",
      src:
        "https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png",
      redirect: "/manageuser",
    },
  ];
  return (
    <>
      <Navbar />
      <div className="flex flex-row gap-3 w-full h-full font-[Poppins]">
        <Sidebar
          open={open}
          setOpen={setOpen}
          menus={!user.isAdmin ? MenusForUser : MenusForAdmin}
          onModuleClick={handleClick}
        />
        <div className="flex flex-col gap-1 justify-center items-center w-[68rem]">
          <div className="p-2 text-2xl font-semibold flex-1 h-screen">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
