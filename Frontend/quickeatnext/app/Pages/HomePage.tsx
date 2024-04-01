"use client";

import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import AboutUs from "../components/Aboutus";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import LoginContext from "../LoginState/logincontext";

const HomePage = () => {
  const StateLogin = useContext(LoginContext);

  return (
    <div>
      <Navbar />
      {!StateLogin.login && (
        <>
          <Carousel />
          <AboutUs />
          <Services />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
};

export default HomePage;
