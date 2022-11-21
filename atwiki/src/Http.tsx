import axiosBase from "axios";
import { format } from "date-fns";
import React, { useContext } from "react";
import { Accordion } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { Editable } from "./Editable";
import "./Http.css";
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
  date: string;
  title: string;
};

export type PreviousLogData = {
  name: string;
  previousData: string;
};

export type Form = {
  id: number;
  text: string;
  enable: boolean;
};

type DayForm = {
  id: number;
  date: string | undefined;
  enable: boolean;
};

type EditProps = {
  id: number;
  setLog: () => void;
  notify: (status: string) => void;
};

type TabelCellType = {
  cellvalue: string | undefined;
  onClick: (e: React.MouseEvent) => void;
};

export const TableCell = (props: TabelCellType) => {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <span className="me-2">{props.cellvalue}</span>
      <button
        className="btn btn-outline-primary text-nowrap"
        onClick={props.onClick}
      >
        編集
      </button>
    </div>
  );
};

const EditForm = (props: EditProps) => {
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
        setInput((state) => ({
          ...state,
          text: response.data.task ? response.data.task : "",
        }));
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

    if (logData.previousData !== input.text) {
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
      leaveLog(
        logData.name,
        "進捗状況",
        logData.previousData,
        input.text,
        props.setLog,
        props.notify
      );
      setLogData((state) => ({ ...state, previousData: input.text }));
    }
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
          <div className="d-flex align-items-center justify-content-between">
            <input
              onChange={(e) => {
                setInput((state) => ({ ...state, text: e.target.value }));
              }}
              type="text"
              value={input.text}
              className="form-control me-2"
            />
            <button
              className="btn btn-outline-primary text-nowrap"
              onClick={handleSubmit}
            >
              保存
            </button>
          </div>
        ) : (
          <>
            <TableCell cellvalue={input.text} onClick={handleInput} />
          </>
        )}
      </form>
    </div>
  ) : (
    <div>
      <span>{input.text}</span>
    </div>
  );
};

const EditDate = (props: EditProps) => {
  const { loginUser, setUser } = useContext(UserContext);

  const [date, setDate] = React.useState<DayForm>({
    id: props.id,
    date: " ",
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
    if (logData.previousData !== date.date) {
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
        date.date ? date.date : "none",
        props.setLog,
        props.notify
      );
      setLogData((state) => ({
        ...state,
        previousData: date.date ? date.date : "none",
      }));
    }
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
          <div className="d-flex align-items-center">
            <label>
              <i className="calendar alternate outline icon"></i>
            </label>
            <DatePicker
              selected={selectDate}
              onChange={handleChange}
              className="form-control me-auto"
            />
            <button
              className="btn btn-outline-primary text-nowrap ms-2"
              onClick={handleSubmit}
            >
              保存
            </button>
          </div>
        ) : (
          <>
            <TableCell cellvalue={date.date} onClick={handleInput} />
          </>
        )}
      </form>
    </div>
  ) : (
    <div>{date.date != null ? <span>{date.date}</span> : <span></span>}</div>
  );
};

export const MemberList: React.FC = () => {
  const [members, setMembers] = React.useState<User[]>([]);
  const [logs, setLog] = React.useState<Log[]>([]);

  React.useEffect(() => {
    axios.get("/users").then((response) => {
      console.log(response.data);
      setMembers(response.data);
    });
    axios.get("/logs").then((response) => {
      console.log(response.data);
      setLog(response.data);
    });
  }, []);

  const students = members.filter((members) => {
    return members.is_student === true;
  });

  const logSetter = () => {
    axios.get("/logs").then((response) => {
      console.log(response.data);
      setLog(response.data);
    });
  };

  const notify = (status: string) => {
    if (status === "error") {
      toast.error("エラーが発生しました");
    } else if (status === "success") {
      toast.success("保存しました");
    }
  };

  return (
    <div className="container p-4">
      <Toaster position="top-right" />
      <div className="row justify-content-center">
        <div className="col-8 mb-3">
          <h2 className="mb-2 headline">欠席予定と進捗状況</h2>
          <div className="ps-2">
            <table className="table table-hover table-bordered align-middle shadow-sm">
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
                      <EditDate
                        id={student.id}
                        setLog={logSetter}
                        notify={(status) => notify(status)}
                      />
                    </td>
                    <td>
                      <Editable
                        id={student.id}
                        data={"task"}
                        setLog={logSetter}
                        notify={(status) => notify(status)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-8 mb-3">
          <h2 className="mb-2 headline">連絡先</h2>
          <div className="ps-2">
            <table className="table table-bordered align-middle shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>名前</th>
                  <th>連絡</th>
                  <th>電話番号</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <Editable
                        id={member.id}
                        data={"name"}
                        setLog={logSetter}
                        notify={(status) => {
                          notify(status);
                        }}
                      />
                    </td>
                    <td>
                      <Editable
                        id={member.id}
                        data={"email"}
                        setLog={logSetter}
                        notify={(status) => {
                          notify(status);
                        }}
                      />
                    </td>
                    <td>
                      <Editable
                        id={member.id}
                        data={"phonenumber"}
                        setLog={logSetter}
                        notify={(status) => {
                          notify(status);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Loglist logs={logs} />
      </div>
    </div>
  );
};

const leaveLog = (
  userName: string,
  type: string,
  previousData: string,
  changedData: string,
  setLog: () => void,
  notify: (status: string) => void
) => {
  let now = new Date();
  let date = format(now, "yyyy/MM/dd_HH:mm:ss");
  const title = `${userName}の${type}が${previousData}から${changedData}に変更`;
  axios
    .post("/logs/log", {
      date: date,
      title: title,
    })
    .then(() => {
      setLog();
      notify("success");
      axios.post(discordUrl, {
        content: `${title}`,
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        notify("error");
      }
    });
};

export const Loglist: React.FC<{ logs: Log[] }> = ({ logs }) => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-8">
          <h2 className="mb-2 headline">更新履歴</h2>
          <Accordion className="ms-2 shadow-sm">
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
    </div>
  );
};

const TestUserInfo: React.FC = () => {
  const { loginUser, setUser } = useContext(UserContext);

  return (
    <div className="mx-2">
      <ul className="list-unstyled ms-3">
        <li>{loginUser.name}</li>
        <li>{loginUser.email}</li>
      </ul>
    </div>
  );
};

export const Home: React.FC = () => {
  const is_login = React.useContext(LoginContext);
  const { loginUser, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    axios
      .post("/logout", { withCredentials: true })
      .then((response) => {
        localStorage.clear();
        sessionStorage.clear();
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto border-end bg-light">
          <div className="sticky-top">
            <button
              onClick={handleLogout}
              className="btn btn-outline-secondary btn-sm m-2"
            >
              アカウント切り替え
            </button>
            <div>
              <TestUserInfo />
            </div>
          </div>
        </div>
        <div className="col">
          <MemberList />
        </div>
      </div>
    </div>
  );
};

export const createUser = () => {};
