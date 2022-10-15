import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { axios } from "./Http";

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
      .post(
        "/login",
        {
          username: data.username,
          password: data.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
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
    </div>
  );
};
