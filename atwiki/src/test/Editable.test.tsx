import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Editable } from "../Editable";
import { User, axios, discordUrl } from "../Http";
import { UserContext } from "../LoginContext";

type EditTableProps = {
  id: number;
  data: "task" | "email" | "name" | "phonenumber";
  setLog: () => void;
  notify: (status: string) => void;
};

const mockedAxiosGet = jest.spyOn(axios, "get");
const mockedAxiosPost = jest.spyOn(axios, "post");
const mockedAxiosPatch = jest.spyOn(axios, "patch");

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

describe("Editable general", () => {
  EditTableDummyProps.data = "task";
  test("when the button is clicked, button name is changed", async () => {
    mockedAxiosGet.mockResolvedValue({ data: dummyUser });
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
  test("when the button is pushed without change, axios.post is not called", async () => {
    mockedAxiosGet.mockResolvedValue({ data: dummyUser });
    mockedAxiosPatch.mockResolvedValue({ data: dummyUser });
    mockedAxiosPost.mockResolvedValue({});
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
    userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(mockedAxiosPatch).toHaveBeenCalledTimes(0);
      expect(mockedAxiosPost).toHaveBeenCalledTimes(0);
      expect(mockedSetLog).toHaveBeenCalledTimes(0);
      expect(mockedNotify).toHaveBeenCalledTimes(0);
    });
  });
});

let changedUser = { ...dummyUser };
describe.each([
  ["task", "previous", "new"],
  ["email", "kangi@kangi3d.com", "new@kangi3d.com"],
  ["name", "kangi", "test"],
  ["phonenumber", "0745-78-5388", "0000-00-0000"],
])("Editable each test", (data, old_value, new_value) => {
  beforeEach(() => {
    EditTableDummyProps.data = data as EditTableProps["data"];
  });
  test("render", async () => {
    mockedAxiosGet.mockResolvedValue({ data: dummyUser });
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
      expect(screen.getByText(old_value)).toBeInTheDocument;
    });
  });
  test("value is changed", async () => {
    mockedAxiosGet.mockResolvedValue({ data: dummyUser });
    switch (data) {
      case "task":
        changedUser.task = new_value;
        break;
      case "email":
        changedUser.email = new_value;
        break;
      case "name":
        changedUser.name = new_value;
        break;
      case "phonenumber":
        changedUser.phonenumber = new_value;
        break;
    }
    mockedAxiosPatch.mockResolvedValue({ data: changedUser });
    mockedAxiosPost.mockResolvedValue({});
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
      expect(screen.getByText(old_value)).toBeInTheDocument;
    });
    userEvent.click(screen.getByRole("button"));
    const textBox = screen.getByRole("textbox") as HTMLInputElement;
    userEvent.clear(textBox);
    userEvent.type(textBox, new_value);
    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText(new_value)).toBeInTheDocument;
      expect(mockedAxiosPatch).toHaveBeenCalledWith("/users/0", {
        [data]: new_value,
      });
      expect(mockedAxiosPost.mock.calls[0][0]).toBe("/logs/log");
      expect(mockedAxiosPost.mock.calls[1][0]).toBe(discordUrl);
      expect(mockedSetLog).toHaveBeenCalledTimes(1);
      expect(mockedNotify).toHaveBeenCalledWith("success");
    });
  });
});
