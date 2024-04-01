"use client";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
const ServicePage = () => {
  return (
    <div className="font-[Poppins] flex flex-col ">
      <Navbar />
      <div className="relative h-1/3 w-full">
        <img
          className="w-full h-[500px] rounded-3xl p-2 filter opacity-90 "
          src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg   "
          alt=""
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
          <p className="text-white font-bold text-[60px]  italic m-auto text-center">
            SERVICES
          </p>
          <div className="flex flex-row items-center mb-16 justify-center">
            <p className="text-sm font-bold text-red-600 underline-offset-2 p-2">
              <Link href="/">Home /</Link>
            </p>
            <p className="text-sm text-white font-bold underline-offset-2 p-2">
              Service
            </p>
          </div>
        </div>
      </div>
      <div className="h-1/3 w-full">
        <Services />
      </div>
      <div className="h-1/3 w-full mt-2">
        <Footer />
      </div>
    </div>
  );
};

export default ServicePage;
