"use client";

import { DataGrid, GridRowParams, GridRowSelectionApi } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { OrderDataType } from "./Orders";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LoginContext from "../LoginState/logincontext";
import jsPDF from "jspdf";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";
import Swal from "sweetalert2";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "@/lib/actions/paymentAction";
import {
  PaymentType,
  initialStateTypeForPayment,
} from "@/lib/reducers/paymentSlice/paymentReducers";
import { payment } from "@/lib/reducers";
import { Dispatch } from "redux";

interface CustomRenderCellParams extends GridRowParams {
  row: PaymentType;
}

const PaymentList = () => {
  const [rows, setRows] = useState<PaymentType[]>([]);
  const [data, setData] = useState<PaymentType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [order, setOrder] = useState<OrderDataType[]>([]);
  const [filteredRow, setFilteredRows] = useState<PaymentType[]>([]);
  const [invoiceid, setInvoiceId] = useState<number>(0);
  const StateContext = useContext(LoginContext);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch<Dispatch>();
  const payments: PaymentType[] = useSelector(
    (state: payment) => state.payment.payments
  );
  const [selectedDates, setSelectedDates] = useState<
    [Dayjs | null, Dayjs | null]
  >([null, null]);
  const userId = user._id;
  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null]) => {
    if (dates[0]) {
      dates[0] = dates[0].startOf("day");
    }
    if (dates[1]) {
      dates[1] = dates[1].endOf("day");
    }
    setSelectedDates(dates);
  };
  console.log("<<<order", order);
  const filterRowsByDate = () => {
    console.log(selectedDates);
    const [startDate, endDate] = selectedDates;

    const filteredData: PaymentType[] = payments.filter((payment) => {
      const paymentDate = dayjs(payment.Date.split("T")[0]);
      return (
        paymentDate.isSame(startDate, "day") ||
        (paymentDate.isAfter(startDate, "day") &&
          paymentDate.isBefore(endDate, "day")) ||
        paymentDate.isSame(endDate, "day")
      );
    });

    setFilteredRows(filteredData);
  };
  useEffect(() => {
    console.log("Pressed");
    console.log("filteredRowsWithIds: " + JSON.stringify(filteredRowsWithIds));
    setRows(filteredRowsWithIds);
  }, [filteredRow]);

  const filteredRowsWithIds: PaymentType[] = filteredRow.map(
    (payment, index) =>
      ({
        id: index + 1,
        Date: payment.Date.split("T")[0],
        cardHoldername: payment.cardHoldername,
        email: payment.email,
        amount: payment.amount,
        billingaddress: payment?.billingaddress?.city,
        paymentMethod: payment.paymentMethod,
        invoice: "Invoice",
      } as PaymentType)
  );

  console.log(StateContext);
  let currentDate = new Date().toJSON().slice(0, 10);
  useEffect(() => {
    dispatch(fetchPayments(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    if (!payments || payments.length === 0) {
      setRows([]);
      setData([]);
      return;
    }
    const rowsArray: PaymentType[] = payments.map(
      (payment, index) =>
        ({
          id: index + 1,
          Date: payment.Date.split("T")[0],
          cardHoldername: payment.cardHoldername,
          email: payment.email,
          amount: payment.amount,
          billingaddress: payment?.billingaddress?.city,
          paymentMethod: payment.paymentMethod,
          invoice: "Invoice",
        } as unknown as PaymentType)
    );

    setRows(rowsArray);
    setData(rowsArray);
  }, [payments]);
  console.log(payments);
  const handleClickOpen = async (row: any) => {
    setOpen(true);
    setInvoiceId(row.id);
    try {
      const response = await fetch(
        `http://localhost:5000/orders/getOrder/${row.Date}/${row.email}`
      );
      const data = await response.json();
      setOrder(data.orders);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    console.log(row);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleGenerateFile = async () => {
    try {
      setOpen(false);
      const doc = new jsPDF("p", "pt", "a6", true);
      const dialogContent = document.getElementById("invoice-dialog-content");
      if (dialogContent) {
        const HtmlContent = dialogContent.innerHTML;
        doc.html(HtmlContent, {
          callback: () => {
            doc.save(`/invoicebilling/invoice_${invoiceid}.pdf`);
            Swal.fire({
              icon: "success",
              title: "PDF Downloaded",
              text: "Invoice has been successfully downloaded!",
              timer: 1000,
            });
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(payments);
  const columns: {
    field: string;
    headerName: string;
    width: number;
    cellClassName?: string;
    renderCell?: (params: GridRowSelectionApi) => Element;
  }[] = [
    {
      field: "id",

      headerName: "ID",
      width: 90,
    },
    {
      field: "Date",

      headerName: "Date Of Payment",
      width: 170,
    },
    {
      field: "cardHoldername",

      headerName: "Customer Name",
      width: 150,
    },
    {
      field: "email",

      headerName: "Email",
      width: 240,
    },
    {
      field: "amount",

      headerName: "Total Amount",
      width: 120,
    },
    {
      field: "billingaddress",

      headerName: "City",
      width: 100,
    },
    {
      field: "paymentMethod",

      headerName: "Payment Method",
      cellClassName: "text-green-800 font-bold text-center capitalize",
      width: 120,
    },
    {
      field: "invoice",

      headerName: "Generate Invoice",
      width: 120,
      renderCell: (params: CustomRenderCellParams) => (
        <Button
          onClick={() => handleClickOpen(params.row)}
          style={{ color: "red", padding: "2px" }}
        >
          Invoice
        </Button>
      ),
    },
  ];

  // console.log("Hello" + JSON.stringify(rowsArray));
  // setRows(rowsArray);
  return (
    <>
      <div className="flex justify-between w-[68rem]">
        <h1 className="font-[Poppins] font-bold text-start ml-8">
          Payment Details
        </h1>
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

      <div className="w-[950px] h-4/5 mt-4 mx-auto">
        <div className="w-[980px] h-[580px] mt-4 mx-auto">
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
      </div>
      <Dialog
        maxWidth="xl"
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
        <DialogTitle>Generate Invoice</DialogTitle>
        <DialogContent>
          {order?.map((item, index) => {
            return (
              <>
                <div
                  id="invoice-dialog-content"
                  className="flex flex-col w-full gap-3 justify-center mb-5"
                >
                  <div className="w-full h-4 rounded-lg bg-orange-600"></div>
                  <div className="flex gap-96 justify-between ">
                    <div className="flex items-center">
                      <span className="text-black  font-bold text-3xl">
                        Restrurant Name :
                        <span className="text-orange-500 shadow-orange text-3xl">
                          {StateContext.restaurantname}
                        </span>
                      </span>
                    </div>
                    <div className="text-3xl text-orange-600 font-bold">
                      INVOICE
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-start mt-10">
                    <p className="text-black text-md flex gap-2">
                      <p className="font-bold text-black ">Customer Name:</p>
                      {item.customerfirstname} &nbsp; {item.customerlastname}
                    </p>
                    <hr className="border  border-black w-full" />
                    <p className="text-black text-md flex gap-2">
                      <p className="font-bold text-black">Customer Email:</p>
                      {item.customeremailid} &nbsp;{" "}
                    </p>
                    <hr className="border border-black w-full" />
                    <p className="text-black text-md flex gap-2">
                      <p className="font-bold text-black">Customer Phone:</p>
                      {item.customerphoneno} &nbsp;{" "}
                    </p>
                    <hr className="border border-black w-full" />
                    <p className="text-black text-md flex gap-2">
                      <p className="font-bold text-black">Invoice Date: </p>
                      {currentDate}
                    </p>
                    <hr className="border border-black w-full" />
                    <p className="text-black text-md flex gap-2">
                      <p className="font-bold text-black">Invoice ID: </p>#
                      {invoiceid}
                    </p>
                    <hr className="border border-black w-full" />
                  </div>
                  <table className="border-collapse border mt-14">
                    <thead>
                      <tr className="bg-stone-800 text-white rounded-lg">
                        <th className="px-4 py-2">Item Name</th>
                        <th className="px-4 py-2">Qty</th>
                        <th className="px-4 py-2">Price</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {item.selectedItem.map((key, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{key.itemname}</td>
                          <td className="px-4 py-2">{key.qty}</td>
                          <td className="px-4 py-2">{key.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex gap-96 justify-between mt-10">
                    <div className="flex items-center">
                      <span className="text-black  font-bold text-3xl">
                        Invoice Total :
                      </span>
                    </div>
                    <div className="text-3xl text-orange-600 font-bold">
                      &#8377; {item.totalAmount}
                    </div>
                  </div>
                  <div className="w-full h-4 rounded-lg bg-orange-600 mt-10"></div>
                </div>
              </>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              backgroundColor: "#FFA500",
              color: "#FFFFFF",
              borderRadius: "5px",
              padding: "8px 16px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onClick={handleGenerateFile}
          >
            Download Invoice <CloudDownloadIcon />
          </Button>
          <Button
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentList;
