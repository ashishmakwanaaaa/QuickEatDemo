"use client";

import { MdOutlineSell } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { PiBowlFoodBold } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Counter } from "../Admin/AdminDashboard";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { DataGrid, GridRowSelectionApi } from "@mui/x-data-grid";
import { PaymentType } from "@/lib/reducers/paymentSlice/paymentReducers";
import { payment } from "@/lib/reducers";
const AdminPage = () => {
  const [sales, setSales] = useState<PaymentType[]>([]);
  const [user, setUser] = useState([]);
  const [activeuser, setActiveUser] = useState([]);
  const [order, setOrder] = useState([]);
  const [items, setItems] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  /*  ++++++++++++++++++++++ */
  const [allCashPayment, setAllCashPayment] = useState<PaymentType[]>([]);
  const [allCardPayment, setAllCardPayment] = useState<PaymentType[]>([]);

  useEffect(() => {
    const cashPayments = sales.filter((item) => item.paymentMethod === "cash");
    setAllCashPayment(cashPayments);

    const cardPayment = sales.filter((item) => item.paymentMethod === "card");
    setAllCardPayment(cardPayment);
  }, [sales]);

  const totalSales =
    sales && sales.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  const usersAllPayments = useSelector(
    (state: payment) => state.payment.payments
  );

  const cardPaymentForUsers: { [userId: string]: number } =
    allCardPayment.reduce(
      (sumByUserid: { [userId: string]: number }, payment) => {
        const userId = payment.userId;
        const amount = parseFloat(payment.amount);
        sumByUserid[userId] = (sumByUserid[userId] || 0) + amount;
        return sumByUserid;
      },
      {}
    );
  const cashPaymentForUsers: { [userId: string]: number } =
    allCashPayment.reduce(
      (sumByUserid: { [userId: string]: number }, payment) => {
        const userId = payment.userId;
        const amount = parseFloat(payment.amount);
        console.log("userId amount", userId, amount, "\n");
        sumByUserid[userId] = (sumByUserid[userId] || 0) + amount;
        return sumByUserid;
      },
      {}
    );

  useEffect(() => {
    async function getAllUser() {
      try {
        const response = await fetch("http://localhost:5000/auth/getalluser");
        const data = await response.json();
        console.log(data);
        setUser(data.users);
        setActiveUser(data.activeusers);
      } catch (error) {
        console.log(user);
      }
    }
    getAllUser();
  }, []);

  useEffect(() => {
    async function getAllSales() {
      try {
        const response = await fetch(
          "http://localhost:5000/payment/getAllSales"
        );
        const data = await response.json();
        setSales(data.payments);
      } catch (error) {
        console.log(error);
      }
    }
    getAllSales();
  }, []);

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

  useEffect(() => {
    async function getAllOrder() {
      try {
        const response = await fetch("http://localhost:5000/items/getitems");
        const data = await response.json();
        console.log(data);
        setItems(data.items);
      } catch (error) {
        console.log(error);
      }
    }
    getAllOrder();
  }, []);
  const optionsforbarchart: any = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Chart.js Bar Chart" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 100,
          callback: function (value: any, index: any, values: any) {
            return value;
          },
        },
      },
    },
    elements: {
      bar: {
        backgroundColor: "rgba(255, 140, 0, 0.7)",
        borderColor: "rgba(255, 140, 0, 1)",
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: "bottom",
      },
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
  };
  const lables = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dataforbarchart = {
    labels: lables,
    datasets: [
      {
        label: "Monthly Amount",
        data: monthlyData.map(({ month, totalAmount }) => {
          const foundData = monthlyData.find((data) => data.month === month);
          return foundData ? foundData.totalAmount : "0";
        }),
        backgroundColor: "rgba(243, 111, 33, 1)",
        borderColor: "rgba(243, 111, 33, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(259, 145, 0, 0.7)",
        hoverBorderColor: "rgba(245,130,0,1)",
      },
    ],
  };

  useEffect(() => {
    const calculatedMonthlydata = () => {
      const monthlytotals = Object.fromEntries(
        lables.map((month, index) => [index + 1, 0])
      );
      sales &&
        sales.forEach((payment) => {
          const date = new Date(payment.Date);
          const month = date.getMonth() + 1;
          monthlytotals[month] += parseFloat(payment.amount);
          console.log(monthlytotals);
        });
      const monthlyData = Object.entries(monthlytotals).map(
        ([month, totalAmount]) => ({
          month: parseInt(month),
          totalAmount: totalAmount.toFixed(2),
        })
      );

      setMonthlyData(monthlyData);
    };
    calculatedMonthlydata();
  }, [sales]);

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
      width: 120,
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

  return (
    <>
      <div className="flex flex-col gap-2 font-[Poppins] cursor-pointer">
        <div className="flex flex-row gap-2 p-2 mt-[-35px]">
          <div
            data-aos="fade-down"
            className="flex flex-row w-full h-full items-center gap-4 p-2"
          >
            <div className="bg-orange-200 flex px-5 py-3 items-center  rounded-md ">
              <p className="text-orange-600 text-center m-auto text-md font-bold ">
                &#x20B9;
              </p>
            </div>
            <div className="flex flex-col gap-1 p-2 h-1/2 items-center w-1/2">
              {" "}
              {/* Added width here */}
              <p className="text-black text-md font-bold">
                &#x20B9;
                <Counter targetValue={totalSales.toFixed(2)} />
              </p>
              <p className="text-gray-400 text-sm font-normal">Total Sales</p>
            </div>
          </div>
          <div
            data-aos="fade-down"
            className="flex flex-row w-full h-full items-center gap-4 p-2"
          >
            <div className="bg-cyan-200 flex p-4 items-center rounded-md ">
              <p className="text-cyan-600 text-center m-auto text-md font-bold ">
                <MdOutlineSell />
              </p>
            </div>
            <div className="flex flex-col gap-1 p-2 h-1/2 items-center w-1/2">
              <p className="text-black text-md font-bold">
                <Counter
                  targetValue={order.length.toString().padStart(2, "0")}
                />
              </p>
              <p className="text-gray-400 text-sm font-normal">Total Order</p>
            </div>
          </div>
          <div
            data-aos="fade-down"
            className="flex flex-row w-full h-full items-center gap-4 p-2"
          >
            <div className="bg-green-200 flex p-4 items-center rounded-md ">
              <p className="text-green-600 text-md text-center m-auto font-bold ">
                <MdNotificationsActive />
              </p>
            </div>
            <div className="flex flex-col gap-1 p-2 h-1/2 items-center w-1/2">
              <p className="text-black text-md font-bold">
                <Counter
                  targetValue={activeuser.length.toString().padStart(2, "0")}
                />
              </p>
              <p className="text-gray-400 text-sm font-normal">Active User</p>
            </div>
          </div>
          <div
            data-aos="fade-down"
            className="flex flex-row w-full h-full items-center gap-4 p-2"
          >
            <div className="bg-red-200 flex p-4 items-center  rounded-md ">
              <p className="text-red-600 text-md m-auto text-center font-bold ">
                <FaUsers />
              </p>
            </div>
            <div className="flex flex-col gap-1 p-2 h-1/2 items-center w-1/2">
              <p className="text-black text-md font-bold">
                <Counter
                  targetValue={user.length.toString().padStart(2, "0")}
                />
              </p>
              <p className="text-gray-400 text-sm font-normal">Total Users</p>
            </div>
          </div>
          <div
            data-aos="fade-down"
            className="flex flex-row  w-full h-full items-center gap-4 p-2"
          >
            <div className="bg-green-500 flex p-4 items-cente rounded-md ">
              <p className="text-green-900 text-md m-auto text-center font-bold ">
                <PiBowlFoodBold />
              </p>
            </div>
            <div className="flex flex-col gap-1 p-2 h-1/2 items-center w-1/2">
              <p className="text-black text-md font-bold">
                <Counter
                  targetValue={items.length.toString().padStart(2, "0")}
                />
              </p>
              <p className="text-gray-400 text-sm font-normal">Food Items</p>
            </div>
          </div>
        </div>

        <div className="flex h-1/3 flex-row gap-10">
          <div
            style={{ boxShadow: "0 0 0.5em gray" }}
            data-aos="fade-right"
            className="flex flex-col items-center rounded-lg  justify-center h-[300px] w-[500px]"
          >
            <Bar data={dataforbarchart} options={optionsforbarchart} />
            <h1 className="text-center  capitalize text-orange-800 text-sm font-bold">
              Monthly Sales Record
            </h1>
          </div>
          <div
            data-aos="fade-left"
            style={{ boxShadow: "0 0 0.5em gray" }}
            className="flex flex-col gap-2 p-2 h-[300px] w-[500px] rounded-lg drop-shadow-2xl"
          >
            <div className="flex flex-row gap-2 text-sm">
              <div className="flex flex-row items-center gap-2">
                <div className="bg-orange-800 rounded-sm w-3 h-3"></div>
                <p className="text-sm text-orange-800">Cash Payments</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="bg-black rounded-sm w-3 h-3"></div>
                <p className="text-sm text-black">Card Payments</p>
              </div>
            </div>
            {user.map((userdata) => {
              console.log(userdata);

              const totalCashPayments = cashPaymentForUsers[userdata._id];

              const totalCardPayments = cardPaymentForUsers[userdata._id];
              const cashPaymentPercentage =
                (totalCashPayments / (totalCardPayments + totalCashPayments)) *
                100;
              return (
                <>
                  <div className="flex flex-col">
                    <p className="text-start text-sm font-bold">
                      {userdata.restaurantname}
                    </p>
                    <div className="w-full">
                      <div
                        className="bg-orange-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                        style={{ width: `${cashPaymentPercentage}%` }}
                      >
                        {Math.round(cashPaymentPercentage)}%
                      </div>
                      {/* Display remaining percentage as green segment (representing card payments) */}
                      <div
                        className="bg-black text-xs font-medium text-green-100 text-center p-0.5 leading-none rounded-full"
                        style={{ width: `${100 - cashPaymentPercentage}%` }}
                      >
                        {100 - Math.round(cashPaymentPercentage)}%
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            <h1 className="text-center mt-12  capitalize text-orange-800 text-sm font-bold">
              Sales Revenue
            </h1>
          </div>
        </div>

        <div
          data-aos="fade-right"
          className="flex flex-col gap-2 justify-start items-start"
        >
          <h1 className="text-start capitalize text-black text-md font-bold">
            Recently Orders
          </h1>
          <div className="w-[1100px] h-[300px]" data-aos="fade-right">
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
      </div>
    </>
  );
};

export default AdminPage;
