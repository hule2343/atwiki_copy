import React, { useState } from "react";
import { User } from "./Http";

type LoginContextType = {
  is_login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

type LoginUserType = {
  loginUser: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};
type Props = {
  children: React.ReactNode;
};

export const LoginContext = React.createContext({} as LoginContextType);
export const UserContext = React.createContext({} as LoginUserType);

export const LoginManager: React.FC<Props> = ({ children }) => {
  const [is_login, setLogin] = useState<boolean>(false);
  const [loginUser, setUser] = useState<User>();

  const value = {
    is_login,
    setLogin,
  };

  const user = {};

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};
