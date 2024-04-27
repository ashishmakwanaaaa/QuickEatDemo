"use client";

import { IoPeople } from "react-icons/io5";
import { IoFastFood } from "react-icons/io5";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MoneyIcon from "@mui/icons-material/Money";
import { useContext, useEffect, useState } from "react";
import { Customer } from "./CustomerList";
import { ItemType } from "./ItemList";
import StateLogin from "../LoginState/logincontext";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "@/lib/actions/itemAction";
import { fetchCustomer } from "@/lib/actions/customerAction";
import { initialStateTypeForCustomer } from "@/lib/reducers/customerSlice/customerReducers";
import { initialStateTypeForItems } from "@/lib/reducers/ItemSlice/itemReducers";
import { PaymentData, fetchPayments } from "@/lib/actions/paymentAction";
import { customer, item, payment, user } from "@/lib/reducers";
import { PaymentType } from "@/lib/reducers/paymentSlice/paymentReducers";
import { useAppDispatch } from "@/lib/store";
import { Counter } from "../components/Counter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Top5sellingItemType {
  _id: string;
  count: number;
}

interface ItemDataTypeForChart {
  label: string;
  value: number;
  color: string;
  cutout: string;
}
export interface CategoryType {
  categoryname: string;
  image: string;
}

interface monthlyDatatype {
  day: number;
  totalAmount: number;
}

