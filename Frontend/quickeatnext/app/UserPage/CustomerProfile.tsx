"use client";

import { useContext, useEffect, useState } from "react";
import { Customer } from "./CustomerList";
import { OrderDataType } from "./Orders";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { DataGrid } from "@mui/x-data-grid";
import { Counter } from "./UserDashboard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerById } from "@/lib/actions/customerAction";
import { initialStateTypeForCustomer } from "@/lib/reducers/customerSlice/customerReducers";
import { fetchSpecificOrder } from "@/lib/actions/orderAction";
import { customer, order } from "@/lib/reducers";
import { useRouter } from "next/navigation";

const CustomerProfile = ({ id }: { id: string }) => {
  const [customerorder, setCustomerOrder] = useState<OrderDataType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const specificorder = useSelector((state: order) => state.order.orders);
  const customer: Customer = useSelector(
    (state: customer) => state.customer.specificcustomer
  );
  useEffect(() => {
    setLoading(true);
    dispatch(fetchCustomerById(id) as any);
    setTimeout(() => setLoading(false), 2000);
  }, [dispatch, id]);

  useEffect(() => {
    async function CustomerOrderFetch(id: string) {
      try {
        const response = await fetch(
          `http://localhost:5000/orders/customerorder/${id}`
        );
        const data = await response.json();
        console.log(data);
        setCustomerOrder(data.order);
      } catch (error) {
        console.log(error);
      }
    }
    CustomerOrderFetch(id);
  }, []);
  const amountmaparray = customerorder.map((order) => {
    return order.totalAmount;
  });
  const sumoftotalAmount = amountmaparray.reduce(
    (acc, sum) => parseFloat(acc + sum),
    0
  );
  console.log(sumoftotalAmount);
  const handleClickOpen = async (row: any) => {
    setOpen(true);
    dispatch(fetchSpecificOrder(row._id) as any);

    console.log(row);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const columns: {
    field: string;
    // headerClassName: string;
    headerName: string;
    width: number;
    cellClassName?: string;
    renderCell?: any;
  }[] = [
    {
      field: "id",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "ID",
      width: 90,
    },
    {
      field: "Date",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Date Of Order",
      width: 170,
    },
    {
      field: "customername",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Customer Name",
      width: 150,
    },
    {
      field: "customeremail",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Email",
      width: 220,
    },
    {
      field: "customerphoneno",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Contact No",
      cellClassName: "text-green-800 font-bold text-center capitalize",
      width: 120,
    },
    {
      field: "amount",
      // headerClassName: "bg-black text-white font-bold",
      headerName: "Total Amount",
      width: 120,
    },
    {
      field: "items",
      // headerClassName: "bg-black text-white font-bold",
      headerName: " Order Items",
      width: 120,
      renderCell: (params: { row: object }) => (
        <Button onClick={() => handleClickOpen(params.row)}>View Items</Button>
      ),
    },
  ];
  const rowsArray = customerorder.map(
    (order: OrderDataType, index: number) => ({
      id: index + 1,
      _id: order._id,
      Date: order.Date.split("T")[0],
      customername: order.customerfirstname + " " + order.customerlastname,
      customeremail: order.customeremailid,
      customerphoneno: order.customerphoneno,
      amount: order.totalAmount,
      invoice: "View Items",
    })
  );
  console.log(id);
  return (
    <>
      <div className="flex flex-col gap-3">
        <h1 className="flex items-center gap-3">
          <div
            onClick={() => router.push("/customerlist")}
            className=" bg-stone-800 rounded-full w-8 h-8 flex items-center p-2 cursor-pointer justify-center text-white"
          >
            <KeyboardBackspaceIcon />
          </div>
          Customer Profile
        </h1>
        {loading ? (
          <div className="flex border flex-row gap-5 border-gray-400 rounded-lg w-full h-full p-4 mt-2">
            <div className="w-1/3 text-center flex flex-col items-center gap-3">
              <div className="animate-pulse bg-gray-300 rounded-full w-48 h-48"></div>
              <div className="animate-pulse bg-gray-300 rounded-lg w-48 h-6"></div>
              <div className="animate-pulse bg-gray-300 rounded-lg w-48 h-12"></div>
            </div>
            <div className="flex w-full p-2 h-full border-gray-400 rounded-lg flex-col gap-4 justify-start items-start">
              <div className="flex flex-row gap-3 w-full">
                <div className="animate-pulse bg-gray-300 rounded-lg w-full h-10"></div>
                <div className="animate-pulse bg-gray-300 rounded-lg w-full h-10"></div>
              </div>
              <div className="animate-pulse bg-gray-300 rounded-lg w-full h-10"></div>
              <div className="animate-pulse bg-gray-300 rounded-lg w-full h-10"></div>
              <div className="animate-pulse bg-gray-300 rounded-lg w-full h-10"></div>
              <div className="flex flex-row gap-8 w-full">
                <div className="animate-pulse bg-gray-300 rounded-lg w-full h-10"></div>
                <div className="animate-pulse bg-gray-300 rounded-lg w-full h-10"></div>
                <div className="animate-pulse bg-gray-300 rounded-lg w-full h-10"></div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{ boxShadow: "0 0  1em gray" }}
            className="flex border flex-row  gap-5 border-gray-400  rounded-lg w-full h-full p-4 mt-2 "
          >
            <div className="w-1/3 text-center flex flex-col items-center gap-3">
              <p className="bg-stone-800 text-white rounded-full w-48 h-48 flex items-center justify-center text-[80px] text-center">
                {customer.firstname ? customer.firstname[0].toUpperCase() : ""}
                {customer.lastname ? customer.lastname[0].toUpperCase() : ""}
              </p>
              <p className="text-center text-sm text-gray-500">
                Customer's Amount
              </p>
              <p className="text-[40px] text-center">
                &#x20B9; <Counter targetValue={sumoftotalAmount} />
              </p>
            </div>
            <div className="flex w-full p-2 h-full  border-gray-400 rounded-lg flex-col gap-4 justify-start items-start">
              <div className="flex flex-row gap-3 w-full">
                <p
                  style={{ boxShadow: "0 0  1em gray" }}
                  className="text-black text-sm flex font-normal gap-2 border border-gray-400 rounded-lg p-2 drop-shadow-2xl w-full"
                >
                  <div className="flex gap-10 flex-row justify-start">
                    <p className=" text-black ">Customer Firstname:</p>
                    {customer.firstname} &nbsp;
                  </div>
                </p>
                <p
                  style={{ boxShadow: "0 0  1em gray" }}
                  className="text-black text-sm flex font-normal gap-2  border border-gray-400 rounded-lg p-2 drop-shadow-2xl w-full"
                >
                  <div className="flex gap-10 flex-row justify-start">
                    <p className=" text-black ">Customer Lastname:</p>
                    {customer.lastname} &nbsp;
                  </div>
                </p>
              </div>
              <p
                style={{ boxShadow: "0 0  1em gray" }}
                className="text-black text-sm flex font-normal gap-2  border border-gray-400 rounded-lg p-2 drop-shadow-2xl  w-full"
              >
                <div className="flex gap-14 flex-row justify-start">
                  <p className=" text-black ">Customer EmailID:</p>
                  {customer.emailid} &nbsp;
                </div>
              </p>
              <p
                style={{ boxShadow: "0 0  1em gray" }}
                className="text-black text-sm flex font-normal gap-2  border border-gray-400 rounded-lg p-2 drop-shadow-2xl  w-full"
              >
                <div className="flex gap-6 flex-row justify-start">
                  <p className=" text-black ">Customer Contact NO:</p>
                  {customer.phoneno} &nbsp;
                </div>
              </p>
              <p
                style={{ boxShadow: "0 0  1em gray" }}
                className="text-black text-sm flex font-normal gap-2 border border-gray-400 rounded-lg p-2 drop-shadow-2xl 0 w-full"
              >
                <div className="flex gap-12 flex-row justify-start">
                  <p className=" text-black ">Customer Address:</p>
                  {customer.address} &nbsp;
                </div>
              </p>
              <div className="flex flex-row gap-8 w-ful">
                <p
                  style={{ boxShadow: "0 0  1em gray" }}
                  className="text-black text-sm flex font-normal gap-2 border border-gray-400 rounded-lg p-2 drop-shadow-2xl w-full"
                >
                  <div className="flex gap-20 flex-row justify-start">
                    <p className=" text-black ">State:</p>
                    {customer.state} &nbsp;
                  </div>
                </p>
                <p
                  style={{ boxShadow: "0 0  1em gray" }}
                  className="text-black text-sm flex font-normal gap-2 border border-gray-400 rounded-lg p-2 drop-shadow-2xl w-full"
                >
                  <div className="flex gap-20 flex-row justify-start">
                    <p className=" text-black ">City:</p>
                    {customer.city} &nbsp;
                  </div>
                </p>
                <p
                  style={{ boxShadow: "0 0  1em gray" }}
                  className="text-black text-sm flex font-normal gap-2 border border-gray-400 rounded-lg p-2 drop-shadow-2xl w-full"
                >
                  <div className="flex gap-20 flex-row justify-start">
                    <p className=" text-black ">Pincode:</p>
                    {customer.pincode} &nbsp;
                  </div>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="w-[1000px] h-[300px] mt-4 mx-auto">
          {loading ? (
            <div className="animate-pulse bg-gray-300 rounded-lg w-full h-full"></div>
          ) : (
            <DataGrid
              style={{ fontFamily: "Poppins" }}
              rows={rowsArray}
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
          )}
        </div>
        <Dialog
          style={{ width: "100%", height: "100%" }}
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          }}
        >
          <DialogTitle
            style={{
              backgroundColor: "orange",
              color: "white",
              padding: "15px",
            }}
          >
            View Items
          </DialogTitle>
          <DialogContent>
            <div className="flex flex-row gap-12">
              {specificorder &&
                specificorder.selectedItem &&
                specificorder.selectedItem.map((order) => {
                  return (
                    <>
                      <div className="flex flex-col items-center gap-2">
                        <img
                          className="w-32 h-32 rounded-3xl p-2"
                          src={order.image}
                          alt=""
                        />
                        <p className="text-black font-bold text-lg">
                          {order.itemname}
                        </p>
                        <p className="text-black font-bold text-lg">
                          Qty: {order.qty}
                        </p>
                        <p className="text-black font-bold text-lg">
                          Price: {order.price}
                        </p>
                        <p className="text-black font-bold text-lg">
                          Offer: {order.upToOffer}
                        </p>
                        <p className="text-black font-bold text-lg">
                          FinalPrice: {order.totalPrice}
                        </p>
                      </div>
                    </>
                  );
                })}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              style={{
                border: "1px solid #FFA500",
                color: "white",
                backgroundColor: "#FFA500",
                marginRight: "10px",
                borderRadius: "5px",
                padding: "8px 16px",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default CustomerProfile;
