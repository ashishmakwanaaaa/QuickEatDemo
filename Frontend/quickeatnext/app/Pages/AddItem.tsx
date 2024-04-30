"use client";

import React, { useContext, useEffect, useState } from "react";
import StateLogin from "../LoginState/logincontext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { CategoryType } from "../UserPage/CategoryList";
import { useSelector } from "react-redux";
import { user } from "../../lib/reducers";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const AddItem = () => {
  const router = useRouter();
  const StateContext = useContext(StateLogin);
  const user = useSelector((state: user) => state.user.user);
  const userId = user._id;
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [Fooddata, setFooddata] = useState<{
    userId: string;
    itemname: string;
    itemcategory: string;
    itemdescription: string;
    price: number;
    quantity: number;
    image: string;
    upToOffer: number;
  }>({
    userId,
    itemname: "",
    itemcategory: "",
    itemdescription: "",
    price: 0,
    quantity: 0,
    image:
      "https://user-images.githubusercontent.com/11474775/72835684-ffb03180-3cac-11ea-88d7-82d5229c47ac.png",
    upToOffer: 0,
  });
  useEffect(() => {
    async function FetchCategories() {
      try {
        const response = await fetch(
          `http://localhost:5000/category/getAllCategories/${userId}`
        );
        const data = await response.json();
        console.log(data);
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    }
    FetchCategories();
  }, []);
  async function addItem() {
    const response = await fetch("http://localhost:5000/items/addItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(Fooddata),
    });

    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        title: "Item Added Successfully",
        icon: "success",
        timer: 1000,
      });
      {
        StateContext.login && router.push("/");
      }
    } else {
      Swal.fire({
        text: "Error" + data.message,
        icon: "error",
        timer: 1000,
      });
    }
    console.log(data);
  }
  const handleSubmit = (e: { preventDefault: () => void }) => {
    console.log(Fooddata);
    try {
      e.preventDefault();

      addItem();
    } catch (error) {
      window.alert(error);
    }
  };
  const accessKey = "a4mMmS84fey6hObwQS_BnYxSWcQRXnNGM-rGCq_1A6w";

  const GenerateImage = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${Fooddata.itemname}&client_id=${accessKey}`
      );

      const data = await response.json();
      if (response.ok) {
        setFooddata((prev) => ({
          ...prev,
          image: data.urls.regular,
        }));
      } else {
        console.error("Failed To Fetch Image", data.errors);
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className="font-[Poppins] relative bg-[url('https://www.shutterstock.com/image-vector/set-healthy-unhealthy-products-fast-600nw-2253591061.jpg')] bg-cover bg-center bg-no-repeat backdrop-blur-lg bg-opacity-100 p-8 rounded-lg h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div
        className="absolute inset-0 flex flex-col gap-4 bg-gray-50 w-[800px] h-[620px] mx-auto p-5 mt-12 rounded-xl"
        style={{ boxShadow: "0 0 2em orange" }}
      >
        <div className="flex justify-between">
          <div
            onClick={() => router.push("/customerlist")}
            className=" bg-orange-600 rounded-full w-8 h-8 flex items-center p-2 cursor-pointer justify-center text-white"
          >
            <KeyboardBackspaceIcon />
          </div>
          <h3 className="text-xl font-bold  text-center text-orange-500 mr-[300px]">
            ADD FOOD ITEM
          </h3>
        </div>
        <div className="flex flex-col justify-start gap-5">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2 items-start  w-full md:w-[55%]">
              <label htmlFor="restaurantName" className="font-bold ">
                Item's Name
              </label>
              <input
                type="text"
                id="itemaname"
                name="itemName"
                value={Fooddata.itemname}
                onChange={(e) =>
                  setFooddata({ ...Fooddata, itemname: e.target.value })
                }
                placeholder="Enter Item Name"
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              />
            </div>
            <div className="flex flex-col gap-2 items-start  w-full md:w-[55%]">
              <label htmlFor="restaurantName" className="font-bold ">
                Item's Category
              </label>
              <select
                id="itemcat"
                name="itemCategory"
                value={Fooddata.itemcategory}
                onChange={(e) =>
                  setFooddata({ ...Fooddata, itemcategory: e.target.value })
                }
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              >
                <option value="" disabled selected>
                  Select Item Category
                </option>
                {categories &&
                  categories.length > 0 &&
                  categories.map((category, index) => {
                    return (
                      <>
                        <option value={category.categoryname}>
                          {category.categoryname}
                        </option>
                      </>
                    );
                  })}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-start w-full md:w-[55%]">
            <label htmlFor="restaurantName" className="font-bold  ">
              Item's Description
            </label>
            <textarea
              id="itemdesc"
              name="itemdesc"
              value={Fooddata.itemdescription}
              onChange={(e) =>
                setFooddata({ ...Fooddata, itemdescription: e.target.value })
              }
              placeholder="Enter Item Description"
              className="p-2 rounded-md border-2 border-orange-500 w-[760px] h-28"
            />
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2  w-full">
              <label htmlFor="address" className="font-bold ">
                Item's Quantity
              </label>
              <input
                id="qty"
                name="qty"
                type="number"
                value={Fooddata.quantity}
                onChange={(e) => {
                  setFooddata({
                    ...Fooddata,
                    quantity: parseInt(e.target.value),
                  });
                }}
                placeholder="Enter Item Quantity"
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <label htmlFor="address" className="font-bold ">
                Item's Price:
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={Fooddata.price}
                onChange={(e) =>
                  setFooddata({ ...Fooddata, price: parseInt(e.target.value) })
                }
                placeholder="Enter Item Price"
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <label htmlFor="address" className="font-bold ">
                Enter Offer:
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={Fooddata.upToOffer}
                onChange={(e) =>
                  setFooddata({
                    ...Fooddata,
                    upToOffer: parseInt(e.target.value),
                  })
                }
                placeholder="Enter Item Price"
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col justify-start">
              <label htmlFor="" className="font-bold ">
                Item Image:
              </label>
              <div className="p-2 w-[200px] h-[150px] rounded-md">
                <img
                  src={Fooddata.image}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="flex flex-col row gap-2 w-full my-auto">
              <button
                onClick={GenerateImage}
                className="w-full bg-orange-500 hover:text-orange-500 hover:bg-transparent transition-all duration-500 hover:border-orange-500 hover:border font-bold text-lg text-white p-2 mt-4 rounded-lg"
              >
                &larr; Generate Item Image
              </button>
              <button
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:text-orange-500 hover:bg-transparent transition-all duration-500 hover:border-orange-500 hover:border font-bold text-lg text-white p-2 mt-4 rounded-lg"
              >
                Add Item &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
