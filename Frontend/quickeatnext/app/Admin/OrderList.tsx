"use client";

import { DataGrid, GridRowSelectionApi } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { OrderDataType } from "./Orders";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LoginContext from "../LoginState/logincontext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const OrderListPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<OrderDataType[]>([]);
  const [specificorder, setSpecificOrder] = useState<OrderDataType>({});
  const [filteredRow, setFilteredRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const StateContext = useContext(LoginContext);

  console.log(StateContext);
  useEffect(() => {
    async function FetchAllPayment() {
      try {
        const response = await fetch(
          `http://localhost:5000/orders/getAllOrders/${StateContext.userid}`
        );
        const data = await response.json();
        console.log(data);
        setOrders(data.orders);
      } catch (error) {
        console.log(error);
      }
    }
    FetchAllPayment();
  }, []);
  useEffect(() => {
    if (!orders || orders.length === 0) {
      setRows([]);
      setData([]);
      return;
    }
    const rowsArray = orders.map((order, index) => ({
      id: index + 1,
      _id: order._id,
      Date: order.Date.split("T")[0],
      customername: order.customerfirstname + " " + order.customerlastname,
      customeremail: order.customeremailid,
      customerphoneno: order.customerphoneno,
      amount: order.totalAmount,
      invoice: "View Items",
    }));

    setRows(rowsArray);
    setData(rowsArray);
  }, [orders]);

  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null]
  >([null, null]);
  console.log("SelectDate" + selectedDates);
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null]) => {
    if (dates[0]) {
      dates[0] = dates[0].startOf("day");
    }
    if (dates[1]) {
      dates[1] = dates[1].endOf("day");
    }
    setSelectedDates(dates);
  };
  const handleClickOpen = async (row: any) => {
    setOpen(true);
    try {
      const response = await fetch(
        `http://localhost:5000/orders/getOneOrder/${row._id}`
      );
      const data = await response.json();
      console.log(data);
      setSpecificOrder(data.order);
    } catch (error) {
      console.log(error);
    }
    console.log(row);
  };
  console.log(specificorder);
  const handleClose = () => {
    setOpen(false);
  };
  const filterRowsByDate = () => {
    console.log(selectedDates);
    const [startDate, endDate] = selectedDates;

    const filteredData: OrderDataType[] = orders.filter((order) => {
      const paymentDate = dayjs(order.Date.split("T")[0]);
      return (
        paymentDate.isSame(startDate, "day") ||
        (paymentDate.isAfter(startDate, "day") &&
          paymentDate.isBefore(endDate, "day")) ||
        paymentDate.isSame(endDate, "day")
      );
    });

    setFilteredRows(filteredData);
  };
  const filteredRowsWithIds: OrderDataType[] = filteredRow.map(
    (order, index) => ({
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
  useEffect(() => {
    console.log("Pressed");
    console.log("filteredRowsWithIds: " + JSON.stringify(filteredRowsWithIds));
    setRows(filteredRowsWithIds);
  }, [filteredRow]);
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
      cellClassName: "text-red-800 font-bold  capitalize",
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

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-[Poppins] font-bold text-start">Order Details</h1>
        <div className="flex flex-row gap-2 w-1/2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              slotProps={{ textField: { size: "small" } }}
              value={selectedDates}
              onChange={handleDateRangeChange}
            />
          </LocalizationProvider>
          <button
            className="bg-orange-400 text-white w-10 h-10  rounded-md"
            onClick={filterRowsByDate}
          >
            <VisibilityIcon />
          </button>
          <button
            className="bg-red-500 text-white w-10 h-10  rounded-md"
            onClick={() => {
              setRows(data);
              setSelectedDates([null, null]);
            }}
          >
            <CancelIcon />
          </button>
        </div>
      </div>
      <div className="w-[1000px] h-[600px] mt-4 mx-auto">
        <DataGrid
          style={{ fontFamily: "Poppins" }}
          rows={rows}
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
          style={{ backgroundColor: "orange", color: "white", padding: "15px" }}
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
    </>
  );
};

export default OrderListPage;
