import axios from "axios";
import React, { useContext } from "react";
import { Form, PreviousLogData, TableCell, discordUrl } from "./Http";
import { UserContext } from "./LoginContext";
import { format } from "date-fns";

let logId = 0;

type data = "task" | "email" | "name" | "phonenumber";

export const Editable = (props: { id: number; data: data }) => {
  const { loginUser, setUser } = useContext(UserContext);

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
        switch (props.data) {
          case "task":
            setInput((state) => ({
              ...state,
              text: response.data.task,
            }));

            break;
          case "email":
            setInput((state) => ({
              ...state,
              text: response.data.email,
            }));
            break;
          case "name":
            setInput((state) => ({
              ...state,
              text: response.data.name,
            }));
            break;
          case "phonenumber":
            setInput((state) => ({
              ...state,
              text: response.data.phonenumber,
            }));
            break;
        }
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
      enable: !input.enable,
    }));
    console.log("handleSubmit", input.text);

    switch (props.data) {
      case "task":
        axios
          .patch("/users/" + props.id, { task: input.text })
          .then((res) => {
            console.log(loginUser.task);
            setUser(res.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error);
            }
          });
        break;
      case "email":
        axios
          .patch("/users/" + props.id, { email: input.text })
          .then((res) => {
            console.log(loginUser.task);
            setUser(res.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error);
            }
          });
        break;
      case "name":
        axios
          .patch("/users/" + props.id, { name: input.text })
          .then((res) => {
            console.log(loginUser.task);
            setUser(res.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error);
            }
          });
        break;
      case "phonenumber":
        axios
          .patch("/users/" + props.id, { phonenumber: input.text })
          .then((res) => {
            console.log(loginUser.task);
            setUser(res.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error);
            }
          });
        break;
    }
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
