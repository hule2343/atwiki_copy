import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  const [shown, setPasswordShown] = useState(false);

  const eye = <FontAwesomeIcon icon={faEye} />;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

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
    <div className="container">
      <div className="row justify-content-center mt-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-4 border border-2 rounded-3 shadow p-5"
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
            {errors.username && <div className="text-danger">必須項目です</div>}
          </div>
          <div className="mt-2">
            <label htmlFor="password" className="form-label">
              パスワード
            </label>
            <div className="input-group">
              <input
                id="password"
                className="form-control"
                type={shown ? "text" : "password"}
                {...register("password", {
                  required: "パスワードを入力してください",
                })}
                autoComplete="current-password"
              />
              <span
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisiblity}
              >
                {shown ? eyeSlash : eye}
              </span>
            </div>
            <span className="text-danger">
              {errors.password && errors.password.message}{" "}
            </span>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <button type="submit" className="btn btn-outline-primary">
              Login
            </button>
            <span className="form-text text-danger me-2">{error}</span>
          </div>
        </form>
      </div>
    </div>
  );
};
