import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosStatic } from "axios";
import { Editable } from "../Editable";
import { User, discordUrl } from "../Http";
import { UserContext } from "../LoginContext";

type EditTableProps = {
  id: number;
  data: "task" | "email" | "name" | "phonenumber";
  setLog: () => void;
  notify: (status: string) => void;
};

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<AxiosStatic>;

const mockedSetLog = jest.fn();
const mockedNotify = jest.fn();

const dummyUser: User = {
  id: 0,
  name: "kangi",
  email: "kangi@kangi3d.com",
  phonenumber: "0745-78-5388",
  task: "previous",
  absent: "",
  is_student: false,
};

const dummyLoginUser = {
  loginUser: dummyUser,
  setUser: () => {},
};

const EditTableDummyProps: EditTableProps = {
  id: 0,
  data: "task",
  setLog: mockedSetLog,
  notify: mockedNotify,
};

describe("Editable", () => {
  test("render", async () => {
    mockedAxios.get.mockResolvedValue({ data: dummyUser });
    render(
      <UserContext.Provider value={dummyLoginUser}>
        <Editable
          id={EditTableDummyProps.id}
          data={EditTableDummyProps.data}
          setLog={EditTableDummyProps.setLog}
          notify={EditTableDummyProps.notify}
        />
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument;
      expect(screen.getByText("編集")).toBeInTheDocument;
      expect(screen.getByText("previous")).toBeInTheDocument;
    });
  });
  test("when the button is clicked, button name is changed", async () => {
    mockedAxios.get.mockResolvedValue({ data: dummyUser });
    render(
      <UserContext.Provider value={dummyLoginUser}>
        <Editable
          id={EditTableDummyProps.id}
          data={EditTableDummyProps.data}
          setLog={EditTableDummyProps.setLog}
          notify={EditTableDummyProps.notify}
        />
      </UserContext.Provider>
    );
    userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument;
      expect(screen.getByText("保存")).toBeInTheDocument;
    });
  });
  test("value is changed", async () => {
    mockedAxios.get.mockResolvedValue({ data: dummyUser });
    const changedUser = dummyUser;
    changedUser.task = "new";
    mockedAxios.patch.mockResolvedValue({ data: changedUser });
    mockedAxios.post.mockResolvedValue({});
    render(
      <UserContext.Provider value={dummyLoginUser}>
        <Editable
          id={EditTableDummyProps.id}
          data={EditTableDummyProps.data}
          setLog={EditTableDummyProps.setLog}
          notify={EditTableDummyProps.notify}
        />
      </UserContext.Provider>
    );
    userEvent.click(screen.getByRole("button"));
    userEvent.type(screen.getByRole("textbox"), "new");
    userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByText("new")).toBeInTheDocument;
      expect(screen.queryByText("previous")).toBeNull;
      expect(mockedAxios.patch).toHaveBeenCalledWith("/users/0", {
        task: "new",
      });
      expect(mockedAxios.post.mock.calls[0][0]).toBe("/logs/log");
      expect(mockedAxios.post.mock.calls[1][0]).toBe(discordUrl);
      expect(mockedSetLog).toHaveBeenCalledTimes(1);
      expect(mockedNotify).toHaveBeenCalledWith("success");
    });
  });
});
