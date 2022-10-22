import React from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
type LoginRequiredType = {
  component: React.ReactNode;
};

export const LoginRequire: React.FC<LoginRequiredType> = (props) => {
  const is_login = React.useContext(LoginContext);
  console.log("is_login", is_login);
  return is_login ? <>{props.component}</> : <Navigate to={"/login"} />;
};
