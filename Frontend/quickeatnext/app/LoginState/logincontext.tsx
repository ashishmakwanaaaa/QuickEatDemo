"use client";

import { createContext, Context, useReducer, ReactNode } from "react";


interface LoginContextType {
  login: boolean;
  restaurantname: string;
  ownername: string;
  userid: string;
  image?: string;
}


interface LoginProviderProps {
  children: ReactNode;
}
type Action =
  | { type: 'LOGIN'; payload: LoginContextType }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_IMAGE'; payload: string };

const initialState: LoginContextType = {
  login: false,
  restaurantname: "",
  ownername: "",
  userid: "",
  image: ""
};

const loginReducer = (state: LoginContextType, action: Action): LoginContextType => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'LOGOUT':
      return initialState;
    case 'UPDATE_IMAGE':
      return {
        ...state,
        image: action.payload
      };
    default:
      return state;
  }
};

const LoginContext: Context<LoginContextType> = createContext<LoginContextType>(initialState);

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  return (
    <LoginContext.Provider value={{ ...state, dispatch }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
