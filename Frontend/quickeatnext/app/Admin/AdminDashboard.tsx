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
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "@/lib/actions/itemAction";
import { fetchCustomer } from "@/lib/actions/customerAction";
import { initialStateTypeForCustomer } from "@/lib/reducers/customerSlice/customerReducers";
import { initialStateTypeForItems } from "@/lib/reducers/ItemSlice/itemReducers";
import { fetchPayments } from "@/lib/actions/paymentAction";

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

export const Counter = ({ targetValue }: { targetValue: any }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = Math.max(1, Math.floor(targetValue / 100));
    console.log(increment); // Increment by 1% of the target value
    const timer = setInterval(() => {
      setCount((prevCount) => {
        const nextCount = Math.min(prevCount + increment, targetValue);
        return nextCount;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [targetValue]);

  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const AdminDashboard = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [filterdata, setfilterdata] = useState([]);
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
  const user = useSelector((state) => state.user.user);
  const userId = user._id;
  const dispatch = useDispatch();
  const items = useSelector(
    (state: initialStateTypeForItems) => state.item.items
  );
  const customers: Customer[] = useSelector(
    (state: initialStateTypeForCustomer) => state.customer.customer
  );
  const payments = useSelector((state) => state.payment.payments);
  const cardPayment = useSelector((state) => state.payment.cardpayments);
  const cashPayment = useSelector((state) => state.payment.cashpayments);
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
    dispatch(fetchCustomer(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    dispatch(fetchItems(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    dispatch(fetchPayments(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    async function top5sellingitems() {
      try {
        const response = await fetch(
          `http://localhost:5000/orders/top5sellingitems/${userId}`
        );
        const data = await response.json();
        setTop5sellingItems(data.top5items);
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

  const optionsforbarchart: any = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
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
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
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
            paymentDate.getMonth() === selectedMonth - 1 &&
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
        }, {});
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
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
          <div
            className="flex flex-col gap-6 items-center bg-white dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-3xl border-b-4 border-red-600 drop-shadow-2xl h-44 mt-4"
            // style={{ boxShadow: "0 0  1em grey" }}
          >
            <h4 className="text-md text-red-600 dark:text-gray-300">
              Customers
            </h4>
            <IoPeople color="red " />
            <p className="text-3xl text-red-600 dark:text-gray-300">
              <Counter
                targetValue={
                  customers && customers.length > 0 && customers.length
                }
              />
            </p>
          </div>
          <div
            // style={{ boxShadow: "0 0  1em grey" }}
            className="flex flex-col gap-6 items-center bg-white dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-3xl border-b-4 border-green-800  drop-shadow-2xl h-44 mt-4"
          >
            <h4 className="text-md text-green-800 dark:text-gray-300">
              FoodItems
            </h4>
            <IoFastFood color="green " />
            <p className="text-3xl text-green-800 dark:text-gray-300">
              <Counter
                targetValue={items && items.length > 0 && items.length}
              />
            </p>
          </div>
          <div
            // style={{ boxShadow: "0 0  1em grey" }}
            className="flex flex-col gap-6 items-center bg-white dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-3xl border-b-4 border-blue-600  drop-shadow-2xl h-44 mt-4"
          >
            <h4 className="text-md text-blue-600 dark:text-gray-300">
              Total Sales
            </h4>
            <MonetizationOnIcon style={{ color: "blue" }} />
            <p className="text-3xl text-blue-600 dark:text-gray-300">
              &#x20B9; <Counter targetValue={totalAmount} />
            </p>
          </div>
          <div
            // style={{ boxShadow: "0 0  1em grey" }}
            className="flex flex-col gap-6 items-center bg-white dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-3xl border-b-4 border-orange-600  drop-shadow-2xl h-44 mt-4"
          >
            <h4 className="text-md text-orange-600 dark:text-gray-300">
              Card Sales
            </h4>
            <CreditCardIcon style={{ color: "orange" }} />
            <p className="text-3xl text-orange-600 dark:text-gray-300">
              &#x20B9; <Counter targetValue={totalCardAmount} />
            </p>
          </div>
          <div
            // style={{ boxShadow: "0 0  1em grey" }}
            className="flex flex-col gap-6 items-center bg-white dark:bg-gray-800 dark:border-none dark:border-stone-700 text-black p-2 rounded-3xl border-b-4 border-purple-600  drop-shadow-2xl h-44 mt-4"
          >
            <h4 className="text-md text-purple-700 dark:text-gray-300">
              Cash Sales
            </h4>
            <MoneyIcon style={{ color: "purple" }} />
            <p className="text-3xl text-purple-700 dark:text-gray-300">
              &#x20B9; <Counter targetValue={totalCashAmount} />
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full h-full mt-5 z-20">
          <div className="flex flex-col items-center  justify-center h-[260px] mt-5 w-[400px] gap-2">
            <Doughnut data={finalData} options={options} />
            <h1 className="text-center dark:text-gray-300  mt-2 capitalize text-orange-600 font-bold">
              Categories Wise Data
            </h1>
          </div>
          <div className="flex flex-col items-center  justify-center mt-3 ">
            <div className="flex flex-row gap-2 justify-start items-start">
              <div className="flex items-end">
                <FormControl variant="standard" style={{ width: "80px" }}>
                  {/* <InputLabel id="demo-simple-select-label" style={{ color: "black" }}>Select A Month</InputLabel> */}
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedMonth}
                    label="select"
                    className="dark:text-gray-300"
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
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
                    value={selectedYear}
                    label="select"
                    className="dark:text-gray-300"
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
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
              <h1 className="text-center dark:text-gray-300 capitalize text-orange-600 font-bold">
                Monthly Sales Record
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
