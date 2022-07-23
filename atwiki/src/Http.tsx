import React from "react";
import axios, { AxiosResponse } from "axios";

// モックサーバーのURL　db.json
const membersUrl = "http://localhost:3100/members";
const workdayUrl = "http://localhost:3100/workday";
const restUrl = "http://localhost:3100/rest";
const logUrl = "http://localhost:3100/log";

type Member = {
  id: number;
  name: string;
  address: string;
  task: string;
};

type WorkDay = {
  id: number;
  day: string;
  place: string;
  rest: Member[];
};

type Log = {
  id: number;
  url: string;
  date: string;
};

export const MemberList: React.FC = () => {
  const [members, setMembers] = React.useState<Member[]>([]);

  React.useEffect(() => {
    axios.get(membersUrl).then((response) => {
      setMembers(response.data);
    });
  }, []);

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>名前</th>
          <th>連絡</th>
          <th>進捗状況・タスク</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member) => (
          <tr key={member.id}>
            <td>{member.name}</td>
            <td>{member.address}</td>
            <td>{member.task}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const applyRest = () => {
  axios.post("http://localhost:3100/rest", { id: 2, name: "ttaira" });
  window.location.reload();
  LeaveLog("http://localhost:3100/rest");
};

const attendWork = () => {
  axios.delete("http://localhost:3100/rest/2");
  window.location.reload();
  LeaveLog("http://localhost:3100/rest");
};

export const WorkDayList: React.FC = () => {
  const [workdays, setWork] = React.useState<WorkDay[]>([]);
  const [rest, setRest] = React.useState<Member[]>([]);

  React.useEffect(() => {
    axios.get(workdayUrl).then((response) => {
      setWork(response.data);
    });
  }, []);

  React.useEffect(() => {
    axios.get(restUrl).then((response) => {
      setRest(response.data);
    });
  }, []);

  return (
    <table border={1}>
      <thead>
        <tr>
          <th>日付</th>
          <th>場所</th>
          <th>欠勤者</th>
        </tr>
      </thead>
      <tbody>
        {workdays.map((workday) => (
          <tr key={workday.id}>
            <td>{workday.day}</td>
            <td>{workday.place}</td>
            <td>
              {rest.map((worker) => (
                <li key={worker.id}>{worker.name}</li>
              ))}
              <button onClick={applyRest}>休む</button>
              <button onClick={attendWork}>出席する</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const LeaveLog = (url: string) => {
  let now = new Date();
  let date = now.toString();
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
