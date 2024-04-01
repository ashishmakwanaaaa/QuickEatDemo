"use client";

import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const ForgotPasswordPage = ({ params }: { params: { slug: string } }) => {
  // console.log(id,token)

  const [password, setPassowrd] = useState<string>("");
  const [passwordvalidate, setPasswordValidate] = useState<string>("");
  const id: string = params.slug[0];
  const token: string = params.slug[1];

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  async function userValid() {
    const response = await fetch(
      `http://localhost:5000/auth/forgotPassword/${id}/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      Swal.fire({
        text: "User Has Valid",
        timer: 1000,
        icon: "success",
      });
    }
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      resetPsw();
    } catch (error) {
      window.alert(error);
    }
  };

  async function resetPsw() {
    const response = await fetch(
      `http://localhost:5000/auth/forgotPassword/${id}/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      setPassowrd("");
      Swal.fire({
        title: "Password Change Successfully",
        icon: "success",
        timer: 3000,
      });
    } else {
      Swal.fire({
        text: data.message,
        icon: "error",
        timer: 1000,
      });
    }
  }

  useEffect(() => {
    try {
      userValid();
    } catch (error) {
      window.alert(error);
    }
  }, []);
  return (
    <div className="relative bg-[url('https://watermark.lovepik.com/background/20211021/large/lovepik-brown-cartoon-food-hand-drawn-texture-background-image_450042220.jpg')] bg-cover bg-center bg-no-repeat backdrop-blur-lg bg-opacity-100 p-8 rounded-lg h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative bg-white drop-shadow-2xl w-1/2 p-8 rounded-lg ">
        <div
          className="flex flex-col items-center gap-4 justify-between mb-4"
          data-aos="zoom-in"
        >
          <h2 className="font-bold text-2xl text-center">RESET PASSWORD</h2>
          <div className="bg-orange-900 h-1 w-full rounded"></div>
        </div>
        <div
          className="flex flex-col gap-5 mt-10 justify-start"
          data-aos="fade-right"
        >
          <label htmlFor="restaurantName" className="font-normal text-xl">
            Enter Your New Password
          </label>
          <input
            type="password"
            id="restaurantPsw"
            name="restaurantPsw"
            value={password}
            onChange={(e) => {
              const passwordValid = e.target.value;
              setPassowrd(e.target.value);
              if (passwordValid.length < 6) {
                setPasswordValidate("Password Should be 6 Characters");
              } else {
                setPasswordValidate("");
              }
            }}
            placeholder="Enter Password"
            className="p-2 rounded-md border-2 border-orange-500 w-full"
          />
          {passwordvalidate && (
            <p className="text-red-600 text-sm font-bold " data-aos="zoom-in">
              {passwordvalidate}
            </p>
          )}
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 hover:text-orange-500 hover:bg-transparent transition-all duration-500 hover:border-orange-500 hover:border font-bold text-lg text-white p-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
