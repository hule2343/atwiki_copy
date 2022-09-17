import React, { useState } from "react";
import axiosBase from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const axios = axiosBase.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 2000,
  responseType: "json",
});
type loginForm = {
  username: string;
  password: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginForm>();

  const onSubmit = (data: loginForm): void => {
    axios
      .post("/login", {
        name: data.username,
        password: data.password,
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    navigate("/");
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">名前</label>
          <input id="name" {...register("username", { required: true })} />
          {errors.username && <div>必須項目です</div>}
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input id="password" {...register("password", { required: true })} />
          {errors.password && <div>必須項目です</div>}
        </div>
        <button type="submit"></button>
      </form>
    </div>
  );
};
