"use client";

import React, { useContext, useState } from "react";
import StateLogin from "../LoginState/logincontext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Customer } from "../UserPage/CustomerList";
import { useSelector } from "react-redux";
import EmailIcon from "@mui/icons-material/Email";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import { user } from "@/lib/reducers";

const AddCustomer = () => {
  const router = useRouter();
  const StateContext = useContext(StateLogin);
  const [email, setEmail] = useState(false);
  const user = useSelector((state: user) => state.user.user);
  const userId = user._id;
  console.log(userId);
  const [CustomerData, setCustomerData] = useState<Customer>({
    userId,
    firstname: "",
    lastname: "",
    emailid: "",
    phoneno: 0,
    address: "",
    state: "",
    city: "",
    pincode: "",
  });

  async function AddCustomer() {
    const response = await fetch("http://localhost:5000/customer/addCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(CustomerData),
    });

    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        title: "Customer Added Successfully",
        icon: "success",
        timer: 1000,
      });
      console.log(StateContext);
      {
        StateContext.login && router.push("/");
      }
    } else {
      Swal.fire({
        width: "50%",
        text: "Error:       " + data.message,
        icon: "error",
        timer: 1000,
      });
    }
    console.log(data);
  }
  const handleClick = (e: { preventDefault: () => void }) => {
    console.log(CustomerData);
    try {
      AddCustomer();
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className="font-[Poppins] relative bg-[url('https://www.shutterstock.com/image-vector/set-healthy-unhealthy-products-fast-600nw-2253591061.jpg')] bg-cover bg-center bg-no-repeat backdrop-blur-lg bg-opacity-100 p-8 rounded-lg min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div
        className="absolute inset-0 flex flex-col h-[620px] gap-4 bg-gray-50 mx-auto p-5 mt-12 rounded-xl"
        style={{
          boxShadow: "0 0 2em orange",
          width: "90%",
          maxWidth: "900px",
          // height: "auto",
          // maxHeight: "620px",
        }}
      >
        <div className="flex justify-between">
          <div
            onClick={() => router.push("/customerlist")}
            className="bg-orange-600 rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer"
          >
            <KeyboardBackspaceIcon />
          </div>
          <h3 className="text-xl font-bold text-center text-orange-500 flex-1">
            ADD CUSTOMER
          </h3>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-5">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="customerName" className="font-bold ">
              Customer's Firstname
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={CustomerData.firstname}
              onChange={(e) =>
                setCustomerData({ ...CustomerData, firstname: e.target.value })
              }
              placeholder="Enter Customer Firstname"
              className="p-2 rounded-md border-2 border-orange-500 w-full"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="customername" className="font-bold">
              Customer's Lastname
            </label>
            <input
              type="text"
              id="customername"
              name="customername"
              value={CustomerData.lastname}
              onChange={(e) =>
                setCustomerData({ ...CustomerData, lastname: e.target.value })
              }
              placeholder="Enter Customer Lastname"
              className="p-2 rounded-md border-2 border-orange-500 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="address" className="font-bold">
            Email ID:
          </label>
          <div className="flex w-full">
            <div className="bg-orange-600 p-2 rounded-bl-md rounded-tl-md text-white flex items-center justify-center">
              <EmailIcon />
            </div>
            <input
              type="email"
              id="address"
              name="address"
              value={CustomerData.emailid}
              onChange={(e) => {
                const email = e.target.value;
                if (!email.includes("@")) {
                  setEmail(true);
                } else {
                  setEmail(false);
                }
                setCustomerData({ ...CustomerData, emailid: email });
              }}
              placeholder="Enter Email Address"
              className="p-2 rounded-tr-md rounded-br-md border-2 border-orange-500 w-full"
            />
          </div>
          {email && (
            <p className="text-red-600 text-sm font-bold">
              Please enter a valid email address
            </p>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-5">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="address" className="font-bold">
              Address:
            </label>
            <textarea
              id="address"
              name="address"
              value={CustomerData.address}
              onChange={(e) =>
                setCustomerData({ ...CustomerData, address: e.target.value })
              }
              placeholder="Enter Restaurant Address"
              className="p-2 rounded-md border-2 border-orange-500 w-full h-32"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="customerName" className="font-bold">
              Contact No:
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={CustomerData.phoneno}
              onChange={(e) =>
                setCustomerData({
                  ...CustomerData,
                  phoneno: parseInt(e.target.value),
                })
              }
              placeholder="Enter Customer Contact No"
              className="p-2 rounded-md border-2 border-orange-500 w-full"
            />
            <label htmlFor="restaurantName" className="font-bold ">
              State:
            </label>
            <input
              type="text"
              id="customername"
              name="customername"
              value={CustomerData.state}
              onChange={(e) =>
                setCustomerData({ ...CustomerData, state: e.target.value })
              }
              placeholder="Enter Customer State"
              className="p-2 rounded-md border-2 border-orange-500 w-[420px]"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-5">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="customerName" className="font-bold">
              City:
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={CustomerData.city}
              onChange={(e) =>
                setCustomerData({ ...CustomerData, city: e.target.value })
              }
              placeholder="Enter Customer City"
              className="p-2 rounded-md border-2 border-orange-500 w-full"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="customername" className="font-bold">
              Pincode:
            </label>
            <input
              type="text"
              id="customername"
              name="customername"
              value={CustomerData.pincode}
              onChange={(e) =>
                setCustomerData({
                  ...CustomerData,
                  pincode: e.target.value,
                })
              }
              placeholder="Enter Customer Pincode"
              className="p-2 rounded-md border-2 border-orange-500 w-full"
            />
          </div>
        </div>
        <button
          onClick={handleClick}
          className="w-full bg-orange-500 text-white p-2 mt-4 rounded-lg hover:bg-transparent hover:text-orange-500 hover:border-orange-500 hover:border transition-all duration-500 font-bold text-lg"
        >
          Add Customer &rarr;
        </button>
      </div>
    </div>
  );
};

export default AddCustomer;
