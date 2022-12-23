import { format } from "date-fns";
import React, { useContext } from "react";
import { Form, PreviousLogData, TableCell, axios, discordUrl } from "./Http";
import { UserContext } from "./LoginContext";

type EditTableProps = {
  id: number;
  data: "task" | "email" | "name" | "phonenumber";
  setLog: () => void;
  notify: (status: string) => void;
};

export const Editable = (props: EditTableProps) => {
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
              text: response.data.task ? response.data.task : "",
            }));
            setLogData({
              name: response.data.name,
              previousData: response.data.task,
            });

            break;
          case "email":
            setInput((state) => ({
              ...state,
              text: response.data.email,
            }));
            setLogData({
              name: response.data.name,
              previousData: response.data.email,
            });
            break;
          case "name":
            setInput((state) => ({
              ...state,
              text: response.data.name,
            }));
            setLogData({
              name: response.data.name,
              previousData: response.data.name,
            });
            break;
          case "phonenumber":
            setInput((state) => ({
              ...state,
              text: response.data.phonenumber,
            }));
            setLogData({
              name: response.data.name,
              previousData: response.data.phonenumber,
            });
            break;
        }
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

    if (logData.previousData !== input.text) {
      let data_label = "";
      switch (props.data) {
        case "task":
          data_label = "進捗状況";
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
          data_label = "メールアドレス";
          axios
            .patch("/users/" + props.id, { email: input.text })
            .then((res) => {
              console.log(loginUser.email);
              setUser(res.data);
            })
            .catch((error) => {
              if (error.response) {
                console.log(error);
              }
            });
          break;
        case "name":
          data_label = "名前";
          axios
            .patch("/users/" + props.id, { name: input.text })
            .then((res) => {
              console.log(loginUser.name);
              setUser(res.data);
            })
            .catch((error) => {
              if (error.response) {
                console.log(error);
              }
            });
          break;
        case "phonenumber":
          data_label = "電話番号";
          axios
            .patch("/users/" + props.id, { phonenumber: input.text })
            .then((res) => {
              console.log(loginUser.phonenumber);
              setUser(res.data);
            })
            .catch((error) => {
              if (error.response) {
                console.log(error);
              }
            });
          break;
      }
      leaveLog(
        logData.name,
        data_label,
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

export const leaveLog = (
  userName: string,
  type: string,
  previousData: string,
  changedData: string,
  setLog: () => void,
  notify: (status: string) => void
) => {
  let now = new Date();
  let date = format(now, "yyyy/MM/dd_HH:mm:ss");
  if (previousData === "") {
    previousData = "なし";
  }
  if (changedData === "") {
    changedData = "なし";
  }
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
