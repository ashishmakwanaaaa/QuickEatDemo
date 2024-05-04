"use client";

import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import AboutUs from "../components/Aboutus";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import LoginContext from "../LoginState/logincontext";
import { useSelector } from "react-redux";
import { user } from "lib/reducers";
import DashBoard from "./DashBoard";
import ReviewPage from "app/components/Reviews";

const HomePage = () => {
  const user = useSelector((state: user) => state.user.user);

  return (
    <div>
      <Navbar />
      {!user.isActive ? (
        <>
          <Carousel />
          <AboutUs />
          <Services />
          <Contact />
          <ReviewPage />
          <Footer />
        </>
      ) : (
        <DashBoard />
      )}
    </div>
  );
};

export default HomePage;
