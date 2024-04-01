"use client";

import { createContext, Context } from "react";

interface LoginContextType {
  login: boolean;
  restaurantname: string;   
  ownername: string;
}

const LoginContext: Context<LoginContextType> = createContext<LoginContextType>(
  {
    login: false,
    restaurantname: "",
    ownername: "",
  }
);

export default LoginContext;
