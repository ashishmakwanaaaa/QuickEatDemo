"use client";

import { IoPeople } from "react-icons/io5";
import { IoFastFood } from "react-icons/io5";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MoneyIcon from "@mui/icons-material/Money";
import { useEffect, useState } from "react";
import { Customer } from "./CustomerList";
import { ItemType } from "./ItemList";
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
  const [customers, setcustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<ItemType[]>([]);
  const [payments, setPayments] = useState([]);
  const [cardPayment, setCardPayment] = useState([]);
  const [cashPayment, setCashPayment] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [top5sellingItems, setTop5sellingItems] = useState<
    Top5sellingItemType[]
  >([]);

  let data: ItemDataTypeForChart[] = [];

  async function FetchData() {
    const response = await fetch(
      "http://localhost:5000/customer/getAllCustomer"
    );
    const data = await response.json();
    console.log(data);
    setcustomers(data.customers);
  }

  async function fetchItems() {
    try {
      const response = await fetch("http://localhost:5000/items/getAllItems");
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchPayments() {
    try {
      const response = await fetch("http://localhost:5000/payment/allpayment");
      const data = await response.json();
      setPayments(data.payments);
      setCardPayment(data.cardPayment);
      setCashPayment(data.cashPayment);
    } catch (error) {
      console.log(error);
    }
  }
  const totalAmount =
    payments &&
    payments
      .reduce((total, item) => total + parseFloat(item.amount), 0)
      .toFixed(2);
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
    FetchData();
  }, []);
  useEffect(() => {
    fetchItems();
  }, []);
  useEffect(() => {
    fetchPayments();
  }, []);
  useEffect(() => {
    async function top5sellingitems() {
      try {
        const response = await fetch(
          "http://localhost:5000/orders/top5sellingitems"
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "September",
    "October",
    "November",
    "December",
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
      const monthlytotals = Object.fromEntries(
        lables.map((month, index) => [index + 1, 0])
      );
      payments &&
        payments.forEach((payment) => {
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
  }, [payments]);
  console.log(monthlyData);

  return (
    <>
      <div className="font-[Poppins] bg-[#f4f4f4]  w-full h-full p-2 rounded-lg text-white">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full p-2 rounded-lg text-white">
          <div
            className="flex flex-col gap-6 items-center bg-white text-black p-2 rounded-3xl border-b-4 border-red-600 drop-shadow-2xl h-44 mt-4"
            style={{ boxShadow: "0 0  1em grey" }}
          >
            <h4 className="text-md text-red-600">Customers</h4>
            <IoPeople color="red" />
            <p className="text-3xl text-red-600">
              <Counter targetValue={customers.length} />
            </p>
          </div>
          <div
            style={{ boxShadow: "0 0  1em grey" }}
            className="flex flex-col gap-6 items-center bg-white text-black p-2 rounded-3xl border-b-4 border-green-800  drop-shadow-2xl h-44 mt-4"
          >
            <h4 className="text-md text-green-800">FoodItems</h4>
            <IoFastFood color="green" />
            <p className="text-3xl text-green-800">
              <Counter targetValue={items.length} />
            </p>
          </div>
          <div
            style={{ boxShadow: "0 0  1em grey" }}
            className="flex flex-col gap-6 items-center bg-white text-black p-2 rounded-3xl border-b-4 border-blue-600  drop-shadow-2xl h-44 mt-4"
          >
            <h4 className="text-md text-blue-600">Total Sales</h4>
            <MonetizationOnIcon style={{ color: "blue" }} />
            <p className="text-3xl text-blue-600">
              &#x20B9; <Counter targetValue={totalAmount} />
            </p>
          </div>
          <div
            style={{ boxShadow: "0 0  1em grey" }}
            className="flex flex-col gap-6 items-center bg-white text-black p-2 rounded-3xl border-b-4 border-orange-600  drop-shadow-2xl h-44 mt-4"
          >
            <h4 className="text-md text-orange-600">Card Sales</h4>
            <CreditCardIcon style={{ color: "orange" }} />
            <p className="text-3xl text-orange-600">
              &#x20B9; <Counter targetValue={totalCardAmount} />
            </p>
          </div>
          <div
            style={{ boxShadow: "0 0  1em grey" }}
            className="flex flex-col gap-6 items-center bg-white text-black p-2 rounded-3xl border-b-4 border-purple-600  drop-shadow-2xl h-44 mt-4"
          >
            <h4 className="text-md text-purple-700">Cash Sales</h4>
            <MoneyIcon style={{ color: "purple" }} />
            <p className="text-3xl text-purple-700">
              &#x20B9; <Counter targetValue={totalCashAmount} />
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between w-full h-full mt-10 z-20">
          <div className="flex flex-col items-center  justify-center h-[260px] mt-5 w-[400px] gap-2">
            <Doughnut data={finalData} options={options} />
            <h1 className="text-center  mt-2 capitalize text-orange-600 font-bold">
              Categories Wise Data
            </h1>
          </div>
          <div className="flex flex-col items-center  justify-center gap-6 h-[300px] w-[500px]">
            <Bar data={dataforbarchart} options={optionsforbarchart} />
            <h1 className="text-center  capitalize text-orange-600 font-bold">
              Monthly Sales Record
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
