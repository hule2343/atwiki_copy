import React, { useEffect, useState } from "react";
import { axios } from "./Http";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

type LoginRequiredType = {
  children: React.ReactNode;
};

export const LoginRequire: React.FC<LoginRequiredType> = (props) => {
  const [is_login, setLogin] = useState(false);

  React.useEffect(() => {
    axios.get("/is_login").then((response) => {
      setLogin(response.data.is_login);
    });
  });
  return is_login ? <>{props.children}</> : <Navigate to={"/login"} />;
};
