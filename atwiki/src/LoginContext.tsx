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
  const defaultUser: User = {
    id: 0,
    name: "関技　太郎",
    email: "kangi@kangi3d.com",
    phonenumber: "0745-78-5388",
    task: "",
    absent: "",
    is_student: false,
  };
  const [is_login, setLogin] = useState<boolean>(false);
  const [loginUser, setUser] = useState<User>(defaultUser);

  const value = {
    is_login,
    setLogin,
  };

  const user = {
    loginUser,
    setUser,
  };

  return (
    <LoginContext.Provider value={value}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </LoginContext.Provider>
  );
};
