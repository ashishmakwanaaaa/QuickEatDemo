"use client";

import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp = (): React.JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [emailValidationMessage, setEmailValidationMessage] =
    useState<string>("");
  const [passwordValidate, setPasswordVaidate] = useState<string>("");
  const [formData, setFormData] = useState<{
    restaurantname: string;
    ownername: string;
    address: string;
    emailid: string;
    password: string;
    confirmpassowrd: string;
  }>({
    restaurantname: "",
    ownername: "",
    address: "",
    emailid: "",
    password: "",
    confirmpassowrd: "",
  });
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Adjust the value for the desired speed (0.5 for half-speed)
    }
  }, []);

  const router = useRouter();

  async function addUser(): Promise<void> {
    const url = "http://localhost:5000/auth/signup";
    console.log(formData);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(res);
    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Successfully SignUp",
        timer: 1000,
      });

      setFormData({
        restaurantname: "",
        ownername: "",
        address: "",
        emailid: "",
        password: "",
        confirmpassowrd: "",
      });
      router.push("/login");
    } else {
      Swal.fire({
        icon: "error",
        width: "1000px",
        text: "Error:" + data.message,
        timer: 1000,
      });
    }

    console.log(data);
  }

  const handleSubmit = (e: { preventDefault: () => void }): void => {
    console.log(formData);
    e.preventDefault();
    try {
      let password = formData.password;
      let confirmpassword = formData.confirmpassowrd;

      if (password !== confirmpassword) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Password Does Not Match!",
          timer: 3000,
        });
      } else {
        addUser();
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className="font-[Poppins] flex items-center justify-center ">
      {/* Background Videos */}
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-90 "
          autoPlay
          loop
          muted
        >
          <source
            src="https://player.vimeo.com/external/392581454.sd.mp4?s=21f79ea157a661627f9850c1b17e53b537f5fb32&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
        {/* Add more video elements as needed */}
      </div>

      {/* Signup Box */}
      <div className="relative z-10 w-full md:w-[90%] lg:w-[70%] xl:w-[50%] 2xl:w-[40%] mx-auto bg-white p-8 rounded-lg text-center mt-5 opacity-90">
        <span
          className="text-black font-bold text-lg text-center"
          data-aos="zoom-in"
        >
          Welcome to the,{" "}
          <span className="text-orange-500 shadow-orange text-md text-center">
            QuickEat Family!
          </span>
        </span>
        <div className="flex flex-col p-2 gap-5 justify-center items-center mt-5">
          <div className="flex flex-col md:flex-row w-full justify-start gap-2">
            <div
              className="flex flex-col gap-2 items-start  w-full md:w-[60%]"
              data-aos="fade-right"
            >
              <label htmlFor="restaurantName" className="font-bold">
                Restaurant Name:{" "}
              </label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                value={formData.restaurantname}
                onChange={(e) =>
                  setFormData({ ...formData, restaurantname: e.target.value })
                }
                placeholder="Enter Restaurant Name"
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              />
            </div>
            <div
              className="flex flex-col gap-2 items-start w-full md:w-[55%]"
              data-aos="fade-right"
            >
              <label htmlFor="restaurantName" className="font-bold">
                Owner Name:{" "}
              </label>
              <input
                type="text"
                id="OwnerName"
                name="OwnerName"
                value={formData.ownername}
                onChange={(e) =>
                  setFormData({ ...formData, ownername: e.target.value })
                }
                placeholder="Enter Owner Name"
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              />
            </div>
          </div>
          <div
            className="flex flex-col gap-2 items-start w-full"
            data-aos="fade-right"
          >
            <label htmlFor="address" className="font-bold">
              Address:
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter Restaurant Address"
              className="p-2 rounded-md border-2 border-orange-500 w-full h-32"
            />
          </div>
          <div
            className="flex flex-col gap-2 items-start w-full"
            data-aos="fade-right"
          >
            <label htmlFor="restaurantName" className="font-bold">
              Email ID:{" "}
            </label>
            <input
              type="text"
              id="restaurantemail"
              name="restaurantemail"
              value={formData.emailid}
              onChange={(e) => {
                const email = e.target.value;
                setFormData({ ...formData, emailid: email });
                if (!email.includes("@")) {
                  // Show validation message if email doesn't contain '@'
                  setEmailValidationMessage(
                    "Please enter a valid email address"
                  );
                } else {
                  // Clear validation message if email is valid
                  setEmailValidationMessage("");
                }
              }}
              placeholder="Enter Email ID"
              className="p-2 rounded-md border-2 border-orange-500 w-full"
            />
            {emailValidationMessage && (
              <p className=" text-red-600 text-sm font-bold ">
                {emailValidationMessage}
              </p>
            )}
          </div>

          <div
            className="flex flex-col md:flex-row gap-2 justify-between w-full"
            data-aos="fade-right"
          >
            <div className="flex flex-col gap-2 items-start w-full md:w-[50%]">
              <label htmlFor="restaurantName" className="font-bold">
                Password:{" "}
              </label>
              <input
                type="password"
                id="restaurantPsw"
                name="restaurantPsw"
                value={formData.password}
                onChange={(e) => {
                  const passwordvalid = e.target.value;
                  setFormData({ ...formData, password: passwordvalid });
                  if (passwordvalid.length < 6) {
                    setPasswordVaidate("Password Should be 6 Character Long");
                  } else {
                    setPasswordVaidate("");
                  }
                }}
                placeholder="Enter Password"
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              />
              {passwordValidate && (
                <p className="text-red-600 text-sm font-bold ">
                  {passwordValidate}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-start w-full md:w-[50%]">
              <label htmlFor="restaurantName" className="font-bold">
                Confirm Password:{" "}
              </label>
              <input
                type="password"
                id="restaurantPsw"
                name="restaurantPsw"
                value={formData.confirmpassowrd}
                onChange={(e) =>
                  setFormData({ ...formData, confirmpassowrd: e.target.value })
                }
                placeholder="Enter Confirm Password"
                className="p-2 rounded-md border-2 border-orange-500 w-full"
              />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-orange-500 hover:text-orange-500 hover:bg-transparent transition-all duration-500 hover:border-orange-500 hover:border font-bold text-lg text-white p-2 rounded-lg"
          >
            Sign Up
          </button>
          <span className="text-black text-sm mb-[-20px]">
            Already Have A Account,
            <Link href="/login">
              {" "}
              <span className="text-orange-500 shadow-orange text-md font-bold cursor-pointer">
                Login Here &rarr;
              </span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
