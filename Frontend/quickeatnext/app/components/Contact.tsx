"use client";

import React, { useEffect, useState } from "react";
import emailjs from "emailjs-com";
import { FaHeadset } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import { SiGmail } from "react-icons/si";
import { FaLocationDot } from "react-icons/fa6";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const Contact: React.FC = () => {
  const serviceid: string | undefined | any = process.env.NEXT_PUBLIC_serviceId;
  const templatedid: string | undefined | any =
    process.env.NEXT_PUBLIC_templateId;
  const userIdforemailjsservice: string | undefined =
    process.env.NEXT_PUBLIC_userId;

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1300,
      easing: "ease-in-out",
      once: true,
    });
  });
  const [formData, setFormData] = useState<{
    from_name: string;
    to_name: string;
    message: string;
  }>({
    from_name: "",
    to_name: "",
    message: "",
  });

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const templateParams = {
      from_name: formData.from_name,
      to_name: formData.to_name,
      message: formData.message,
    };
    if (
      formData.from_name === "" ||
      formData.to_name === "" ||
      formData.message === ""
    ) {
      Swal.fire({
        text: "Please Fill All The Fields",
        icon: "warning",
        timer: 1000,
      });
    } else {
      emailjs
        .send(serviceid, templatedid, templateParams, userIdforemailjsservice)
        .then((response) => {
          console.log("Email sent successfully:", response);

          Swal.fire({
            icon: "success",
            title: "Email Send Successfully",
            showConfirmButton: false,
            timer: 3000,
          });
          setFormData({
            from_name: "",
            to_name: "",
            message: "",
          });
        })
        .catch((error) => {
          console.error("Email sending failed:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            timer: 3000,
          });
        });
    }
  };

  return (
    <div className="w-full h-full p-8 flex flex-col items-center font-[Poppins]">
      <p
        className="font-bold  text-6xl text-center text-orange-500 mb-4 drop-shadow-lg"
        data-aos="zoom-in"
      >
        Contact Us
      </p>
      <div className="p-2 flex justify-between w-full max-w-[1300px] mt-5">
        <div
          className="flex flex-col p-2 w-[45%] space-y-4 my-auto"
          data-aos="fade-right"
        >
          <div className="flex flex-row gap-4">
            <span className="text-xl">Name:</span>
            <input
              className="ml-4 border-2 drop-shadow-lg border-orange-500 w-[80%] h-full p-2 text-orange-500 active:border-orange-500  rounded-md"
              type="text"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              id=""
              placeholder="Enter your name"
            />
          </div>
          <div className="flex flex-row gap-4">
            <span className="text-xl">Email:</span>
            <input
              className="ml-5 border-2 drop-shadow-lg border-orange-500 w-[80%] h-full p-2 text-orange-500 active:border-orange-500  rounded-md"
              type="text"
              name="to_name"
              id=""
              value={formData.to_name}
              onChange={handleChange}
              placeholder="Enter your Email"
            />
          </div>
          <div className="flex flex-row gap-4">
            <span className="text-xl">Subject:</span>
            <textarea
              className="border-2 drop-shadow-lg border-orange-500 w-[80%] h-36 p-2 text-orange-500 active:border-orange-500 rounded-md"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write a message Here"
            ></textarea>
          </div>
          <div className="">
            <button
              className=" drop-shadow-lg bg-orange-600 mt-5 w-full hover:text-white hover:bg-orange-500 text-white py-2 rounded-md transition duration-300"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        <div
          className="flex flex-col w-[50%] text-lg space-y-4 "
          data-aos="fade-left"
        >
          <h1 className="flex items-center gap-2 font-bold text-3xl text-orange-500 tracking-wide mb-2 drop-shadow-lg">
            <FaHeadset />
            Get In Touch
          </h1>
          <p
            className="text-orange-500 text-md md:pr-16  font-bold drop-shadow-lg"
            data-aos="fade-left"
          >
            "Your Feedback Matters, Drop Us a Line and Let's Stay Connected!"
          </p>
          <div className="flex flex-col space-y-3" data-aos="fade-left">
            <div className="flex flex-row space-x-3 text-orange-500 drop-shadow-lg">
              <IoCall />
              &nbsp; &nbsp; +(91)953 751 9367
            </div>
            <div className="flex flex-row spac  e-x-3 drop-shadow-lg text-orange-500">
              <SiGmail />
              &nbsp; &nbsp; quickeatwithus@gmail.com
            </div>
            <div className="flex flex-row space-x-3 drop-shadow-lg text-orange-500">
              <FaLocationDot />
              &nbsp; &nbsp; Surat, Gujarat - India
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
