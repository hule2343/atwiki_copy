import React, { useState } from "react";
import { axios } from "./Http";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
      .then((res) => {
        console.log(res);
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
