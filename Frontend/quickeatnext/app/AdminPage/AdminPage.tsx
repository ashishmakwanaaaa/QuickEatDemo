"use client";

import { MdOutlineSell } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { PiBowlFoodBold } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridRowSelectionApi } from "@mui/x-data-grid";
import { PaymentType } from "../../lib/reducers/paymentSlice/paymentReducers";
import { payment, user } from "../../lib/reducers";
import { fetchUsers } from "../../lib/actions/userAction";
import ApexCharts from "apexcharts";
import { User } from "../../lib/reducers/userSlice/UserReducers";
import { OrderDataType } from "../UserPage/Orders";
import { useAppDispatch } from "../../lib/store";
import { Counter } from "../components/Counter";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

interface monthlyDataType {
  month: number;
  totalAmount: string;
}

const AdminPage = () => {
  const [sales, setSales] = useState<PaymentType[]>([]);
  const [order, setOrder] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [monthlyData, setMonthlyData] = useState<monthlyDataType[]>([]);
  /*  ++++++++++++++++++++++ */
  const dispatch = useAppDispatch();
  const user = useSelector((state: user) => state.user.users);
  const activeuser = useSelector((state: user) => state.user.activeusers);
  console.log(user, activeuser);
  const [allCashPayment, setAllCashPayment] = useState<PaymentType[]>([]);
  const [allCardPayment, setAllCardPayment] = useState<PaymentType[]>([]);

  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

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

  const cardPaymentForUsers: {
    [userId: string]: number;
  } = allCardPayment.reduce(
    (sumByUserid: { [userId: string]: number }, payment) => {
      const userId = payment.userId;
      const amount = parseFloat(payment.amount);
      sumByUserid[userId] = (sumByUserid[userId] || 0) + amount;
      return sumByUserid;
    },
    {}
  );
  const cashPaymentForUsers: {
    [userId: string]: number;
  } = allCashPayment.reduce(
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
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    async function getAllSales() {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/payment/getAllSales"
        );
        const data = await response.json();
        setSales(data.payments);
        setTimeout(() => setLoading(false), 2000);
      } catch (error) {
        console.log(error);
      }
    }
    getAllSales();
  }, []);

  useEffect(() => {
    async function getAllOrder() {
      try {
        // setLoading(true);
        const response = await fetch(
          "http://localhost:5000/orders/getAllOrders"
        );
        const data = await response.json();
        console.log(data);
        setOrder(data.orders);
        // setTimeout(() => setLoading(false), 2000);
      } catch (error) {
        console.log(error);
      }
    }
    getAllOrder();
  }, []);

  useEffect(() => {
    async function getAllItems() {
      try {
        const response = await fetch("http://localhost:5000/items/getitems", {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        setItems(data.items);
      } catch (error) {
        console.log(error);
      }
    }
    getAllItems();
  }, []);

  useEffect(() => {
    const ordersByDays: { [key: string]: number } = order.reduce(
      (acc: { [key: string]: number }, cur: OrderDataType) => {
        const orderDate = new Date(cur.Date).toISOString().split("T");
        const day = orderDate[0].split("-")[2];
        const month = orderDate[0].split("-")[1];
        const key = `${day}-${month}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {}
    );
    // console.log(ordersByDays);
    const sortedDays = Object.keys(ordersByDays).sort((a, b) => {
      console.log(a, b);
      const [aDay, aMonth] = a.split("-").map(Number); // Split combined key into month and day
      const [bDay, bMonth] = b.split("-").map(Number);
      if (aMonth !== bMonth) {
        return aMonth - bMonth; // Then sort by day within the same month
      }
      return aDay - bDay; // Sort by month first
    });
    // console.log(sortedDays)
    const data = sortedDays.map((day) => ordersByDays[day]);
    var options = {
      series: [
        {
          name: "Orders",
          data: data,
        },
      ],
      chart: {
        height: 250,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        color: ["#ff7f0e"],
      },
      xaxis: {
        categories: sortedDays.map((day) => {
          const [month, dateStr] = day.split("-");
          const date = parseInt(dateStr, 10);
          return `${month}th ${lables[date - 1]}`; // Adjust month index to start from 1
        }),
      },
      tooltip: {
        x: {
          format: "dd/MM",
        },
      },
    };
    const chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }, [order]);
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
          callback: function(value: any, index: any, values: any) {
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
  console.log(monthlyData);
  return (
    <>
      <div className="flex flex-col gap-2 font-[Poppins] cursor-pointer mr-10 mt-[-10px]">
        <div className="flex flex-row gap-4 p-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex flex-col w-full h-full items-center p-1 dark:bg-gray-800 dark:text-gray-300 rounded-2xl"
                style={{ boxShadow: "0 0 0.2em gray" }}
              >
                <div className="bg-gray-300 rounded-md w-10 h-10 m-2"></div>
                <div className="bg-gray-300 rounded-lg w-full h-6 mt-2"></div>
                <div className="bg-gray-300 rounded-lg w-full h-4 mt-1"></div>
              </div>
            ))
          ) : (
            <>
              <div
                className="flex flex-row w-full h-full items-center p-1 dark:bg-gray-800 dark:text-gray-300  rounded-2xl"
                style={{ boxShadow: "0 0 0.2em gray" }}
              >
                <div className="bg-orange-200 flex px-5 py-3 ml-2 items-center  rounded-md ">
                  <p className="text-orange-600 text-center m-auto text-md font-bold ">
                    &#x20B9;
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-2 h-1/2 items-start w-1/2">
                  {" "}
                  {/* Added width here */}
                  <p className="text-black text-md font-bold dark:text-gray-300">
                    &#x20B9;
                    <Counter targetValue={totalSales.toFixed(2)} />
                  </p>
                  <p className="text-gray-400 text-sm font-normal">
                    Total Sales
                  </p>
                </div>
              </div>
              <div
                style={{ boxShadow: "0 0 0.2em gray" }}
                className="flex flex-row w-full h-full items-center  dark:bg-gray-800 dark:text-gray-300 rounded-2xl p-1"
              >
                <div className="bg-cyan-200 flex p-4  ml-2 items-center rounded-md ">
                  <p className="text-cyan-600 text-center m-auto text-md font-bold ">
                    <MdOutlineSell />
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-2 h-1/2 items-start">
                  <p className="text-black text-md font-bold dark:text-gray-300">
                    <Counter
                      targetValue={order.length.toString().padStart(2, "0")}
                    />
                  </p>
                  <p className="text-gray-400 text-sm font-normal">
                    Total Order
                  </p>
                </div>
              </div>
              <div
                style={{ boxShadow: "0 0 0.2em gray" }}
                className="flex flex-row w-full h-full items-center dark:bg-gray-800 dark:text-gray-300  rounded-2xl p-1"
              >
                <div className="bg-green-200 flex p-4 ml-2 items-center rounded-md ">
                  <p className="text-green-600 text-md text-center m-auto font-bold ">
                    <MdNotificationsActive />
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-2 h-1/2 items-start">
                  <p className="text-black text-md font-bold dark:text-gray-300">
                    <Counter
                      targetValue={activeuser.length
                        .toString()
                        .padStart(2, "0")}
                    />
                  </p>
                  <p className="text-gray-400 text-sm font-normal">
                    Active User
                  </p>
                </div>
              </div>
              <div
                style={{ boxShadow: "0 0 0.2em gray" }}
                className="flex flex-row w-full h-full rounded-2xl  dark:bg-gray-800 dark:text-gray-300 items-center p-1"
              >
                <div className="bg-red-200 flex p-4 ml-2 items-center  rounded-md ">
                  <p className="text-red-600 text-md m-auto text-center font-bold ">
                    <FaUsers />
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-2 h-1/2 items-start w-full">
                  <p className="text-black text-md font-bold dark:text-gray-300">
                    <Counter
                      targetValue={user.length.toString().padStart(2, "0")}
                    />
                  </p>
                  <p className="text-gray-400 text-sm font-normal">
                    Total Users
                  </p>
                </div>
              </div>
              <div
                style={{ boxShadow: "0 0 0.2em gray" }}
                className="flex flex-row  w-full h-full items-center dark:bg-gray-800 dark:text-gray-300  rounded-2xl p-1"
              >
                <div className="bg-green-500 flex p-4 ml-2 items-cente rounded-md ">
                  <p className="text-green-900 text-md m-auto text-center font-bold ">
                    <PiBowlFoodBold />
                  </p>
                </div>
                <div className="flex flex-col gap-1 p-2 h-1/2 items-start w-full">
                  <p className="text-black text-md font-bold dark:text-gray-300">
                    <Counter
                      targetValue={items.length.toString().padStart(2, "0")}
                    />
                  </p>
                  <p className="text-gray-400 text-sm font-normal">
                    Food Items
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex h-1/3  flex-row gap-6">
          <div
            style={{ boxShadow: "0 0 0.5em gray" }}
            className="flex flex-col dark:bg-gray-800 items-center rounded-2xl  justify-center h-[300px] w-[530px]"
          >
            {loading ? (
              <div className="animate-pulse bg-gray-300 rounded-lg w-full h-full"></div>
            ) : (
              <>
                <Bar data={dataforbarchart} options={optionsforbarchart} />
                <h1 className="text-center  capitalize text-orange-800 text-sm font-bold">
                  Monthly Sales Record
                </h1>
              </>
            )}
            <div className="animate-pulse bg-gray-300 rounded-lg w-full h-6 mt-4"></div>
          </div>
          <div
            style={{ boxShadow: "0 0 0.5em gray" }}
            className="flex flex-col gap-2 dark:bg-gray-800 p-4 h-[300px] w-[500px] rounded-2xl drop-shadow-2xl"
          >
            {loading ? (
              <>
                <div className="animate-pulse bg-gray-300 rounded-lg w-full h-4 mt-2"></div>
                <div className="animate-pulse bg-gray-300 rounded-lg w-full h-4 mt-2"></div>
                <div className="animate-pulse bg-gray-300 rounded-lg w-full h-full mt-4"></div>
              </>
            ) : (
              <>
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
                {user.map((userdata: User) => {
                  console.log(userdata);

                  const totalCashPayments = cashPaymentForUsers[userdata._id];

                  const totalCardPayments = cardPaymentForUsers[userdata._id];
                  const cashPaymentPercentage =
                    (totalCashPayments /
                      (totalCardPayments + totalCashPayments)) *
                    100;
                  return (
                    <>
                      <div className="flex flex-col">
                        <p className="text-start text-sm font-bold">
                          {userdata.restaurantname}
                        </p>
                        <div className="w-full">
                          <div
                            className="bg-orange-600 font-bold text-xs text-blue-100 text-center p-0.5 leading-none rounded-full transition-width duration-500 ease-in-out"
                            style={{ width: `${cashPaymentPercentage}%` }}
                          >
                            <Counter
                              targetValue={Math.round(cashPaymentPercentage)}
                            />
                            %
                          </div>
                          {/* Display remaining percentage as green segment (representing card payments) */}
                          <div
                            className="bg-black text-xs font-bold text-green-100 text-center p-0.5 leading-none rounded-full"
                            style={{ width: `${100 - cashPaymentPercentage}%` }}
                          >
                            <Counter
                              targetValue={
                                100 - Math.round(cashPaymentPercentage)
                              }
                            />
                            %
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
                <h1 className="text-center mt-12  capitalize text-orange-800 text-sm font-bold">
                  Sales Revenue
                </h1>
              </>
            )}
          </div>
        </div>
        {loading ? (
          <div
            id="chart"
            className="animate-pulse w-full h-1/2 bg-gray-300"
          ></div>
        ) : (
          <div style={{ height: "50%" }} id="chart"></div>
        )}
      </div>
    </>
  );
};

export default AdminPage;
