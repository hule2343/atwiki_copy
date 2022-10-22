import React, { useContext, useState } from "react";
import { axios } from "./Http";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./LoginContext";
import { LoginSetContext } from "./LoginContext";

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
  const setLogin = useContext(LoginSetContext);

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
      .then((response) => {
        setUser(response.data);
        axios
          .get("is_login")
          .then((response) => {
            setLogin(response.data.is_login);
          })
          .then((res) => {
            navigate("/");
          });
      })
      .catch((error) => {
        setError("ログインに失敗しました");
        console.log(error);
        if (error.response) {
        }
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="ms-3">
        <div>
          <label htmlFor="name" className="form-label">
            名前
          </label>
          <input
            id="name"
            className="form-control w-auto"
            {...register("username", { required: true })}
          />
          {errors.username && <div>必須項目です</div>}
        </div>
        <div className="mt-2">
          <label htmlFor="password" className="form-label">
            パスワード
          </label>
          <input
            id="password"
            className="form-control w-auto"
            {...register("password", { required: true })}
          />
          {errors.password && <div>必須項目です</div>}
        </div>
        <button type="submit" className="btn btn-outline-primary mt-2">
          Login
        </button>
      </form>
      <p>{error}</p>
    </div>
  );
};
