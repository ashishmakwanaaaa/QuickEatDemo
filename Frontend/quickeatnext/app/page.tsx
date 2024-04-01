"use client";

import HomePage from "./Pages/HomePage";
import "../app/globals.css";
import LoginContext from "./LoginState/logincontext";
import { useContext } from "react";
import DashBoard from "./Pages/DashBoard";

export default function Home() {
  const StateContext = useContext(LoginContext);
  return <>{!StateContext.login ? <HomePage /> : <DashBoard />}</>;
}
