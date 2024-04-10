"use client";

import React, { useContext, useEffect, useState } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import "aos/dist/aos.css";
import AOS from "aos";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Swal from "sweetalert2";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { MdDelete } from "react-icons/md";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { TransitionProps } from "@mui/material/transitions";
import { Customer } from "@/app/Admin/CustomerList";
import { ItemType } from "@/app/Admin/ItemList";
import StateLogin from "../LoginState/logincontext";
import { useSelector, useDispatch } from "react-redux";
import { fetchItems } from "@/lib/actions/itemAction";
import { fetchCustomerById } from "@/lib/actions/customerAction";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface SelectedItemType {
  filter(arg0: (_: any, i: any) => boolean): unknown;
  reduce(
    arg0: (total: any, item: { totalPrice: any }) => number,
    arg1: number
  ): unknown;
  _id: string;
  itemname: string;
  itemdescription: string;
  price: number;
  qty: number;
  quantity: number;
  totalPrice: number;
  upToOffer: number;
  image: string;
}

export interface OrderDataType {
  _id: any;
  userId: string;
  customerID: string | undefined;
  customerfirstname: string;
  customerlastname: string;
  customeremailid: string;
  customerphoneno: number;
  selectedItem: SelectedItemType[];
  totalAmount: number | unknown | any;
  Date: Date;
}

