import { format } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { axios, discordUrl } from "./Http";

type UserForm = {
  name: string;
  email: string;
  phonenumber: string;
  password: string;
  is_student: boolean;
};

export const CreateUserForm = () => {
  const history = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>();

  const [is_student, setBoolean] = useState(false);

  const onSubmit = (data: UserForm): void => {
    axios
      .post("/register", {
        name: data.name,
        email: data.email,
        phonenumber: data.phonenumber != null ? data.phonenumber : "未登録",
        password: data.password,
        is_student: is_student,
      })
      .then(() => {
        leaveSingupLog(data.name);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
  };

  const handleIs_student = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoolean(e.target.checked);
  };

  const leaveSingupLog = async (name: string) => {
    const now = new Date();
    const date = format(now, "yyyy/MM/dd_HH:mm:ss");
    const title = `${name}さんがatwikiに登録されました`;
    await axios.post("/logs/log", {
      date: date,
      title: title,
    });
    await axios.post(discordUrl, {
      content: `${title}`,
    });
    history("/");
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-4 align-self-center border border-2 rounded-3 shadow p-5"
        >
          <h1 className="mb-5 fw-bold">Sign up</h1>
          <div className="mt-2">
            <label htmlFor="name" className="form-label">
              名前
            </label>
            <input
              id="name"
              className="form-control"
              {...register("name", { required: true })}
            />
            {errors.name && <div className="text-danger">必須項目です</div>}
          </div>
          <div className="mt-2">
            <label htmlFor="email" className="form-label">
              メールアドレス
            </label>
            <input
              id="email"
              className="form-control"
              {...register("email", { required: true })}
            />
            {errors.name && <div className="text-danger">必須項目です</div>}
          </div>
          <div className="mt-2">
            <label htmlFor="phonenumber" className="form-label">
              電話番号
            </label>
            <input
              id="phonenumber"
              className="form-control"
              {...register("phonenumber")}
            />
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
          </div>
          <div className="mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={handleIs_student}
            />
            <label className="form-check-label ms-2">学生</label>
          </div>
          <button type="submit" className="btn btn-outline-primary mt-3">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};
