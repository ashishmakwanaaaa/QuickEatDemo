"use client";
import Link from "next/link";
import AboutUs from "../components/Aboutus";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
const AboutUsPage = () => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <div className="relative h-1/3 w-full">
        <img
          className="w-full rounded-3xl p-2"
          src="https://demos.hogash.com/dannys/wp-content/uploads/sites/4/2017/05/img_07.jpg "
          alt=""
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
          <p className="text-white font-bold text-[60px] m-auto text-center">
            ABOUT US
          </p>
          <div className="flex flex-row items-center mb-10 justify-center">
            <p className="text-sm font-bold text-red-600 underline-offset-2 p-2">
              <Link href="/">Home /</Link>
            </p>
            <p className="text-sm text-white font-bold underline-offset-2 p-2">
              About Us
            </p>
          </div>
        </div>
      </div>
      <div className="h-1/3 w-full">
        <AboutUs />
      </div>
      <div className="h-1/3 w-full mt-8">
        <Footer />
      </div>
    </div>
  );
};

export default AboutUsPage;
