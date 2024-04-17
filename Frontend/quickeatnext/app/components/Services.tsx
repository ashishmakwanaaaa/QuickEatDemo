"use client";

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Services = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  return (
    <div className="h-full font-[Poppins] w-full mx-auto p-8 flex flex-col gap-4 items-center  drop-shadow-lg rounded-3xl bg-stone-800 ">
      <p
        className="font-bold  text-6xl text-center text-orange-600  "
        data-aos="zoom-in"
      >
        Our Services
      </p>
      <div className="bg-orange-900 h-2 w-56 rounded"></div>

      <div className="flex md:flex-row sm:flex-col  gap-10 w-full justify-center h-full items-center ">
        {/* Service 1 */}
        <div
          data-aos="fade-right"
          className="w-[500px] h-[430px]  p-1 flex flex-col items-center gap-[4rem] border-b-8 pr-8 rounded-2xl border-orange-400 mt-5 hover:bg-gradient-to-t from-transparent to-orange-500 transition duration-300 hover:scale-105"
        >
          <img
            className="w-40 h-50 rounded-full drop-shadow-2xl"
            src="https://icones.pro/wp-content/uploads/2022/07/icones-d-administration-orange.png"
          />
          <div className="ml-3">
            <p className="font-bold text-xl text-orange-500  ">
              Customer Management
            </p>
            <p className=" mt-5 text-white font-normal mb-2">
              Efficiently manage customer records, preferences, and order
              history for a personalized dining experience.
            </p>
          </div>
        </div>

        {/* Service 2 */}
        <div
          data-aos="fade-up"
          className="flex w-[500px] p-1 items-center gap-[4rem] flex-col border-b-8 pr-8 rounded-2xl border-blue-500 mt-8 hover:bg-gradient-to-t from-transparent to-blue-500 transform duration-300"
        >
          <img
            className="w-30 h-40 rounded-full drop-shadow-2xl"
            src="http://www.newdesignfile.com/postpic/2011/07/local-food-icon_63633.png"
          />
          <div className="ml-3">
            <p className="font-bold text-xl text-blue-500  ">Food Management</p>
            <p className="font-normal  mt-5 text-white mb-10">
              Organize your menu items and categories, update availability, and
              showcase enticing dishes to enhance customer satisfaction.
            </p>
          </div>
        </div>

        <div
          data-aos="fade-down"
          className="w-[500px]  flex flex-col  items-center gap-12  border-b-8 pr-8 rounded-2xl border-green-500 mt-12 hover:bg-gradient-to-t from-transparent to-green-500 transition duration-700"
        >
          <img
            className="w-40 h-50 rounded-full drop-shadow-2xl"
            src="https://png.pngtree.com/png-vector/20220628/ourmid/pngtree-pay-tax-icon-green-logo-png-image_5550560.png"
          />
          <div className="ml-3">
            <p className="font-bold text-xl text-green-500  ">
              Secure Payments
            </p>
            <p className="font-normal  mt-5 text-white mb-6">
              Offer customers peace of mind with secure online payment options,
              ensuring a seamless and trustworthy transaction process.
            </p>
          </div>
        </div>

        {/* Service 2 */}
        <div
          data-aos="fade-left"
          className="flex w-[500px] items-center gap-8 flex-col border-b-8 pr-8 rounded-2xl border-red-500 mt-12 hover:bg-gradient-to-t from-transparent to-red-500 transition duration-300"
        >
          <img
            className="w-30 h-40 rounded-full drop-shadow-2xl"
            src="https://www.ezurs.com/wp-content/themes/ezurs/images/new/icon-big-data-analytics.svg"
          />
          <div className="ml-3">
            <p className="font-bold text-xl text-red-500  ">Data Analytics</p>
            <p className="font-normal  mt-5 text-white mb-8">
              Harness the power of data analytics to gain valuable insights into
              customer behavior, optimize operations, and drive business growth.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-10 w-full justify-center h-full items-center ">
        {/* Service 1 */}
      </div>
    </div>
  );
};

export default Services;
