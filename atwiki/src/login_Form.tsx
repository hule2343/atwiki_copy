import React, { useContext, useState } from "react";
import { axios } from "./Http";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./LoginContext";

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

  const { loginUser, setUser } = useContext(UserContext);

  const [error, setError] = useState<string>("");

  const onSubmit = (data: loginForm): void => {
    axios
      .post(
        "/login",
        {
          username: data.username,
          password: data.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setUser(res.data);
        navigate("/");
      })
      .catch((error) => {
        setError("ログインに失敗しました");
        if (error.response) {
          console.log(error);
        }
      });
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
      <p>{error}</p>
    </div>
  );
};
