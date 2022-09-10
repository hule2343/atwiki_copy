import axios from "axios";
import { format } from "date-fns";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// モックサーバーのURL　db.json
const membersUrl = "http://localhost:3100/members";
const logUrl = "http://localhost:3100/log";

type Member = {
  id: number;
  name: string;
  address: string;
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
  axios.get(membersUrl, { params: { id: props.id } });
  const [input, setInput] = React.useState<Form>({
    id: props.id,
    text: "",
    enable: false,
  });
  React.useEffect(() => {
    axios
      .get(membersUrl, { params: { id: props.id } })
      .then((response) => {
        setInput((state) => ({
          ...state,
          text: response.data[0].task,
        }));
        console.log(response.data);
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
      .patch(membersUrl + "/" + props.id, {
        task: input.text,
      })
      .then(() => {
        console.log("更新完了");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error);
        }
      });
    leaveLog(membersUrl);
  };
  const handleInput = (e: React.MouseEvent) => {
    e.preventDefault();
    setInput((state) => ({
      ...state,
      enable: !input.enable,
    }));
  };

  return (
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
            <button
              className="btn btn-outline-secondary ms-3"
              onClick={handleSubmit}
            >
              保存
            </button>
          </div>
        ) : (
          <div>
            <span>{input.text}</span>
            <button
              className="btn btn-outline-primary ms-3"
              onClick={handleInput}
            >
              編集
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const EditDate = (props: { id: number }) => {
  const [date, setDate] = React.useState<DayForm>({
    id: props.id,
    date: "",
    enable: false,
  });

  let selectDate = date.date ? new Date(date.date) : null;

  React.useEffect(() => {
    axios.get(membersUrl, { params: { id: props.id } }).then((response) => {
      setDate((state) => ({ ...state, date: response.data[0].absent }));
    });
  }, [props.id]);
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setDate((state) => ({ ...state, enable: !date.enable }));
    axios
      .patch(membersUrl + "/" + props.id, {
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
    leaveLog(membersUrl);
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

  return (
    <div>
      <form>
        {date.enable ? (
          <div>
            <label>
              <i className="calendar alternate outline icon"></i>
            </label>
            <div className="d-inline-block">
              <DatePicker selected={selectDate} onChange={handleChange} />
            </div>
            <button
              className="btn btn-outline-primary ms-3"
              onClick={handleSubmit}
            >
              保存
            </button>
          </div>
        ) : (
          <div>
            {date.date != null ? <span>{date.date}</span> : <span></span>}
            <button
              className="btn btn-outline-primary ms-3"
              onClick={handleInput}
            >
              編集
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export const MemberList: React.FC = () => {
  const [members, setMembers] = React.useState<Member[]>([]);
  React.useEffect(() => {
    axios.get(membersUrl).then((response) => {
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
              <td>{member.address}</td>
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
  axios.post("http://localhost:3100/log", { url: url, date: date });
};

export const Loglist: React.FC = () => {
  const [logs, setLog] = React.useState<Log[]>([]);

  React.useEffect(() => {
    axios.get(logUrl).then((response) => {
      setLog(response.data);
    });
  }, []);

  return (
    <div className="ps-4 pb-4">
      <h3>更新履歴</h3>
      <div>
        {logs.map((log) => (
          <div>
            <li key={log.id}>{log.date}</li>
            <a className="ms-4" href={log.url}>
              編集箇所
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
