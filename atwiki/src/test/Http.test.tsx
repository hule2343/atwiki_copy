import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosResponse } from "axios";
import { toast } from "react-hot-toast";
import { MemberList, User, axios, discordUrl } from "../Http";
import { UserContext } from "../LoginContext";

const mockedNavigator = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockedNavigator,
}));

const mockedAxiosGet = jest.spyOn(axios, "get");
const mockedAxiosPatch = jest.spyOn(axios, "patch");
const mockedAxiosPost = jest.spyOn(axios, "post");

const mockedToastSuccess = jest.spyOn(toast, "success");
const mockedToastError = jest.spyOn(toast, "error");

const dummyUsers: User[] = [
  {
    id: 0,
    name: "kangi-tester",
    email: "kangi@kangi3d.com",
    phonenumber: "0745-78-5388",
    task: "task1",
    absent: "2022/12/31",
    is_student: true,
  },
  {
    id: 1,
    name: "test",
    email: "test@kangi3d.com",
    phonenumber: "0000-00-0000",
    task: "task2",
    absent: "",
    is_student: true,
  },
];

const dummyLogs = [
  {
    id: 0,
    date: "2022/12/31 12:00:00",
    title: "log 1",
  },
  {
    id: 1,
    date: "2023/01/01 12:00:00",
    title: "log 2",
  },
];

const dummyLoginUser = {
  loginUser: dummyUsers[0],
  setUser: () => {},
};

