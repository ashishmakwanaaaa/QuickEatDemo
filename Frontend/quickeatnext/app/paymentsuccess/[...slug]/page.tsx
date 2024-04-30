"use client";

import { Customer } from "../../../app/UserPage/CustomerList";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import LoginContext from "../../../app/LoginState/logincontext";

const PaymentSuccess = ({ params }: { params: { slug: string } }) => {
  // console.log(params);
  const customerid = params.slug[0];
  const amount = params.slug[1];
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer>({} as Customer);
  const [paymentproceed, setPaymentProceed] = useState<boolean>(false);
  const customerID = customerid;
  const StateLogin = useContext(LoginContext);
  const userId = StateLogin.userid;
  // console.log(StateLogin);
  // console.log(customer.emailid);

  const CardData = {
    userId: customer.userId,
    customerID: customerID,
    email: customer?.emailid,
    cardHoldername: customer?.firstname + " " + customer?.lastname,
    billingaddress: {
      city: customer.city,
      pincode: customer.pincode,
      state: customer.state,
    },
    amount: amount,
    paymentMethod: "card",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/customer/getCustomer/${customerID}`
        );
        const data = await response.json();
        console.log(data);
        setCustomer(data.customer);
      } catch (error) {
        console.log(error);
      }
    };

    const storePayment = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/payment/createPayment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(CardData),
          }
        );
        const data = await response.json();
        console.log(response);
        console.log(data);
        if (response.ok) {
          setPaymentProceed(true);
          Swal.fire({
            title: "Payment With Card Successfully",
            icon: "success",
            timer: 1000,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (customer.emailid && !paymentproceed) {
      storePayment();
    } else if (!customer.emailid) {
      fetchData();
    }
  }, [customer]);
  return (
    <>
      <div className="font-[Poppins] flex flex-col items-center justify-center h-screen drop-shadow-2xl">
        <div className="absolute flex flex-col items-center justify-center p-4 z-20 bg-white drop-shadow-2xl rounded-lg">
          <img
            src="https://cdn.dribbble.com/users/1751799/screenshots/5512482/check02.gif"
            alt="Image or GIF"
            className="w-32 h-24 rounded-full"
          />
          <h4 className=" text-green-800 font-bold">Amount: {amount}</h4>
          <h4 className="text-2xl text-green-800 font-bold mt-2">
            Payment Successfull
          </h4>
          <p className="mt-4">The payment has been done successfully</p>
          <p className="">Thanks for being there for with us</p>
          <button
            onClick={() => {
              StateLogin.login = true;
              StateLogin.login && router.push("/customerlist");
            }}
            className="bg-green-800  text-white p-2 w-full rounded-md mt-8 hover:text-green-800 hover:bg-white hover:border hover:border-green-800 transform duration-300 text-center font-bold"
          >
            Back
          </button>
        </div>
        <div className="w-screen h-1/2 bg-green-100"></div>
        <div className="w-screen h-1/2 bg-green-300"></div>
      </div>
    </>
  );
};

export default PaymentSuccess;
