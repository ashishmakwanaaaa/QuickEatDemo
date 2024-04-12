"use client";

import { Button } from "@mui/material";
import { DataGrid, GridRowSelectionApi } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import StateLogin from "../LoginState/logincontext";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/lib/actions/categoryAction";

export interface CategoryType {
  _id?: string;
  categoryname: string;
  image: string;
  userId?: string;
}

const CategoriesList = () => {
  const StateContext = useContext(StateLogin);
  const user = useSelector((state) => state.user.user);
  const userId = user._id;
  console.log(userId);
  const [input, setInput] = useState<CategoryType>({
    categoryname: "",
    image:
      "https://user-images.githubusercontent.com/11474775/72835684-ffb03180-3cac-11ea-88d7-82d5229c47ac.png",
    userId,
  });
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  useEffect(() => {
    dispatch(fetchCategories(userId));
  }, [dispatch, userId]);
  console.log(categories);
  const handelDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/category/delete/${id}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        Swal.fire({
          title: "Delete Category Successfully",
          icon: "success",
          timer: 1000,
        });
        dispatch(fetchCategories(userId));
      } else {
        Swal.fire({
          title: "Error : " + data.message,
          icon: "error",
          timer: 1000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddCatogory = async () => {
    try {
      const imageUrl = await GenerateImage(); // Wait for image generation
      const categoryData = { ...input, image: imageUrl, userId }; // Combine category data with generated image URL
      console.log(categoryData);
      const response = await fetch(
        "http://localhost:5000/category/addcategory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        Swal.fire({
          title: "Category Add Successfully",
          icon: "success",
          timer: 1000,
        });
        setInput({ categoryname: "", image: "" });
        dispatch(fetchCategories(userId));
      } else {
        Swal.fire({
          title: "Error: " + data.message,
          icon: "error",
          timer: 1000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const GenerateImage = async () => {
    try {
      const accessKey = "a4mMmS84fey6hObwQS_BnYxSWcQRXnNGM-rGCq_1A6w";

      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${input.categoryname}&client_id=${accessKey}`
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        return data.urls.regular;
      } else {
        console.error("Failed To Fetch Image", data.errors);
      }
    } catch (error) {
      window.alert(error);
    }
  };

  const columns: (
    | {
        field: string;
        headerName: string;
        width: number;
        renderCell?: undefined;
      }
    | {
        field: string;
        headerName: string;
        width: number;
        renderCell: (params: GridRowSelectionApi) => JSX.Element;
      }
  )[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "name",
      headerName: "Category Name",
      width: 160,
    },
    {
      field: "delete",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Delete",
      width: 60,
      renderCell: (params: GridRowSelectionApi) => (
        <Button
          onClick={() => handelDeleteCategory(params.row._id)}
          style={{ color: "red", padding: "2px", fontSize: "20px" }}
        >
          <MdDelete />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-10 items-center justify-center w-[68rem]">
        {/* <h1 className="font-bold text-start">Categories Details</h1> */}
        <div className="flex flex-row gap-3 justify-center items-center">
          <p className="text-md text-start font-normal">
            Enter Category Name:{" "}
          </p>
          <input
            type="text"
            name="categories"
            value={input.categoryname}
            onChange={(e) =>
              setInput({ ...input, categoryname: e.target.value })
            }
            id=""
            className="border-orange-600 p-1 w-1/2 placeholder-shown:text-sm border rounded-lg drop-shadow-2xl"
          />
          <button
            onClick={handleAddCatogory}
            className="text-black text-sm bg-orange-500 p-2 rounded-md hover:border hover:border-orange-500 hover:text-orange-500 hover:bg-transparent transform duration-300"
          >
            ADD +
          </button>
        </div>

        {categories && categories.length > 0 && (
          <div className="w-[500px] h-[500px]" data-aos="fade-right">
            <DataGrid
              style={{ fontFamily: "Poppins" }}
              rows={categories.map((category, index) => ({
                _id: category._id,
                id: index + 1,
                name: category.categoryname,
                delete: "Delete",
              }))}
              columns={columns}
              pagination
              pageSizeOptions={[
                10,
                20,
                30,
                40,
                100,
                { value: 1000, label: "1,000" },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesList;
