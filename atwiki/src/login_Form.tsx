import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { axios } from "./Http";
import { LoginSetContext, UserContext } from "./LoginContext";

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
        }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-4 align-self-center border border-2 rounded-3 p-5"
        >
          <h1 className="mb-5 fw-bold">Login</h1>
          <div>
            <label htmlFor="name" className="form-label">
              名前
            </label>
            <input
              id="name"
              className="form-control"
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
              className="form-control"
              {...register("password", { required: true })}
            />
            {errors.password && <div>必須項目です</div>}
          </div>
          <button
            type="submit"
            className="btn btn-outline-primary text-align-left mt-3"
          >
            Login
          </button>
        </form>
        <p>{error}</p>
      </div>
    </div>
  );
};
