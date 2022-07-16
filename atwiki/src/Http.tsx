import React from "react";
import axios, { AxiosResponse } from "axios";

// モックサーバーのURL　db.json
const membersUrl = "http://localhost:3100/members";
const workdayUrl = "http://localhost:3100/workday";

type Member = {
  id: string;
  name: string;
  address: string;
  task: string;
};

type WorkDay = {
  id: string;
  day: string;
  place: string;
  rest: Member[];
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

export const WorkDayList: React.FC = () => {
  const [workdays, setWork] = React.useState<WorkDay[]>([]);

  React.useEffect(() => {
    axios.get(workdayUrl).then((response) => {
      setWork(response.data);
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
              {workday.rest.map((worker) => (
                <br>{worker.name}</br>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const Log: React.FC = () => {
  return <li></li>;
};
