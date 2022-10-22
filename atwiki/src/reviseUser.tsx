import React, { useContext, useEffect, useState } from "react";
import { axios } from "./Http";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { LoginContext } from "./LoginContext";
import { UserContext } from "./LoginContext";

export const ReviseUser: React.FC = () => {
  const { loginUser, setUser } = useContext(UserContext);

  return <div></div>;
};