describe("memberlist", () => {
  test("render", async () => {
    mockedAxiosGet.mockImplementation((url: string, config) => {
      if (url === "/users") {
        return Promise.resolve({ data: dummyUsers });
      } else if (url === "/users/0") {
        return Promise.resolve({ data: dummyUsers[0] });
      } else if (url === "/users/1") {
        return Promise.resolve({ data: dummyUsers[1] });
      } else if (url === "/logs") {
        return Promise.resolve({ data: dummyLogs });
      }
      return Promise.resolve({} as AxiosResponse);
    });

    render(
      <UserContext.Provider value={dummyLoginUser}>
        <MemberList />
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getAllByText(/kangi-tester/)).toHaveLength(2);
      expect(screen.getAllByText("test")).toHaveLength(2);
      expect(screen.getByText(/task1/)).toBeInTheDocument;
      expect(screen.getByText(/task2/)).toBeInTheDocument;
      expect(screen.getByText(/kangi@kangi3d.com/)).toBeInTheDocument;
      expect(screen.getByText(/test@kangi3d.com/)).toBeInTheDocument;
      expect(screen.getByText(/0745-78-5388/)).toBeInTheDocument;
      expect(screen.getByText(/0000-00-0000/)).toBeInTheDocument;
      expect(screen.getByText(/log 1/)).toBeInTheDocument;
      expect(screen.getByText(/log 2/)).toBeInTheDocument;
      expect(screen.getAllByText(/編集/)).toHaveLength(5);
    });
  });
  test("EditDate change test", async () => {
    mockedAxiosGet.mockImplementation((url: string, config) => {
      if (url === "/users") {
        return Promise.resolve({ data: dummyUsers });
      } else if (url === "/users/0") {
        return Promise.resolve({ data: dummyUsers[0] });
      } else if (url === "/users/1") {
        return Promise.resolve({ data: dummyUsers[1] });
      } else if (url === "/logs") {
        return Promise.resolve({ data: dummyLogs });
      }
      return Promise.resolve({} as AxiosResponse);
    });
    mockedAxiosPatch.mockResolvedValue({});
    mockedAxiosPost.mockResolvedValue({});

    render(
      <UserContext.Provider value={dummyLoginUser}>
        <MemberList />
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("2022/12/31")).toBeInTheDocument;
      expect(screen.getAllByText(/編集/)).toHaveLength(5);
    });
    const buttons = screen.getAllByText(/編集/) as HTMLButtonElement[];
    userEvent.click(buttons[0]);
    const dateBox = screen.getByRole("textbox") as HTMLInputElement;
    userEvent.type(dateBox, "{backspace}".repeat(7)); // if you clear input field at all, the error occurs.
    userEvent.type(dateBox, "3/01/01");
    userEvent.click(screen.getByText("保存"));
    await waitFor(() => {
      expect(screen.getByText("2023/01/01")).toBeInTheDocument;
      expect(mockedAxiosPatch).toHaveBeenCalledWith("/users/0", {
        date: "2023/01/01",
      });
      expect(mockedAxiosPost.mock.calls[0][0]).toBe("/logs/log");
      expect(mockedAxiosPost.mock.calls[1][0]).toBe(discordUrl);
      expect(mockedToastSuccess).toBeCalledTimes(1);
    });
  });
  test("EditDate unchange test", async () => {
    mockedAxiosGet.mockImplementation((url: string, config) => {
      if (url === "/users") {
        return Promise.resolve({ data: dummyUsers });
      } else if (url === "/users/0") {
        return Promise.resolve({ data: dummyUsers[0] });
      } else if (url === "/users/1") {
        return Promise.resolve({ data: dummyUsers[1] });
      } else if (url === "/logs") {
        return Promise.resolve({ data: dummyLogs });
      }
      return Promise.resolve({} as AxiosResponse);
    });
    mockedAxiosPatch.mockResolvedValue({});
    mockedAxiosPost.mockResolvedValue({});

    render(
      <UserContext.Provider value={dummyLoginUser}>
        <MemberList />
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("2022/12/31")).toBeInTheDocument;
      expect(screen.getAllByText(/編集/)).toHaveLength(5);
    });
    const buttons = screen.getAllByText(/編集/) as HTMLButtonElement[];
    userEvent.click(buttons[0]);
    userEvent.click(screen.getByText("保存"));
    await waitFor(() => {
      expect(screen.getByText("2022/12/31")).toBeInTheDocument;
      expect(mockedAxiosPatch).toHaveBeenCalledTimes(0);
      expect(mockedAxiosPost).toHaveBeenCalledTimes(0);
      expect(mockedToastSuccess).toBeCalledTimes(0);
    });
  });
  test("EditDate axios patch error", async () => {
    mockedAxiosGet.mockImplementation((url: string, config) => {
      if (url === "/users") {
        return Promise.resolve({ data: dummyUsers });
      } else if (url === "/users/0") {
        return Promise.resolve({ data: dummyUsers[0] });
      } else if (url === "/users/1") {
        return Promise.resolve({ data: dummyUsers[1] });
      } else if (url === "/logs") {
        return Promise.resolve({ data: dummyLogs });
      }
      return Promise.resolve({} as AxiosResponse);
    });
    mockedAxiosPatch.mockRejectedValue({ response: {} });

    render(
      <UserContext.Provider value={dummyLoginUser}>
        <MemberList />
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("2022/12/31")).toBeInTheDocument;
      expect(screen.getAllByText(/編集/)).toHaveLength(5);
    });
    const buttons = screen.getAllByText(/編集/) as HTMLButtonElement[];
    userEvent.click(buttons[0]);
    const dateBox = screen.getByRole("textbox") as HTMLInputElement;
    userEvent.type(dateBox, "{backspace}".repeat(7)); // if you clear input field at all, the error occurs.
    userEvent.type(dateBox, "3/01/01");
    userEvent.click(screen.getByText("保存"));
    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledTimes(1);
    });
  });
  test("EditDate axios post error", async () => {
    mockedAxiosGet.mockImplementation((url: string, config) => {
      if (url === "/users") {
        return Promise.resolve({ data: dummyUsers });
      } else if (url === "/users/0") {
        return Promise.resolve({ data: dummyUsers[0] });
      } else if (url === "/users/1") {
        return Promise.resolve({ data: dummyUsers[1] });
      } else if (url === "/logs") {
        return Promise.resolve({ data: dummyLogs });
      }
      return Promise.resolve({} as AxiosResponse);
    });
    mockedAxiosPatch.mockResolvedValue({});
    mockedAxiosPost.mockRejectedValue({});

    render(
      <UserContext.Provider value={dummyLoginUser}>
        <MemberList />
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("2022/12/31")).toBeInTheDocument;
      expect(screen.getAllByText(/編集/)).toHaveLength(5);
    });
    const buttons = screen.getAllByText(/編集/) as HTMLButtonElement[];
    userEvent.click(buttons[0]);
    const dateBox = screen.getByRole("textbox") as HTMLInputElement;
    userEvent.type(dateBox, "{backspace}".repeat(7)); // if you clear input field at all, the error occurs.
    userEvent.type(dateBox, "3/01/01");
    userEvent.click(screen.getByText("保存"));
    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledTimes(1);
    });
  });
});
