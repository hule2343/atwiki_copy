import { format } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { axios, discordUrl } from "./Http";

type UserFormType = {
  onSubmit: (data: UserForm) => void;
  handleIs_studnet: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type UserForm = {
  name: string;
  email: string;
  phonenumber: string;
  password: string;
  is_student: boolean;
};

type Log = {
  id: number;
  url: string;
  date: string;
  title: string;
};

export const CreateUserForm: React.FC<UserFormType> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>();

  const onSubmit = props.onSubmit;

  const handleIs_student = props.handleIs_studnet;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="ms-3">
        <div className="mt-2">
          <label htmlFor="name" className="form-label">
            名前
          </label>
          <input
            id="name"
            className="form-control w-auto"
            {...register("name", { required: true })}
          />
          {errors.name && <div>必須項目です</div>}
        </div>
        <div className="mt-2">
          <label htmlFor="email" className="form-label">
            メールアドレス
          </label>
          <input
            id="email"
            className="form-control w-auto"
            {...register("email", { required: true })}
          />
          {errors.name && <div>必須項目です</div>}
        </div>
        <div className="mt-2">
          <label htmlFor="phonenumber" className="form-label">
            電話番号
          </label>
          <input
            id="phonenumber"
            className="form-control w-auto"
            {...register("phonenumber")}
          />
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
        </div>
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
    </div>
  );
};
