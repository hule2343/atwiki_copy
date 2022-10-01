import React, { useState } from "react";
import { axios } from "./Http";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    history("/");
  };

  const handleIs_student = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoolean(e.target.checked);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">名前</label>
          <input id="name" {...register("name", { required: true })} />
          {errors.name && <div>必須項目です</div>}
        </div>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" {...register("email", { required: true })} />
          {errors.name && <div>必須項目です</div>}
        </div>
        <div>
          <label htmlFor="phonenumber">電話番号</label>
          <input id="phonenumber" {...register("phonenumber")} />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input id="password" {...register("password", { required: true })} />
        </div>
        <div>
          <label>学生</label>
          <input type="checkbox" onChange={handleIs_student} />
        </div>
        <button type="submit"></button>
      </form>
    </div>
  );
};
