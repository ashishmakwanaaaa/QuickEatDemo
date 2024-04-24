"use client";

import React, { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 1300,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  return (
    <div className="mb-10 flex flex-col md:flex-row font-[Poppins]">
      <div className="px-5 py-3 mt-10 md:mt-10 ml-10 rounded-xl relative w-full md:w-1/2 shadow-2xl">
        <p
          className="font-bold text-4xl md:text-5xl text-orange-500 mb-4 ml-12"
          data-aos="fade-right"
        >
          Who We Are
        </p>

        <div className="relative flex flex-col ml-10">
          <p
            className="text-lg md:text-xl mb-6 text-orange-500 pl-4 font-bold"
            data-aos="fade-right"
          >
            &rarr; QuickEat is on a mission to redefine your dining experience.
            We're passionate about delivering delightful culinary experiences
            right to your doorstep.
          </p>
          <p
            className="text-lg md:text-xl mb-6 text-black pl-4 font-bold"
            data-aos="fade-right"
          >
            &rarr; Our dedication to customer satisfaction drives everything we
            do. From our user-friendly ordering system to our reliable delivery
            services, we strive to exceed your expectations.
          </p>
          <p
            className="text-lg md:text-xl text-orange-500 pl-4 font-bold"
            data-aos="fade-right"
          >
            &rarr; Join us on this gastronomic journey where every bite tells a
            story, and every order is an opportunity to share the joy of good
            food.
          </p>
        </div>
      </div>
      <div className="ml-0 md:ml-16 mt-10 md:mt-10" data-aos="fade-left">
        <img
          className="w-full md:w-96 h-auto md:h-96 mt-10 md:mt-0 transform transition-transform duration-300 hover:scale-105 rounded-xl"
          src="https://www.shutterstock.com/image-illustration/group-stylized-orange-people-stand-260nw-163098557.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default AboutUs;
