import React, { useContext, useEffect } from "react";
import axiosBase from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { LoginForm } from "./login_Form";
import { useNavigate } from "react-router";
import { response } from "express";
import { LoginContext, UserContext } from "./LoginContext";

// モックサーバーのURL　db.json
//const "/users" = "http://localhost:3100/members";
//const logUrl = "http://localhost:3100/log";

export const axios = axiosBase.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 2000,
  responseType: "json",
});

export type User = {
  id: number;
  name: string;
  email: string;
  phonenumber: string;
  task: string;
  absent: string;
  is_student: boolean;
};

type Log = {
  id: number;
  url: string;
  date: string;
};

type Form = {
  id: number;
  text: string;
  enable: boolean;
};

type DayForm = {
  id: number;
  date: string | null;
  enable: boolean;
};

const EditForm = (props: { id: number }) => {
  const { loginUser, setUser } = useContext(UserContext);

  axios.get("/users", { params: { id: props.id } });

  const [input, setInput] = React.useState<Form>({
    id: props.id,
    text: "",
    enable: false,
  });

  React.useEffect(() => {
    axios
      .get("/users/users/" + props.id)
      .then((response) => {
        console.log("got user", response.data);
        setInput((state) => ({
          ...state,
          text: response.data.task,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.id]);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setInput((state) => ({
      ...state,
      text: input.text,
      enable: !input.enable,
    }));

    axios
      .patch("/users/" + props.id, {
        task: input.text,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    leaveLog("/users");
  };

  const handleInput = (e: React.MouseEvent) => {
    e.preventDefault();
    setInput((state) => ({
      ...state,
      enable: !input.enable,
    }));
  };

  return loginUser.id === props.id ? (
    <div>
      <form>
        {input.enable ? (
          <div>
            <input
              onChange={(e) => {
                setInput((state) => ({ ...state, text: e.target.value }));
              }}
              type="text"
              value={input.text}
            />
            <button onClick={handleSubmit}>保存</button>
          </div>
        ) : (
          <div>
            <span>{input.text}</span>
            <span>
              <button onClick={handleInput}>編集</button>
            </span>
          </div>
        )}
      </form>
    </div>
  ) : (
    <div>
      <span>{input.text}</span>
    </div>
  );
};

const EditDate = (props: { id: number }) => {
  const { loginUser, setUser } = useContext(UserContext);

  const [date, setDate] = React.useState<DayForm>({
    id: props.id,
    date: "",
    enable: false,
  });

  React.useEffect(() => {
    axios.get("/users", { params: { id: props.id } }).then((response) => {
      setDate((state) => ({ ...state, date: response.data[0].absent }));
    });
  }, [props.id]);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate((state) => ({ ...state, enable: !date.enable }));
    axios
      .patch("/users/" + props.id, {
        absent: date.date,
      })
      .then(() => {
        setDate((state) => ({ ...state, date: date.date }));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    leaveLog("/users");
  };

  const handleInput = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate((state) => ({ ...state, enable: !date.enable }));
  };

  const handleChange = (date: Date) => {
    const stringDate = format(date, "yyyy/MM/dd");
    setDate((state) => ({ ...state, date: stringDate }));
  };

  return loginUser.id === props.id ? (
    <div>
      <form>
        {date.enable ? (
          <div>
            <label>
              <i className="calendar alternate outline icon"></i>
            </label>
            <DatePicker onChange={handleChange} />
            <button onClick={handleSubmit}>保存</button>
          </div>
        ) : (
          <div>
            {date.date != null ? <span>{date.date}</span> : <span></span>}
            <button onClick={handleInput}>編集</button>
          </div>
        )}
      </form>
    </div>
  ) : (
    <div>{date.date != null ? <span>{date.date}</span> : <span></span>}</div>
  );
};

export const MemberList: React.FC = () => {
  const [members, setMembers] = React.useState<User[]>([]);

  React.useEffect(() => {
    axios.get("/users").then((response) => {
      setMembers(response.data);
    });
  }, []);

  const students = members.filter((members) => {
    return members.is_student === true;
  });

  return (
    <div>
      <table border={1}>
        <thead>
          <tr>
            <th>名前</th>
            <th>欠席予定</th>
            <th>進捗状況</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <EditDate id={student.id} />
              </td>
              <td>
                <EditForm id={student.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table border={1}>
        <thead>
          <tr>
            <th>名前</th>
            <th>連絡</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const leaveLog = (url: string) => {
  let now = new Date();
  let date = format(now, "yyyy/MM/dd");
  axios.post("/logs/log", { url: url, date: date });
};

export const Loglist: React.FC = () => {
  const [logs, setLog] = React.useState<Log[]>([]);

  React.useEffect(() => {
    axios.get("/logs").then((response) => {
      setLog(response.data);
    });
  }, []);

  return (
    <div>
      <h3>更新履歴</h3>
      <h4>
        {logs.map((log) => (
          <div>
            <li key={log.id}>{log.date}</li>
            <a href={log.url}>編集箇所</a>
          </div>
        ))}
      </h4>
    </div>
  );
};

export const Home: React.FC = () => {
  const { is_login, setLogin } = React.useContext(LoginContext);
  const { loginUser, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    axios
      .post("/logout", { withCredentials: true })
      .then((response) => {
        setLogin(response.data.is_login);
        console.log("logout response data", response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log("logout failed");
          console.log(error);
        }
      });
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleLogout}>ログアウト</button>
      <div>
        <MemberList />
      </div>
      <div>
        <Loglist />
      </div>
    </div>
  );
};

export const createUser = () => {};