const AdminDashboard = () => {
  const [monthlyData, setMonthlyData] = useState<monthlyDatatype[]>([]);
  const [filterdata, setfilterdata] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number | string>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number | string>(
    new Date().getFullYear()
  );
  const [top5sellingItems, setTop5sellingItems] = useState<
    Top5sellingItemType[]
  >([]);

  let data: ItemDataTypeForChart[] = [];
  const StateContext = useContext(StateLogin);
  const user = useSelector((state: user) => state.user.user);
  const userId = user._id;
  const dispatch = useAppDispatch();
  const items = useSelector((state: item) => state.item.items);
  const customers: Customer[] = useSelector(
    (state: customer) => state.customer.customer
  );
  const payments = useSelector((state: payment) => state.payment.payments);
  const cardPayment = useSelector(
    (state: payment) => state.payment.cardpayments
  );
  const cashPayment = useSelector(
    (state: payment) => state.payment.cashpayments
  );
  console.log(payments, customers);
  const totalAmount =
    payments &&
    payments
      .reduce((total, item) => total + parseFloat(item.amount), 0)
      .toFixed(2);
  console.log(totalAmount);
  const totalCardAmount =
    cardPayment &&
    cardPayment
      .reduce((total, item) => total + parseFloat(item.amount), 0)
      .toFixed(2);
  const totalCashAmount =
    cashPayment &&
    cashPayment
      .reduce((total, item) => total + parseFloat(item.amount), 0)
      .toFixed(2);
  console.log(typeof totalAmount);
  useEffect(() => {
    setLoading(true);
    dispatch(fetchCustomer(userId));
    setTimeout(() => setLoading(false), 2000);
  }, [dispatch, userId]);
  useEffect(() => {
    setLoading(true);
    dispatch(fetchItems(userId));
    setTimeout(() => setLoading(false), 2000);
  }, [dispatch, userId]);
  useEffect(() => {
    setLoading(true);
    dispatch(fetchPayments(userId));
    setTimeout(() => setLoading(false), 2000);
  }, [dispatch, userId]);
  useEffect(() => {
    async function top5sellingitems() {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/orders/top5sellingitems/${userId}`
        );
        const data = await response.json();
        setTop5sellingItems(data.top5items);
        setTimeout(() => setLoading(false), 2000);
      } catch (error) {
        window.alert(error);
      }
    }
    top5sellingitems();
  }, []);
  console.log(top5sellingItems);
  const getRandomColor = (): string => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  top5sellingItems &&
    top5sellingItems.forEach((item) => {
      const itemData = {
        label: item._id,
        value: item.count,
        color: getRandomColor(),
        cutout: "50%",
      };
      data.push(itemData);
    });
  const options: any = {
    plugins: {
      responsive: true,
    },
    cutout: data.map((item) => item.cutout),
  };
  const finalData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => Math.round(item.value)),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(data.length).fill(true),
      },
    ],
  };

  const optionsforbarchart: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
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
  const lables = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysInMonth = new Date(
    Number(selectedYear),
    Number(selectedMonth),
    0
  ).getDate();
  const dailyAmounts = new Array(daysInMonth).fill(0);
  console.log(filterdata);
  filterdata &&
    filterdata.forEach((payment) => {
      const paymentDate = new Date(payment.Date);
      const dayOfMonth = paymentDate.getDate();
      dailyAmounts[dayOfMonth - 1] += parseFloat(payment.amount);
    });
  const labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dataforbarchart = {
    labels,
    datasets: [
      {
        label: "Monthly Amount",
        data: dailyAmounts,
        backgroundColor: "rgba(255, 140, 0, 0.7)",
        borderColor: "rgba(255, 140, 0, 1)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(259, 145, 0, 0.7)",
        hoverBorderColor: "rgba(245,130,0,1)",
      },
    ],
  };

  useEffect(() => {
    const calculatedMonthlydata = () => {
      const filteredData =
        payments &&
        payments.filter((payment) => {
          console.log(selectedMonth, selectedYear);
          const paymentDate = new Date(payment.Date);
          return (
            paymentDate.getMonth() === Number(selectedMonth) - 1 &&
            paymentDate.getFullYear() === selectedYear
          );
        });

      setfilterdata(filteredData);
      const dailyData =
        filteredData &&
        filteredData.reduce((acc, payment) => {
          const paymentDate = new Date(payment.Date);
          const day = paymentDate.getDate();
          acc[day] = (acc[day] || 0) + parseFloat(payment.amount);
          return acc;
        }, {} as { [key: number]: number });
      const daysInMonth = new Date(
        Number(selectedYear),
        Number(selectedMonth),
        0
      ).getDate();
      console.log(daysInMonth);
      const monthlyData = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        totalAmount: (dailyData && dailyData[i + 1]) || 0,
      }));

      setMonthlyData(monthlyData);
    };
    calculatedMonthlydata();
  }, [payments, selectedMonth, selectedYear]);
  console.log(monthlyData);

  return (
    <>
      <div className="dark:bg-gray-900 dark:text-gray-500 w-[68rem] font-[Poppins] bg-[#f4f4f4]  h-screen p-2 rounded-lg text-white">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full p-2 rounded-lg text-white">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex flex-col gap-6 items-center bg-white dark:bg-gray-800 text-black p-2 rounded-3xl border-b-4 border-gray-300 drop-shadow-2xl h-44 mt-4"
              >
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            <>
              <div
                className="flex flex-col gap-6 items-center bg-red-500 dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-xl border-b-4 border-red-500 drop-shadow-2xl h-44 mt-4"
                style={{ boxShadow: "0 0 0.1em red" }}
              >
                <h4 className="text-md text-white dark:text-red-500">
                  Customers
                </h4>
                <div className="rounded-full p-2 bg-white">
                  <IoPeople color="red" />
                </div>

                <p className="text-3xl text-white dark:text-red-500">
                  <Counter
                    targetValue={
                      customers && customers.length > 0 && customers.length
                    }
                  />
                </p>
              </div>
              <div
                style={{ boxShadow: "0 0 0.1em green" }}
                className="flex flex-col gap-6 items-center bg-green-500 dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-xl border-b-4 border-green-500  drop-shadow-2xl h-44 mt-4"
              >
                <h4 className="text-md text-white dark:text-green-600">
                  FoodItems
                </h4>
                <div className="bg-white p-2 rounded-full">
                  <IoFastFood color="green" />
                </div>
                <p className="text-3xl text-white dark:text-green-600">
                  <Counter
                    targetValue={items && items.length > 0 && items.length}
                  />
                </p>
              </div>
              <div
                style={{ boxShadow: "0 0 0.1em blue" }}
                className="flex flex-col gap-6 items-center bg-blue-400 dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-xl border-b-4 border-blue-400  drop-shadow-2xl h-44 mt-4"
              >
                <h4 className="text-md text-white dark:text-blue-400">
                  Total Sales
                </h4>
                <div className="bg-white rounded-full p-1 flex justify-center items-center w-10 h-10">
                  <MonetizationOnIcon style={{ color: "blue" }} />
                </div>
                <p className="text-3xl text-white dark:text-blue-400">
                  &#x20B9; <Counter targetValue={totalAmount} />
                </p>
              </div>
              <div
                style={{ boxShadow: "0 0 0.1em orange" }}
                className="flex flex-col gap-6 items-center bg-orange-400 dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-xl border-b-4 border-orange-400  drop-shadow-2xl h-44 mt-4"
              >
                <h4 className="text-md text-white dark:text-orange-500">
                  Card Sales
                </h4>
                <div className="rounded-full p-2 bg-white w-10 h-10 flex justify-center items-center">
                  <CreditCardIcon style={{ color: "orange" }} />
                </div>
                <p className="text-3xl text-white dark:text-orange-500">
                  &#x20B9; <Counter targetValue={totalCardAmount} />
                </p>
              </div>
              <div
                style={{ boxShadow: "0 0 0.1em purple" }}
                className="flex flex-col gap-6 items-center bg-purple-400 dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-xl border-b-4 border-purple-400  drop-shadow-2xl h-44 mt-4"
              >
                <h4 className="text-md text-white dark:text-purple-500">
                  Cash Sales
                </h4>
                <div className="bg-white rounded-full p-2 w-10 h-10 flex justify-center items-center">
                  {" "}
                  <MoneyIcon style={{ color: "purple" }} />
                </div>
                <p className="text-3xl text-white dark:text-purple-500">
                  &#x20B9; <Counter targetValue={totalCashAmount} />
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between w-full h-full mt-5 z-20">
          <div className="flex ml-[-25px] flex-col items-center drop-shadow-2xl rounded-xl  justify-center h-[260px] mt-10 w-[400px] gap-8">
            {loading ? (
              <div className="animate-pulse bg-gray-300 rounded-xl w-[400px] h-[450px] ml-[60px]"></div>
            ) : (
              <div
                style={{ boxShadow: "0 0 0.4em gray" }}
                className="rounded-lg p-2 mt-6 h-[350px]"
              >
                <Doughnut data={finalData} options={options} />
                <h1 className="text-center dark:text-gray-300  mt-2 capitalize text-orange-500 font-bold">
                  Categories Wise Data
                </h1>
              </div>
            )}
          </div>
          <div
            className="flex flex-col items-end rounded-lg h-[360px] p-2 justify-center drop-shadow-2xl mr-4 "
            style={{ boxShadow: "0 0 0.4em gray" }}
          >
            {loading ? (
              <div className="animate-pulse bg-gray-300 rounded-xl w-[500px] h-[300px]"></div>
            ) : (
              <>
                <div className="flex flex-row gap-2 justify-start items-start mr-16">
                  <div className="flex items-end">
                    <FormControl variant="standard" style={{ width: "80px" }}>
                      {/* <InputLabel id="demo-simple-select-label" style={{ color: "black" }}>Select A Month</InputLabel> */}
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedMonth.toString()}
                        label="select"
                        className="dark:text-gray-300"
                        onChange={(e) =>
                          setSelectedMonth(parseInt(e.target.value))
                        }
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {lables[i]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="flex items-end">
                    <FormControl variant="standard" style={{ width: "80px" }}>
                      {/* <InputLabel id="demo-simple-select-label" style={{ color: "black" }}>Select A Month</InputLabel> */}
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedYear.toString()}
                        label="select"
                        className="dark:text-gray-300"
                        onChange={(e) =>
                          setSelectedYear(parseInt(e.target.value))
                        }
                      >
                        {Array.from({ length: 10 }, (_, i) => (
                          <MenuItem key={i + 1} value={2024 + i}>
                            {2024 + i}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className=" flex flex-col gap-2 w-[500px] h-[700px] mr-16">
                  <Bar data={dataforbarchart} options={optionsforbarchart} />
                  <h1 className="text-end dark:text-gray-300 capitalize text-orange-500 font-bold">
                    Monthly Sales Record
                  </h1>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
