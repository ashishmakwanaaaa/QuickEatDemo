"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowSelectionApi,
} from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import StateLogin from "../LoginState/logincontext";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../lib/actions/categoryAction";
import { category, user } from "../../lib/reducers";
import { useAppDispatch } from "../../lib/store";

export interface CategoryType {
  _id?: string;
  categoryname: string;
  image: string;
  userId?: string;
}

const CategoriesList = () => {
  const user = useSelector((state: user) => state.user.user);
  const [open, setOpen] = useState<boolean>(false);
  const [open1, setOpen1] = useState<boolean>(false);
  const [Categoryid, setCategorieid] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const userId = user._id;
  const [input, setInput] = useState<CategoryType>({
    categoryname: "",
    image:
      "https://user-images.githubusercontent.com/11474775/72835684-ffb03180-3cac-11ea-88d7-82d5229c47ac.png",
    userId,
  });
  const [editinput, setEditInput] = useState<CategoryType>({
    categoryname: "",
    image:
      "https://user-images.githubusercontent.com/11474775/72835684-ffb03180-3cac-11ea-88d7-82d5229c47ac.png",
    userId,
  });
  const dispatch = useAppDispatch();
  const categories = useSelector(
    (state: category) => state.category.categories
  );
  const loading = useSelector((state: category) => state.category.loading);
  useEffect(() => {
    dispatch(fetchCategories(userId));
  }, [dispatch, userId]);
  console.log(categories);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickOpen1 = (name: string, id: string) => {
    setOpen1(true);
    setEditInput({ ...editinput, categoryname: name });
    // setInput({ ...input, categoryname: name });
    setCategorieid(id);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpen1(false);
  };
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
    setOpen(false);
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
          credentials: "include",
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
  const handleEditCategory = async () => {
    setOpen1(false);
    const imageUrl = await GenerateImage(); // Wait for image generation
    const categoryData = { ...editinput, image: imageUrl, userId }; // Combine category data with generated image URL
    console.log(categoryData);
    try {
      const response = await fetch(
        `http://localhost:5000/category/editcategory/${Categoryid}`,
        {
          method: "PATCH",
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
          title: "Category Update Successfully",
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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      cellClassName: "dark:text-white",
      width: 200,
    },
    {
      field: "name",
      headerName: "Category Name",
      cellClassName: "dark:text-white",
      width: 200,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 200,
      renderCell: (params: GridCellParams) => (
        <Button
          onClick={() => handleClickOpen1(params.row.name, params.row._id)}
          style={{ color: "green", padding: "2px", fontSize: "20px" }}
        >
          <MdEdit />
        </Button>
      ),
    },
    {
      field: "delete",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Delete",
      width: 200,
      renderCell: (params: GridCellParams) => (
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
      <div className="flex flex-col gap-10 mt-4 items-center justify-center w-[68rem]">
        {loading ? (
          <>
            <div className="animate-pulse flex justify-between w-full p-4">
              <div className="bg-gray-300 rounded-md h-10 w-1/4"></div>
              <div className="bg-orange-500 rounded-md h-10 w-48 opacity-50"></div>
            </div>
            <div className="animate-pulse bg-gray-300 rounded-lg w-[1000px] h-[600px]"></div>
          </>
        ) : (
          <div className="flex flex-col items-end">
            <div className="flex justify-between gap-[380px] h-10">
              <h1 className="font-bold text-start">Category Details</h1>
              <div className="flex flex-row gap-2">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="border text-sm border-orange-500 rounded-lg p-2 w-full"
                  placeholder="Search Category Here"
                />
                <button
                  onClick={handleClickOpen}
                  className="text-black text-sm bg-orange-500 p-2 rounded-md hover:border hover:border-orange-500 hover:text-orange-500 w-48 hover:bg-transparent transform duration-300"
                >
                  ADD CATEGORY
                </button>
              </div>
            </div>
            {categories && categories.length > 0 && (
              <div className="w-full h-full p-2 mt-2">
                <DataGrid
                  style={{ fontFamily: "Poppins" }}
                  rows={categories
                    .filter((category) =>
                      category.categoryname.toLowerCase().includes(query)
                    )
                    .map((category, index) => ({
                      _id: category._id,
                      id: index + 1,
                      name: category.categoryname,
                      delete: "Delete",
                      edit: "Edit",
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
        )}
      </div>
      <Dialog
        style={{ borderRadius: "20px" }}
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: {
            preventDefault: () => void;
            currentTarget: HTMLFormElement | undefined;
          }) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "orange",
          }}
        >
          ADD CATEGORY HERE
        </DialogTitle>
        <DialogContent
          className="mt-4"
          style={{ height: "100px", width: "600px", overflowY: "auto" }}
        >
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            data-testid="categoryname"
            margin="dense"
            name="email"
            id="email"
            label="Category Name"
            placeholder="Enter Category Name"
            value={input.categoryname}
            onChange={(e) =>
              setInput({ ...input, categoryname: e.target.value })
            }
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{
              border: "1px solid #FFA500",
              color: "#FFA500",
              marginRight: "10px",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            className="border border-orange-500 text-orange-500 hover:bg-orange-100 hover:text-orange-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddCatogory}
            style={{
              backgroundColor: "#FFA500",
              color: "#FFFFFF",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            ADD
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        style={{ borderRadius: "20px" }}
        open={open1}
        onClose={handleClose1}
        PaperProps={{
          component: "form",
          onSubmit: (event: {
            preventDefault: () => void;
            currentTarget: HTMLFormElement | undefined;
          }) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose1();
          },
        }}
      >
        <DialogTitle
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: "orange",
          }}
        >
          EDIT CATEGORY HERE
        </DialogTitle>
        <DialogContent
          className="mt-4"
          style={{ height: "100px", width: "600px", overflowY: "auto" }}
        >
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Category Name"
            value={editinput.categoryname}
            onChange={(e) =>
              setEditInput({ ...editinput, categoryname: e.target.value })
            }
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose1}
            style={{
              border: "1px solid #FFA500",
              color: "#FFA500",
              marginRight: "10px",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            className="border border-orange-500 text-orange-500 hover:bg-orange-100 hover:text-orange-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditCategory}
            style={{
              backgroundColor: "#FFA500",
              color: "#FFFFFF",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            EDIT
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoriesList;
