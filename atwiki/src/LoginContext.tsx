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

export const UserContext = React.createContext({} as LoginUserType);
export const LoginContext = React.createContext(false);
export const LoginSetContext = React.createContext((b: boolean) => {});

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
  const strageUser = localStorage.getItem("loginuser");
  const [loginUser, setUser] = useState<User>(
    strageUser ? JSON.parse(strageUser) : {}
  );

  React.useEffect(() => {
    console.log("is_login is changed to " + is_login);
  }, [is_login]);

  React.useEffect(() => {
    localStorage.setItem("loginuser", JSON.stringify(loginUser));
  }, [loginUser]);

  const setLoginInfo = (bool: boolean) => {
    setLogin(bool);
  };

  const user = {
    loginUser,
    setUser,
  };

  return (
    <UserContext.Provider value={user}>
      <LoginSetContext.Provider value={setLoginInfo}>
        <LoginContext.Provider value={is_login}>
          {children}
        </LoginContext.Provider>
      </LoginSetContext.Provider>
    </UserContext.Provider>
  );
};
