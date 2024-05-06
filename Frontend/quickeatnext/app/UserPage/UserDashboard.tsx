"use client";

import { IoPeople } from "react-icons/io5";
import { IoFastFood } from "react-icons/io5";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MoneyIcon from "@mui/icons-material/Money";
import ApexCharts from "apexcharts";
import Carousel from "@itseasy21/react-elastic-carousel";
import { useContext, useEffect, useState } from "react";
import { Customer } from "./CustomerList";

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
import { fetchItems } from "../../lib/actions/itemAction";
import { fetchCustomer } from "../../lib/actions/customerAction";

import { PaymentData, fetchPayments } from "../../lib/actions/paymentAction";
import { customer, item, payment, user } from "../../lib/reducers";
import { PaymentType } from "../../lib/reducers/paymentSlice/paymentReducers";
import { useAppDispatch } from "../../lib/store";
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
  const [MonthBasedDailyData, setMonthBasedDailyData] = useState<
    monthlyDatatype[]
  >([]);
  const [monthlydata, setMonthlydata] = useState<any[]>([]);
  const [filterdata, setfilterdata] = useState<PaymentType[]>([]);
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
  const user = useSelector((state: user) => state.user.user);
  const userId = user._id;
  const dispatch = useAppDispatch();
  const items = useSelector((state: item) => state.item.items);
  const loading = useSelector((state: payment) => state.payment.loading);
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
    dispatch(fetchCustomer(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    dispatch(
      fetchItems({
        userId,
        search: "",
        sort: "",
        category: "",
      })
    );
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

  useEffect(() => {
    const getMonthlyData = () => {
      // Initialize months data
      const months = Array.from({ length: 12 }, () => 0);

      // Filter payments by the specified userId
      const userPayments = payments.filter(
        (payment) => payment.userId === userId
      );

      // Aggregate payments by month for the specific user
      userPayments.forEach((payment) => {
        const paymentDate = new Date(payment.Date);
        const month = paymentDate.getMonth(); // Get month index (0-based)
        months[month] += parseFloat(payment.amount); // Sum up payments per month
      });

      return months;
    };
    setMonthlydata(getMonthlyData()); // Assume this function is defined or imported
    var optionsformonthlydata = {
      series: [
        {
          name: "Total Sales",
          data: monthlydata,
        },
      ],
      chart: {
        height: 250,
        type: "bar",
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: string) {
          return Number(val).toFixed(2);
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      fill: {
        colors: ["#EE7600"], // Sets the bar color to orange
      },
      xaxis: {
        categories: lables,
        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function(val: string) {
            return Number(val).toFixed(2);
          },
        },
      },
      title: {
        text: "Monthly Sales Of Your Restaurant",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444",
        },
      },
    };

    var chart = new ApexCharts(
      document.querySelector("#chart"),
      optionsformonthlydata
    );
    chart.render();
  }, [payments]);

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
  console.log(data);
  const categoryLabels = top5sellingItems.map((item) => item._id);

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

  const options: any = {
    plugins: {
      responsive: true,
    },
    cutout: data.map((item) => item.cutout),
  };
  const finalData = {
    // labels: categoryLabels,
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

      setMonthBasedDailyData(monthlyData);
    };
    calculatedMonthlydata();
  }, [payments, selectedMonth, selectedYear]);
  console.log(MonthBasedDailyData, monthlydata);

  return (
    <>
      <div className="dark:bg-gray-900 dark:text-gray-500 w-full font-poppins bg-gray-100 mt-[-10px] p-2 md:p-4 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-[-12px]">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex flex-col gap-6 items-center bg-white dark:bg-gray-800 text-black p-4 rounded-3xl border-b-4 border-gray-300 shadow-2xl h-44 mt-4"
              >
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            <>
              <div className="flex flex-col gap-6 items-center bg-red-500 dark:bg-gray-800 dark:border-none text-black p-4 rounded-xl border-b-4 border-red-500 shadow-2xl h-44">
                <h4 className="text-md md:text-md text-white dark:text-red-500">
                  Customers
                </h4>
                <div className="rounded-full p-2 bg-white dark:bg-red-900">
                  <IoPeople color="red" />
                </div>
                <p className="text-3xl text-white dark:text-red-500">
                  <Counter
                    targetValue={
                      customers && customers.length > 0 ? customers.length : 0
                    }
                  />
                </p>
              </div>
              <div className="flex flex-col gap-6 items-center bg-green-500 dark:bg-gray-800 dark:border-none text-black p-4 rounded-xl border-b-4 border-green-500 shadow-2xl h-44">
                <h4 className="text-md md:text-md text-white dark:text-green-600">
                  FoodItems
                </h4>
                <div className="bg-white dark:bg-green-900  p-2 rounded-full">
                  <IoFastFood color="green" />
                </div>
                <p className="text-3xl text-white dark:text-green-600">
                  <Counter
                    targetValue={items && items.length > 0 ? items.length : 0}
                  />
                </p>
              </div>
              <div className="flex flex-col gap-7 items-center bg-blue-400 dark:bg-gray-800 dark:border-none text-black p-4 rounded-xl border-b-4 border-blue-400 shadow-2xl h-44">
                <h4 className="text-md md:text-md text-white dark:text-blue-400">
                  Total Sales
                </h4>
                <div className="bg-white dark:bg-blue-400 rounded-full p-1 flex justify-center items-center w-9 h-10">
                  <MonetizationOnIcon style={{ color: "blue" }} />
                </div>
                <p className="text-3xl text-white dark:text-blue-400">
                  &#x20B9; <Counter targetValue={totalAmount} />
                </p>
              </div>
              <div className="flex flex-col gap-6 items-center bg-orange-400 dark:bg-gray-800 dark:border-none text-black p-4 rounded-xl border-b-4 border-orange-400 shadow-2xl h-44">
                <h4 className="text-md md:text-md text-white dark:text-orange-500">
                  Card Sales
                </h4>
                <div className="rounded-full p-2 bg-white dark:bg-orange-900 w-10 h-10 flex justify-center items-center">
                  <CreditCardIcon style={{ color: "orange" }} />
                </div>
                <p className="text-3xl text-white dark:text-orange-500">
                  &#x20B9; <Counter targetValue={totalCardAmount} />
                </p>
              </div>
              <div className="flex flex-col gap-6 items-center bg-purple-400 dark:bg-gray-800 dark:border-none text-black p-4 rounded-xl border-b-4 border-purple-400 shadow-2xl h-44">
                <h4 className="text-md md:text-md text-white dark:text-purple-500">
                  Cash Sales
                </h4>
                <div className="bg-white dark:bg-purple-500 rounded-full p-2 w-10 h-10 flex justify-center items-center">
                  <MoneyIcon style={{ color: "purple" }} />
                </div>
                <p className="text-3xl text-white dark:text-purple-500">
                  &#x20B9; <Counter targetValue={totalCashAmount} />
                </p>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-row gap-12 justify-between w-full h-full mt-2 z-20 ml-4">
          <div className="flex ml-[-20px] dark:bg-gray-800 flex-col items-center shadow-2xl rounded-xl justify-center h-[270px] w-[400px]">
            {loading ? (
              <div className="animate-pulse bg-gray-300 rounded-xl w-[400px] h-[270px] ml-[60px]"></div>
            ) : (
              <>
                <div className="rounded-lg h-[200px]">
                  <Doughnut data={finalData} options={options} />
                </div>
                <div className="flex flex-row gap-2 p-2 text-black text-sm w-full">
                  <Carousel
                    isRTL={false}
                    showArrows={false}
                    pagination={false}
                    itemsToShow={3}
                  >
                    {categoryLabels.map((label, index) => (
                      <div
                        style={{ backgroundColor: data[index].color }}
                        key={index}
                        className="flex text-white text-xs text-center font-normal items-center mr-2 rounded-full p-1"
                      >
                        {label}
                      </div>
                    ))}
                  </Carousel>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-end rounded-lg h-[270px] p-4 justify-center dark:bg-gray-800 dark:text-white shadow-2xl mr-4">
            {loading ? (
              <div className="animate-pulse bg-gray-300 rounded-xl w-[500px] h-[270px]"></div>
            ) : (
              <>
                <div className="flex flex-row gap-2 justify-start items-start mr-16">
                  <div className="flex items-end">
                    <FormControl variant="standard" style={{ width: "80px" }}>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedMonth.toString()}
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
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedYear.toString()}
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
                <div className="flex flex-col gap-2 w-[500px] h-[270px] mr-16">
                  <Bar data={dataforbarchart} options={optionsforbarchart} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="text-black shadow-2xl mt-2 rounded-lg dark:bg-gray-800 dark:text-white">
          <div className="w-full " id="chart"></div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
