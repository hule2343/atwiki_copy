import React, { useContext, useEffect } from "react";
import axiosBase from "axios";
import { format } from "date-fns";
import { Accordion } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
// discordのWebhook URL (test server)
export const discordUrl =
  "https://discord.com/api/webhooks/1018031676632342538/dnLwhYYOt_U14Nj_3mmevObgBiJR3K9MIqNdsftTcO9R-BXjC1vPEUEVwH6v_uV4nWNF";

let logId = 0;

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
  title: string;
};

type PreviousLogData = {
  name: string;
  previousData: string;
};

type Form = {
  id: number;
  text: string;
  enable: boolean;
};

type DayForm = {
  id: number;
  date: string | undefined;
  enable: boolean;
};

const EditForm = (props: { id: number }) => {
  const { loginUser, setUser } = useContext(UserContext);

  axios.get(`/users/${props.id}`);
  const [input, setInput] = React.useState<Form>({
    id: props.id,
    text: "",
    enable: false,
  });
  const [logData, setLogData] = React.useState<PreviousLogData>({
    name: "",
    previousData: "",
  });

  React.useEffect(() => {
    axios
      .get(`/users/${props.id}`)
      .then((response) => {
        console.log("got user", response.data);
        setInput((state) => ({
          ...state,
          text: response.data.task,
        }));
        console.log(response.data);
        setLogData({
          name: response.data.name,
          previousData: response.data.task,
        });
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
    leaveLog(logData.name, "進捗状況", logData.previousData, input.text);
    setLogData((state) => ({ ...state, previousData: input.text }));
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
          <div className="container">
            <div className="row">
              <input
                onChange={(e) => {
                  setInput((state) => ({ ...state, text: e.target.value }));
                }}
                type="text"
                value={input.text}
                className="col-auto me-3"
              />
              <button
                className="btn btn-outline-secondary col-auto"
                onClick={handleSubmit}
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <span className="col-auto me-auto d-flex align-items-center">
                {input.text}
              </span>
              <button
                className="btn btn-outline-primary col-auto"
                onClick={handleInput}
              >
                編集
              </button>
            </div>
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
  const [logData, setLogData] = React.useState<PreviousLogData>({
    name: "",
    previousData: "none",
  });

  let selectDate = date.date ? new Date(date.date) : undefined;

  React.useEffect(() => {
    axios.get(`/users/${props.id}`).then((response) => {
      setDate((state) => ({ ...state, date: response.data.absent }));
      setLogData({
        name: response.data.name,
        previousData: response.data.absent,
      });
    });
  }, [props.id]);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate((state) => ({ ...state, enable: !date.enable }));
    axios
      .patch("/users/" + props.id, {
        date: date.date,
      })
      .then(() => {
        setDate((state) => ({ ...state, date: date.date }));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    leaveLog(
      logData.name,
      "欠席予定日",
      logData.previousData,
      date.date ? date.date : "none"
    );
    setLogData((state) => ({
      ...state,
      previousData: date.date ? date.date : "none",
    }));
  };

  const handleInput = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate((state) => ({ ...state, enable: !date.enable }));
  };

  const handleChange = (date: Date) => {
    const stringDate = format(date, "yyyy/MM/dd");
    selectDate = date;
    setDate((state) => ({ ...state, date: stringDate }));
  };

  return loginUser.id === props.id ? (
    <div>
      <form>
        {date.enable ? (
          <div className="container">
            <div className="row">
              <label>
                <i className="calendar alternate outline icon"></i>
              </label>
              <div className="d-flex align-items-center col-auto me-auto">
                <DatePicker selected={selectDate} onChange={handleChange} />
              </div>
              <button
                className="btn btn-outline-primary col-auto"
                onClick={handleSubmit}
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              {date.date !== undefined ? (
                <span className="col-auto me-auto d-flex align-items-center">
                  {date.date}
                </span>
              ) : (
                <span className="col-auto me-auto"></span>
              )}
              <button
                className="btn btn-outline-primary col-auto"
                onClick={handleInput}
              >
                編集
              </button>
            </div>
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
    <div className="p-4">
      <table className="table table-hover table-bordered align-middle w-auto">
        <thead className="table-light">
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

      <table className="table table-bordered align-middle w-auto">
        <thead className="table-light">
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

const leaveLog = (
  userName: string,
  type: string,
  previousData: string,
  changedData: string
) => {
  let now = new Date();
  let date = format(now, "yyyy/MM/dd");
  const url = `http://localhost:3001/logs/${logId + 1}`;
  const title = `${userName}の${type}が${previousData}から${changedData}に変更`;
  axios
    .post("/logs/log", {
      date: date,
      url: url,
      title: title,
    })
    .then((response) => {
      axios.post(discordUrl, {
        content: `${title}`,
      });
    })
    .catch((error: Error) => {
      console.log(error.message);
    });
};

export const Loglist: React.FC = () => {
  const [logs, setLog] = React.useState<Log[]>([]);

  React.useEffect(() => {
    axios.get("/logs").then((response) => {
      console.log(response.data);
      setLog(response.data);
      logId = response.data.length;
    });
  }, []);

  return (
    <div className="ps-4 pb-4">
      <h3>更新履歴</h3>
      <div className="w-50">
        <Accordion>
          {logs.map((log) => (
            <div key={log.id}>
              <Accordion.Item eventKey={log.id.toString()}>
                <Accordion.Header>{log.date}</Accordion.Header>
                <Accordion.Body>{log.title}</Accordion.Body>
              </Accordion.Item>
            </div>
          ))}
        </Accordion>
      </div>
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
