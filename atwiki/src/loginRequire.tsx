import React from "react";
import { Navigate } from "react-router-dom";
import { LoginContext, UserContext } from "./LoginContext";
type LoginRequiredType = {
  component: React.ReactNode;
};

export const LoginRequire: React.FC<LoginRequiredType> = (props) => {
  const { loginUser } = React.useContext(UserContext);
  console.log("is_login", loginUser);
  return loginUser.id ? <>{props.component}</> : <Navigate to={"/login"} />;
};