const Orders = ({ id }: { id: string }) => {
  console.log(id);
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const [selectedItem, setSelectedItem] = useState<SelectedItemType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [open2, setOpen2] = useState<boolean>(false);
  const StateContext = useContext(StateLogin);
  const userId = StateContext.userid;
  const dispatch = useDispatch();
  const items: ItemType[] = useSelector((state) => state.item.items);
  const customer: Customer = useSelector(
    (state) => state.customer.specificcustomer
  );
  console.log(customer);
  const TotalAmount = selectedItem.reduce(
    (total: any, item: { totalPrice: any }) =>
      Number(total) + Number(item.totalPrice),
    0
  );

  useEffect(() => {
    dispatch(fetchCustomerById(id));
  }, [dispatch, userId]);

  const OrderData: OrderDataType = {
    userId,
    customerID: customer._id,
    customerfirstname: customer.firstname,
    customerlastname: customer.lastname,
    customeremailid: customer.emailid,
    customerphoneno: customer.phoneno,
    selectedItem: selectedItem,
    totalAmount: TotalAmount,
    Date: new Date(),
  };

  const CashData = {
    userId,
    customerID: OrderData.customerID,
    email: OrderData.customeremailid,
    cardHoldername:
      OrderData.customerfirstname + " " + OrderData.customerlastname,
    billingaddress: {
      street: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
    },
    amount: OrderData.totalAmount,
    paymentMethod: "cash",
  };

  console.log(typeof customer.userId);

  useEffect(() => {
    dispatch(fetchItems(userId));
  }, [dispatch, userId]);

  const handleRemoveItem = async (item: SelectedItemType) => {
    try {
      let updatedItems: SelectedItemType[] = [];
      if (item.qty > 1) {
        updatedItems = selectedItem.map((selected) => {
          if (selected.itemname === item.itemname) {
            const updatedQuantity = selected.qty - 1;
            const updatedPrice =
              selected.price - (selected.upToOffer * selected.price) / 100;
            const updatedTotalPrice = updatedQuantity * updatedPrice;
            return {
              ...selected,
              qty: updatedQuantity,
              quantity: item.quantity + 1,
              totalPrice: updatedTotalPrice,
            };
          }
          return selected;
        });

        setSelectedItem(updatedItems);

        // Call your API to decrease the actual quantity of the item by 1 on the backend
        const response = await fetch(
          "http://localhost:5000/items/updateQuantity",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantity: updatedItems.map((item) => item.quantity),
              itemname: updatedItems.map((item) => item.itemname),
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        dispatch(fetchItems(userId));
      } else {
        // If item quantity is 1, remove the item from the cart
        updatedItems = selectedItem.filter(
          (selected) => selected._id !== item._id
        );
        // Call your API to increase the actual quantity of the item by 1 on the backend
        setSelectedItem(updatedItems);
        const response = await fetch(
          "http://localhost:5000/items/updateQuantity",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantity: [item.quantity + 1],
              itemname: [item.itemname],
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        dispatch(fetchItems(userId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAddItem = async (item: ItemType) => {
    const existingItem = selectedItem.find(
      (selected) => selected.itemname === item.itemname
    );
    let updatedItems: SelectedItemType[] = [];
    if (existingItem) {
      updatedItems = selectedItem.map((selected) => {
        if (selected.itemname === item.itemname) {
          const updatedQuantity = selected.qty + 1;
          const updatedPrice = item.price - (item.upToOffer * item.price) / 100;
          const updatedTotalPrice = updatedQuantity * updatedPrice;
          return {
            ...selected,
            qty: updatedQuantity,
            quantity: item.quantity - 1,
            totalPrice: updatedTotalPrice,
          };
        }
        return selected;
      });
      setSelectedItem(updatedItems);
    } else {
      const updatedPrice = item.price - (item.upToOffer * item.price) / 100;
      updatedItems = [
        ...selectedItem,
        {
          ...item,
          qty: 1,
          quantity: item.quantity - 1,
          totalPrice: updatedPrice,
        },
      ];
      setSelectedItem(updatedItems);
    }
    console.log(updatedItems);
    try {
      const response = await fetch(
        "http://localhost:5000/items/updateQuantity",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: updatedItems.map((item) => item.quantity),
            itemname: updatedItems.map((item) => item.itemname),
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      dispatch(fetchItems(userId));
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(selectedItem);
  const CreateOrder = async () => {
    try {
      console.log(OrderData);
      const response = await fetch("http://localhost:5000/orders/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(OrderData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setOpen(false);
        await Swal.fire({
          title: "Order Created",
          icon: "success",
          timer: 3000,
        });
        // console.log("ashish")
        handleCheckout();
      } else {
        throw new Error(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to create order. Please try again later.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const CreateOrderForCash = async () => {
    setOpen(false);
    try {
      const response = await fetch("http://localhost:5000/orders/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(OrderData),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setOpen(false);
        await Swal.fire({
          title: "Order Created",
          icon: "success",
          timer: 3000,
        });
      } else {
        throw new Error(data.message || "Failed to create order");
      }
      setOpen2(true);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to create order. Please try again later.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.STRIPE_SECURE_KEY}`,
          },
          body: JSON.stringify(OrderData),
        }
      );
      const data = await response.json();
      console.log(response);
      console.log(data);
      if (response.ok) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Failed to create checkout session");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to initiate checkout. Please try again later.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const handleCashPayment = async () => {
    setOpen2(false);
    try {
      const response = await fetch(
        "http://localhost:5000/payment/createPayment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(CashData),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        Swal.fire({
          title: "Payment With Cash Sucessfully",
          icon: "success",
          timer: 1000,
        });
      }
      setSelectedItem([]);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to initiate checkout. Please try again later.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  return (
    <>
      <div className="font-[Poppins]  p-2 flex flex-col gap-4 w-full h-full">
        <div className="flex flex-row gap-3 items-center justify-between rounded-xl p-4  border-b-2 border-gray-500">
          <p className="text-lg  text-black " data-aos="fade-down">
            <span className="text-black font-bold ">Customer Name</span>:{" "}
            {customer.firstname} {customer.lastname}
          </p>
          <p data-aos="fade-down">
            <Badge badgeContent={selectedItem.length} color="primary">
              View Cart{" "}
              <ShoppingCartIcon
                className="cursor-pointer text-orange-500"
                onClick={() => setOpen(true)}
              />
            </Badge>
          </p>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {items &&
            items.length > 0 &&
            items.map((item, index) => (
              <div
                key={index}
                className="relative flex flex-col gap-2 items-center drop-shadow-2xl rounded-2xl p-2 h-full"
                data-aos="fade-right"
                style={{ boxShadow: "0 0 0.5em gray" }}
              >
                <div
                  className="rounded-2xl  overflow-hidden drop-shadow-2xl"
                  style={{ width: "100%", height: "150px", overflow: "hidden" }}
                >
                  <img
                    src={item.image}
                    className="w-full h-[150px] rounded-lg cursor-pointer object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full">
                    <div className="relative z-20 p-2">
                      <p className="text-white text-lg font-bold ">Up To</p>
                      <p className="text-orange-500 text-lg font-bold  ">
                        {item.upToOffer}% Off
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-black"></div>
                  </div>
                </div>
                <button
                  disabled={item.quantity === 0}
                  className={`bg-white text-orange-500  p-2 w-[110px] mx-auto text-sm z-10 mt-[-20px] mb-2 font-bold 
    ${item.quantity === 0 ? "opacity-50 cursor-not-allowed" : "rounded-md"}`}
                  onClick={() => handleAddItem(item)}
                >
                  Add To Cart
                </button>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row justify-start items-start gap-2">
                    <span className="text-sm  font-bold  text-orange-500">
                      Name:
                    </span>
                    <span className="font-bold  text-black text-sm">
                      {item.itemname}
                    </span>
                  </div>
                  <div className="flex flex-row justify-start items-start gap-2">
                    <span className="text-sm font-bold  text-orange-500">
                      Quantity:
                    </span>
                    <span className="font-bold  text-black text-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-row justify-start items-start gap-8">
                    <span className="text-sm font-bold  text-orange-500">
                      Price:
                    </span>
                    <span className="font-bold  text-black text-sm">
                      &#8377;{item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Dialog
        maxWidth="lg"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        style={{ borderRadius: "2rem", padding: "10px" }}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="flex flex-col gap-3">
          <DialogTitle
            style={{
              cursor: "move",
              textAlign: "center",
              fontSize: "30px",
              color: "white",
              backgroundColor: "orange",
              fontWeight: "bold",
            }}
          >
            {"Your Delicious Selections"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {selectedItem.length > 0 ? (
                selectedItem.map((selected, index) => {
                  return (
                    <div className="  flex flex-col gap-4">
                      <div className="flex flex-row gap-3 mt-5 border-2 p-2 border-orange-200 rounded-2xl">
                        <div
                          className="overflow-hidden rounded-lg"
                          data-aos="fade-right"
                        >
                          <img
                            src={selected.image}
                            className="w-[150px] h-[100px] rounded-lg cursor-pointer object-cover"
                          />
                          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black"></div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-4">
                            <span className="font-bold  text-black text-2xl w-full">
                              {selected.itemname}
                            </span>
                          </div>
                          <div className="flex items-center ">
                            <span className="text-sm font-bold text-orange-500 w-20">
                              Qty:
                            </span>
                            <div className="flex flex-row items-center gap-2 justify-start">
                              <button
                                onClick={() => handleAddItem(selected)}
                                className="border border-orange-600 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white transform duration-300"
                              >
                                <AddIcon />
                              </button>
                              <span className="font-bold text-sm w-full bg-orange-600 text-white px-2 py-1 rounded-md">
                                {selected.qty}
                              </span>
                              <button
                                onClick={() => handleRemoveItem(selected)}
                                className=" border border-orange-600 text-orange-600 rounded-md hover:bg-orange-600 hover:text-white transform duration-300"
                              >
                                <RemoveIcon />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold  text-orange-500 w-36">
                              Price:
                            </span>
                            <span className="font-bold  text-black text-sm w-full">
                              &#8377;{selected.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-center-items-center">
                          <p
                            className="text-3xl cursor-pointer text-red-800 inline-block align-middle"
                            onClick={() => handleRemoveItem(selected, index)}
                          >
                            <MdDelete />
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col gap-3 items-center">
                  <h1 className="text-orange-800 font-bold text-3xl text-center ">
                    Your Cart Is Empty
                  </h1>
                  <img
                    className="w-1/2 mx-auto h-1/2"
                    src="https://cdn.dribbble.com/users/5107895/screenshots/14532312/media/a7e6c2e9333d0989e3a54c95dd8321d7.gif"
                    alt=""
                  />
                </div>
              )}
            </DialogContentText>
            {selectedItem.length > 0 && (
              <div className="flex items-center gap-4 mt-5 text-center">
                <span className="text-2xl font-bold  text-orange-500 w-96">
                  Total Amount:
                </span>
                <span className="font-bold  text-black text-2xl w-full">
                  &#8377;{TotalAmount}
                </span>
              </div>
            )}
          </DialogContent>
          <div className="flex flex-row gap-10 items-center justify-between p-5">
            <DialogActions>
              <Button
                onClick={() => setOpen(false)}
                style={{
                  backgroundColor: "black",
                  color: "#FFFFFF",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                Go Back
              </Button>
            </DialogActions>
            <DialogActions>
              <Button
                style={{
                  border: "1px solid #FFA500",
                  color: "#FFA500",
                  marginRight: "10px",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  transition: "background-color 0.3s, color 0.3s",
                }}
                onClick={CreateOrderForCash}
              >
                PAY WITH CASH
              </Button>
              <Button
                onClick={CreateOrder}
                style={{
                  backgroundColor: "#FFA500",
                  color: "#FFFFFF",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  transition: "background-color 0.3s, color 0.3s",
                }}
              >
                PAY ONLINE
              </Button>
            </DialogActions>
          </div>
        </div>
      </Dialog>
      <Dialog
        style={{ borderRadius: "20px" }}
        open={open2}
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
          },
        }}
      >
        <DialogTitle
          style={{
            textAlign: "center",

            fontSize: "20px",
            color: "white",
            fontWeight: "bold",
            backgroundColor: "orange",
          }}
        >
          PAYMENT HERE
        </DialogTitle>
        <DialogContent
          className="mt-4"
          style={{ height: "600px", width: "600px", overflowY: "auto" }}
        >
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Customer Email ID"
            value={OrderData.customeremailid}
            aria-readonly
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Customer Name"
            type="text"
            aria-readonly
            value={
              OrderData.customerfirstname + " " + OrderData.customerlastname
            }
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Street"
            type="text"
            aria-readonly
            value={customer.address}
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="City"
            type="text"
            aria-readonly
            value={customer.city}
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="State"
            type="text"
            aria-readonly
            value={customer.state}
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Pincode"
            type="text"
            aria-readonly
            value={customer.pincode}
            fullWidth
            variant="standard"
          />
          <TextField
            style={{ marginBottom: "1rem" }}
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Total Amount"
            type="text"
            aria-readonly
            value={OrderData.totalAmount}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpen2(false)}
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
            onClick={handleCashPayment}
            style={{
              backgroundColor: "#FFA500",
              color: "#FFFFFF",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            PAY NOW
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Orders;
