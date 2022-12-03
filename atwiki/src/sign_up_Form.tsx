import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  password_repeat: string;
  is_student: boolean;
};

export const CreateUserForm = () => {
  const history = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserForm>({ mode: "onChange" });

  const [is_student, setBoolean] = useState(false);

  const [shown, setPasswordShown] = useState(false);

  const eye = <FontAwesomeIcon icon={faEye} />;
  const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;

  const password = React.useRef({});

  const [resError, setError] = React.useState<string>("");

  password.current = watch("password", "");

  const togglePasswordVisiblity = () => {
    setPasswordShown(!shown);
  };

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
        if (error.response.status === 409) {
          setError("既に登録されているアカウントと重複があります");
        }
        if (error.response) {
          console.log(error.response);
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
      <div className="row justify-content-center my-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="col-4 align-self-center border border-2 rounded-3 shadow p-5"
        >
          <h1 className="mb-5 fw-bold">Sign up</h1>
          <div className="text-danger">{resError}</div>
          <div className="mt-3">
            <label htmlFor="name" className="form-label">
              <span className="text-danger">*</span>名前
            </label>
            <input
              id="name"
              className="form-control"
              placeholder="関技　太郎"
              {...register("name", { required: "必須事項です" })}
            />
            <span className="text-danger">
              {errors.name && errors.name.message}
            </span>
          </div>
          <div className="mt-3">
            <label htmlFor="email" className="form-label">
              <span className="text-danger">*</span>メールアドレス
            </label>
            <input
              id="email"
              className="form-control"
              placeholder="kangi@email.com"
              {...register("email", {
                required: "必須項目です",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "有効なアドレスを入力してください",
                },
              })}
            />
            <span className="text-danger">
              {errors.email && errors.email.message}
            </span>
          </div>
          <div className="mt-3">
            <label htmlFor="phonenumber" className="form-label">
              電話番号
            </label>
            <input
              id="phonenumber"
              className="form-control"
              placeholder="000-0000-0000"
              {...register("phonenumber")}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="password" className="form-label">
              <span className="text-danger">*</span>パスワード
            </label>
            <div className="input-group">
              <input
                id="password"
                className="form-control"
                type={shown ? "text" : "password"}
                placeholder={"６文字以上"}
                {...register("password", {
                  required: "必須項目です",
                  minLength: { value: 6, message: "6文字以上入力してください" },
                })}
                autoComplete="new-password"
              />
              <span
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisiblity}
              >
                {shown ? eyeSlash : eye}
              </span>
            </div>
            <span className="text-danger">
              {errors.password && errors.password.message}
            </span>
          </div>
          <div className="mt-2">
            <label htmlFor="password_repeat" className="form-label mt-2">
              <span className="text-danger">*</span>パスワード確認用
            </label>
            <div className="input-group">
              <input
                id="password_repeat"
                className="form-control"
                type={shown ? "text" : "password"}
                {...register("password_repeat", {
                  required: "必須項目です",
                  validate: (value) =>
                    value === password.current || "パスワードが一致しません",
                })}
                autoComplete="new-password"
              />
              <span
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisiblity}
              >
                {shown ? eyeSlash : eye}
              </span>
            </div>
            <span className="text-danger">
              {errors.password_repeat && errors.password_repeat.message}
            </span>
          </div>
          <div className="mt-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={handleIs_student}
            />
            <label className="form-check-label ms-2">学生</label>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-3">
            <button type="submit" className="btn btn-outline-primary">
              Sign up
            </button>
            <span>
              <span className="text-danger">*</span>は必須項目です
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
