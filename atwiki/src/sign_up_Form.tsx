import { format } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { axios, discordUrl } from "./Http";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { response } from "express";

type UserForm = {
  name: string;
  email: string;
  phonenumber: string;
  password: string;
  password_repeat: string;
  is_student: boolean;
};

type Log = {
  id: number;
  url: string;
  date: string;
  title: string;
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
    const date = format(now, "yyyy/MM/dd");
    const logData: Log = await axios.get("/logs");
    const url = `http://localhost:3001/logs/${logData.id + 1}`;
    const title = `${name}さんがatwikiに登録されました`;

    await axios.post("/logs/log", {
      date: date,
      url: url,
      title: title,
    });
    await axios.post(discordUrl, {
      content: `${title}`,
    });
    history("/");
  };

  return (
    <div>
      <div>
        <span style={{ color: "red" }}>*</span>は必須項目です
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="ms-3">
        <div className="mt-2">
          <label htmlFor="name" className="form-label">
            <span style={{ color: "red" }}>*</span>名前
          </label>
          <input
            id="name"
            className="form-control w-auto"
            placeholder="関技　太郎"
            {...register("name", { required: "必須事項です" })}
          />
          {errors.name && errors.name.message}
        </div>
        <div className="mt-2">
          <label htmlFor="email" className="form-label">
            <span style={{ color: "red" }}>*</span>メールアドレス
          </label>
          <input
            id="email"
            className="form-control w-auto"
            placeholder="kangi@email.com"
            {...register("email", {
              required: "必須項目です",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "有効なアドレスを入力してください",
              },
            })}
          />
          {errors.email && errors.email.message}
        </div>
        <div className="mt-2">
          <label htmlFor="phonenumber" className="form-label">
            電話番号
          </label>
          <input
            id="phonenumber"
            className="form-control w-auto"
            placeholder="000-0000-0000"
            {...register("phonenumber")}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="password" className="form-label">
            <span style={{ color: "red" }}>*</span>パスワード
          </label>
          <input
            id="password"
            className="form-control w-auto"
            type={shown ? "text" : "password"}
            placeholder={"６文字以上"}
            {...register("password", {
              required: "必須項目です",
              minLength: { value: 6, message: "6文字以上入力してください" },
            })}
          />

          {errors.password && errors.password.message}
        </div>
        <div className="mt-2">
          <label htmlFor="password_repeat" className="form-label">
            <span style={{ color: "red" }}>*</span>パスワード確認用
          </label>
          <input
            id="password_repeat"
            className="form-control w-auto"
            type={shown ? "text" : "password"}
            {...register("password_repeat", {
              required: "必須項目です",
              validate: (value) =>
                value === password.current || "パスワードが一致しません",
            })}
          />
        </div>
        {errors.password_repeat && errors.password_repeat.message}
        <i onClick={togglePasswordVisiblity}>{eye}</i>
        <div className="mt-2">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={handleIs_student}
          />
          <label className="form-check-label ms-2">学生</label>
        </div>

        <button type="submit" className="btn btn-outline-primary mt-2">
          Sign up
        </button>
      </form>
      <div>{resError}</div>
    </div>
  );
};
