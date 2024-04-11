"use client";

import React, { useState } from "react";
import Logo from "../assests/control.png";
import { usePathname, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { FaMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import Image from "next/image";

const Sidebar = ({
  open,
  setOpen,
  menus,
  onModuleClick,
}: {
  open: boolean;
  setOpen: any;
  menus: {
    title: string;
    src: string;
    redirect: string;
  }[];
  onModuleClick: (route: string) => void;
}) => {
  const handlemoduleClick = (route: string) => {
    onModuleClick(route);
  };
  const Location = usePathname();
  const role = localStorage.getItem("role");
  console.log(Location);
  const { setTheme } = useTheme();
  const [darkMode, setdarkMode] = useState(false);
  return (
    <div
      className={`${
        open ? "w-72" : "w-20"
      } duration-300 p-5 pt-8 mt-2  h-screen bg-stone-900 dark:bg-gray-800 dark:text-white relative rounded-tr-3xl rounded-br-3xl`}
    >
      <Image
        src={Logo}
        onClick={() => setOpen(!open)}
        className={`absolute cursor-pointer rounded-full -right-5 top-64 w-10 border-2 border-dark-purple ${
          !open && "rotate-180"
        }`}
        alt={""}
      />
      <div className="flex gap-x-4 items-center">
        <img
          src="https://cdn.vectorstock.com/i/1000x1000/26/10/food-fork-spoon-fruit-orange-logo-vector-24042610.webp"
          alt="QuickEat Logo"
          className={`cursor-pointer duration-500 h-6 w-6 rounded-md object-cover `}
          data-aos="fade-right"
        />
        <h1
          className={`text-orange-600 origin-left font-[Poppins] font-bold text-xl duration-300 ${
            !open && "scale-0"
          }`}
        >
          QUICKEAT
        </h1>
        <div
          className={`border text-white h-9 ml-10 duration-300 origin-left ${
            !open && "scale-0"
          } border-gray-500 p-2 cursor-pointer rounded-md bg-transparent`}
        >
          {darkMode ? (
            <FaMoon
              onClick={() => {
                setdarkMode(false);
                setTheme("light");
              }}
            />
          ) : (
            <IoSunnyOutline
              onClick={() => {
                setdarkMode(true);
                setTheme("dark");
              }}
            />
          )}
        </div>
      </div>
      <ul className="pt-6">
        {menus.map(
          (
            menu: {
              redirect: string;
              src: string | undefined;
              title: string;
            },
            index: React.Key | null | undefined
          ) => (
            <li
              key={index}
              className={`text-gray-300 ${
                Location.startsWith(menu.redirect) && "bg-orange-500 text-black"
              } text-lg flex items-center gap-x-4 mt-7 cursor-pointer p-2 hover:bg-orange-500 transition duration-300 hover:text-black transform  rounded-md`}
            >
              <img
                src={menu.src}
                className="h-8 w-8 rounded-md object-cover filter brightness-0 invert"
              />
              <span
                onClick={() => handlemoduleClick(menu.redirect)}
                className={`${
                  role !== "Admin" ? "text-md" : "text-sm"
                } font-[Poppins] ${!open && "hidden"} ${
                  Location === menu.redirect && " text-black"
                } origin-left duration-200 ${!open && "scale-0"}`}
              >
                {menu.title}
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
