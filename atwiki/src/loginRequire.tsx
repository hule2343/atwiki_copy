import React, { useEffect, useState } from "react";
import { axios } from "./Http";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
type LoginRequiredType = {
  component: React.ReactNode;
};

export const LoginRequire: React.FC<LoginRequiredType> = (props) => {
  const { is_login, setLogin } = React.useContext(LoginContext);

  React.useEffect(() => {
    axios.get("/is_login", { withCredentials: true }).then((response) => {
      console.log("beforesetLogin", response.data);
      if (response.data.is_login) {
        setLogin(true);
        console.log("useeffect", is_login);
      }
    });
  }, [is_login, setLogin]);
  console.log("is_login", is_login);
  return is_login ? <>{props.component}</> : <Navigate to={"/login"} />;
};
