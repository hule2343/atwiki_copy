import React, { useContext, useState } from "react";
import { axios } from "./Http";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./LoginContext";
import { LoginSetContext } from "./LoginContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

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

  const [shown, setPasswordShown] = useState(false);

  const eye = <FontAwesomeIcon icon={faEye} />;

  const togglePasswordVisiblity = () => {
    setPasswordShown(!shown);
  };

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
          .get("is_login", { withCredentials: true })
          .then((response) => {
            console.log(response.data.is_login, "is_login_result");
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
          console.log(error.response);
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
            type={shown ? "text" : "password"}
            {...register("password", {
              required: "パスワードを入力してください",
            })}
          />
          <i onClick={togglePasswordVisiblity}>{eye}</i>
          {errors.password && errors.password.message}{" "}
        </div>
        <button type="submit" className="btn btn-outline-primary mt-2">
          Login
        </button>
      </form>
      <p>{error}</p>
    </div>
  );
};
