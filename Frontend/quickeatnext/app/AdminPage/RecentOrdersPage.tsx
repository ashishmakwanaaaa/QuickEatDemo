"use client";

import { DataGrid, GridColDef, GridRowSelectionApi } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface OrderItem {
  _id: string;
  Date: string;
  userId: {
      image: string;
      restaurantname: string;
      ownername: string;
      emailid: string;
  };
  customerfirstname: string;
  customerphoneno: string;
  totalAmount: number;
}

const RecentOrdersPage = () => {
  const [order, setOrder] = useState<OrderItem[]>([]);

  const columns:GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "orderid",
      headerName: "ORDER ID",
      width: 120,
    },
    {
      field: "date",
      headerName: "Date Of Order",
      width: 120,
    },
    {
      field: "profile",

      headerName: "Profile",
      width: 70,
      renderCell: (params) => {
        return (
          <>
            <img
              className="w-10 h-10 rounded-full"
              src={`http://localhost:5000/uploads/${params.row.profile}`}
              alt=""
            />
          </>
        );
      },
    },
    {
      field: "resname",
      headerName: "Restrurant ",
      width: 150,
    },
    {
      field: "ownername",
      headerName: "Owner",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
    {
      field: "customername",
      headerName: "Customer Name",
      width: 120,
    },
    {
      field: "phoneno",

      headerName: "Contact",
      width: 100,
    },
    {
      field: "amount",

      headerName: "Total Amount",
      cellClassName: "text-green-800 font-bold text-center capitalize",
      width: 60,
    },
  ];

  const rows = order.map((item, index) => ({
    id: index + 1,
    orderid: "OWNER" + item._id.slice(0, 5),
    date: item.Date.split("T")[0],
    profile: item.userId.image,
    resname: item.userId.restaurantname,
    ownername: item.userId.ownername,
    email: item.userId.emailid,
    customername: item.customerfirstname,
    phoneno: item.customerphoneno,
    amount: item.totalAmount,
  }));
  useEffect(() => {
    async function getAllOrder() {
      try {
        const response = await fetch(
          "http://localhost:5000/orders/getAllOrders"
        );
        const data = await response.json();
        console.log(data);
        setOrder(data.orders);
      } catch (error) {
        console.log(error);
      }
    }
    getAllOrder();
  }, []);
  return (
    <>
      <div
        data-aos="fade-right"
        className="flex flex-col w-full h-full gap-2 justify-start items-start"
      >
        <h1 className="text-start capitalize text-black text-md font-bold">
          Recently Orders
        </h1>
        <div className="w-[1100px] h-full" data-aos="fade-right">
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
    </>
  );
};

export default RecentOrdersPage;
