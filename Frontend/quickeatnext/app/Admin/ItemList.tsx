import React, { useContext, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import StateLogin from "../LoginState/logincontext";
import { useSelector, useDispatch } from "react-redux";
import "aos/dist/aos.css";
import AOS from "aos";
import Carousel from "@itseasy21/react-elastic-carousel";
import { CategoryType } from "./CategoryList";
import { fetchItems } from "@/lib/actions/itemAction";
import { fetchCategories } from "@/lib/actions/categoryAction";

export interface ItemType {
  _id: string;
  itemname: string;
  itemdescription: string;
  itemcategory: string;
  price: number;
  quantity: number;
  upToOffer: number;
  image: string;
}
const ItemList = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  const StateContext = useContext(StateLogin);
  const userId = StateContext.userid;
  const [open, setOpen] = useState<boolean>(false);
  const [edititemdata, setEditItem] = useState<ItemType>({});
  const [query, setQuery] = useState<string>("");
  const [option, setOption] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const dispatch = useDispatch();
  const items: ItemType[] = useSelector((state) => state.item.items);
  const categories: CategoryType[] = useSelector(
    (state) => state.category.categories
  );

  const handleClickOpen = (item: React.SetStateAction<ItemType>) => {
    setOpen(true);
    setEditItem(item);
  };
  console.log(edititemdata);
  const handleClose = () => {
    setOpen(false);
  };

  const handleEditItem = async (edititemdata: ItemType) => {
    setOpen(false);
    const confirm = await Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    });
    if (confirm.isConfirmed) {
      try {
        const itemId = edititemdata._id;
        const response = await fetch(
          `http://localhost:5000/items/updateItem/${itemId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(edititemdata),
          }
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          Swal.fire({
            title: "Item Update Successfully",
            icon: "success",
            timer: 2000,
          });
          dispatch(fetchItems(userId));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleDeleteItem = async (item: ItemType) => {
    const confirm = await Swal.fire({
      title: "Are You Sure You Want to Delete This Item?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const itemId = item._id;
        const response = await fetch(
          `http://localhost:5000/items/deleteItem/${itemId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          Swal.fire({
            title: "Item Deleted Successfully",
            icon: "success",
            timer: 1000,
          });
          dispatch(fetchItems(userId));
        } else {
          Swal.fire({
            title: "Delete Failed",
            text: "Failed to delete item. Please try again later.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the item. Please try again later.",
          icon: "error",
        });
      }
    }
  };

  const accessKey = "a4mMmS84fey6hObwQS_BnYxSWcQRXnNGM-rGCq_1A6w";
  const generateImage = async (name: string) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${name}&client_id=${accessKey}`
      );

      const data = await response.json();
      if (response.ok) {
        setEditItem({ ...edititemdata, image: data.urls.regular });
      } else {
        console.error("Failed To Fetch Image", data.errors);
      }
    } catch (error) {
      window.alert(error);
    }
  };

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setOption(e.target.value);
    console.log(option);
  };

  useEffect(() => {
    dispatch(fetchItems(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    dispatch(fetchCategories(userId));
  }, [dispatch, userId]);
  const filteredItems: ItemType[] =
    items && items.length > 0
      ? items
          .filter((item) => item.itemname.toLowerCase().includes(query))
          .filter(
            (item) =>
              selectedCategory === "" || item.itemcategory === selectedCategory
          )
          .sort((a, b) => {
            switch (option) {
              case "Price Highest":
                return b.price - a.price;
              case "Price Lowest":
                return a.price - b.price;
              case "Qty Highest":
                return b.quantity - a.quantity;
              case "Qty Lowest":
                return a.quantity - b.quantity;
              default:
                return 0;
            }
          })
      : [];

  return (
    <div className="font-[Poppins] flex flex-col gap-6 w-[68rem]">
      <div className="flex flex-row justify-between items-center">
        <h1
          className="text-start  text-black font-bold text-md"
          data-aos="fade-left"
        >
          Item Details
        </h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            name=""
            id=""
            value={query}
            data-aos="fade-right"
            onChange={(e) => setQuery(e.target.value)}
            className="shadow-lg border text-sm border-orange-500 rounded-lg placeholder: w-[400px] p-2"
            placeholder="Search Item Here"
          />

          <div className="bottom-3">
            <FormControl variant="standard" style={{ width: "160px" }}>
              <InputLabel
                id="demo-simple-select-label"
                style={{ color: "orange" }}
              >
                Select One Option
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={option}
                label="select"
                onChange={handleChange}
              >
                <MenuItem value="Price Highest">Price(High To Low)</MenuItem>
                <hr />
                <MenuItem value="Price Lowest">Price(Low To High)</MenuItem>
                <hr />
                <MenuItem value="Qty Highest">Qty(High To Low)</MenuItem>
                <hr />
                <MenuItem value="Qty Lowest">Qty(Low To High)</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="w-full h-10 bottom-5 font-normal text-sm drop-shadow-2xl ">
        <Carousel
          showArrows={false}
          isRTL={false}
          pagination={false}
          itemsToShow={5}
          itemsToScroll={5}
        >
          {categories &&
            categories.length > 0 &&
            categories.map((category, index) => {
              return (
                <>
                  <div className="flex  flex-col gap-2 justify-center  items-center ">
                    <img
                      className="w-16 focus:outline-none focus:ring focus:ring-black  cursor-pointer h-16 rounded-full drop-shadow-2xl"
                      src={category.image}
                      alt=""
                    />
                    <button
                      onClick={() => setSelectedCategory(category.categoryname)}
                      className="focus:underline focus:underline-offset-4"
                    >
                      {category.categoryname}
                    </button>
                  </div>
                </>
              );
            })}
        </Carousel>
      </div>
      {filteredItems && filteredItems.length > 0 ? (
        <div className="overflow-y-auto h-[550px] p-3 mt-5">
          {filteredItems.map((item, index) => {
            return (
              <div
                className="grid grid-cols-12 mt-5 gap-4 p-2 rounded-2xl"
                style={{ boxShadow: "0 0 0.5em orange" }}
                // data-aos="fade-right"
              >
                <div
                  className="col-span-2 overflow-hidden rounded-lg relative"
                  // data-aos="fade-right"
                >
                  <img
                    src={item.image}
                    className="w-full h-[150px] rounded-lg cursor-pointer object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full">
                    <div className="relative z-20 p-2">
                      <p className="text-white text-lg font-bold ">Up To</p>
                      <p className="text-orange-500 text-md font-bold  ">
                        {item.upToOffer}% Off
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black"></div>
                  </div>
                </div>

                <div className="col-span-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      {" "}
                      {/* Flex container for one line */}
                      <span className="text-sm font-bold  text-orange-500 w-36">
                        Item Name:
                      </span>
                      <span className="font-bold  text-black text-sm w-full">
                        {item.itemname}
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      {" "}
                      {/* Flex container for one line */}
                      <span className="text-sm font-bold  text-orange-500 w-36">
                        {" "}
                        Description:
                      </span>
                      <span className="font-bold  text-black text-sm w-full">
                        {item.itemdescription}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {" "}
                      {/* Flex container for one line */}
                      <span className="text-sm font-bold  text-orange-500 w-36">
                        Item Quantity:
                      </span>
                      <span className="font-bold  text-black text-sm w-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {" "}
                      {/* Flex container for one line */}
                      <span className="text-sm font-bold  text-orange-500 w-36">
                        Item Price:
                      </span>
                      <span className="font-bold  text-black text-sm w-full">
                        &#8377;{item.price}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex flex-col gap-4 mt-6 items-center justify-center">
                    <p
                      className="text-3xl cursor-pointer text-blue-900 inline-block align-middle"
                      onClick={() => handleClickOpen(item)}
                    >
                      <MdEdit />
                    </p>
                    <p
                      className="text-3xl cursor-pointer text-red-800 inline-block align-middle"
                      onClick={() => handleDeleteItem(item)}
                    >
                      <MdDelete />
                    </p>
                  </div>
                </div>
                <Dialog
                  fullWidth
                  maxWidth="md"
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="draggable-dialog-title"
                >
                  <DialogTitle
                    style={{
                      cursor: "move",
                      textAlign: "center",
                      color: "white",
                      backgroundColor: "orange",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                    id="draggable-dialog-title"
                  >
                    EDIT ITEM DETAILS
                  </DialogTitle>
                  <DialogContent>
                    <div className="flex flex-row gap-6 mt-5">
                      <div className="row-span-6">
                        <DialogContentText>
                          <img
                            src={edititemdata.image}
                            className="w-[400px] h-[300px] rounded-lg cursor-pointer "
                            onClick={() => generateImage(edititemdata.itemname)}
                          />
                        </DialogContentText>
                      </div>

                      <div className="row-span-6">
                        <TextField
                          style={{ marginBottom: "1rem", fontWeight: "bold" }}
                          required
                          margin="dense"
                          id="name"
                          name="email"
                          label="Item Name"
                          type="text"
                          value={edititemdata.itemname}
                          onChange={(e) =>
                            setEditItem({
                              ...edititemdata,
                              itemname: e.target.value,
                            })
                          }
                          fullWidth
                          variant="standard"
                        />
                        <InputLabel htmlFor="description">
                          Item Description
                        </InputLabel>
                        <textarea
                          className="w-full h-56 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                          required
                          aria-label="Item Description"
                          id="description"
                          name="description"
                          placeholder="Item Description"
                          value={edititemdata.itemdescription}
                          onChange={(e) =>
                            setEditItem({
                              ...edititemdata,
                              itemdescription: e.target.value,
                            })
                          }
                          rows={3}
                        />

                        <TextField
                          style={{ marginBottom: "1rem" }}
                          required
                          margin="dense"
                          id="name"
                          name="email"
                          label="Item Quantity"
                          type="number"
                          value={edititemdata.quantity}
                          onChange={(e) =>
                            setEditItem({
                              ...edititemdata,
                              quantity: parseInt(e.target.value),
                            })
                          }
                          fullWidth
                          variant="standard"
                        />

                        <TextField
                          style={{ marginBottom: "1rem" }}
                          required
                          margin="dense"
                          id="name"
                          name="email"
                          label="Item Price"
                          type="number"
                          value={edititemdata.price}
                          onChange={(e) =>
                            setEditItem({
                              ...edititemdata,
                              price: parseInt(e.target.value),
                            })
                          }
                          fullWidth
                          variant="standard"
                        />

                        <TextField
                          style={{ marginBottom: "1rem" }}
                          required
                          margin="dense"
                          id="name"
                          name="email"
                          label="Item Offer"
                          type="number"
                          value={edititemdata.upToOffer}
                          onChange={(e) =>
                            setEditItem({
                              ...edititemdata,
                              upToOffer: parseInt(e.target.value),
                            })
                          }
                          fullWidth
                          variant="standard"
                        />
                      </div>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      autoFocus
                      style={{
                        border: "1px solid #FFA500",
                        color: "#FFA500",
                        marginRight: "10px",
                        borderRadius: "5px",
                        padding: "8px 16px",
                        transition: "background-color 0.3s, color 0.3s",
                      }}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#FFA500",
                        color: "#FFFFFF",
                        borderRadius: "5px",
                        padding: "8px 16px",
                        transition: "background-color 0.3s, color 0.3s",
                      }}
                      onClick={() => handleEditItem(edititemdata)}
                    >
                      Edit
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="m-auto ">
          <h1 className="text-center mt-48 text-2xl text-bold text-orange-600">
            Oops......There is no data of this category
          </h1>
        </div>
      )}
    </div>
  );
};

export default ItemList;
