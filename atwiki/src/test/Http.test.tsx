import { render, screen, waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { MemberList, User, axios } from "../Http";
import { UserContext } from "../LoginContext";

const mockedNavigator = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockedNavigator,
}));

const mockedAxiosGet = jest.spyOn(axios, "get");

const dummyUsers: User[] = [
  {
    id: 0,
    name: "kangi-tester",
    email: "kangi@kangi3d.com",
    phonenumber: "0745-78-5388",
    task: "task1",
    absent: "",
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
      screen.debug();
    });
  });
});
