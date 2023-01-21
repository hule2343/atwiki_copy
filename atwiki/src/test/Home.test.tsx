import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Home } from "../Home";
import { User, axios } from "../Http";
import { UserContext } from "../LoginContext";

jest.mock("../Http", () => ({
  ...jest.requireActual("../Http"),
  MemberList: () => <div />,
}));

const mockedNavigator = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockedNavigator,
}));

const mockedAxiosPost = jest.spyOn(axios, "post");

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

describe("Home", () => {
  beforeEach(() => {
    localStorage.clear = jest.fn();
    sessionStorage.clear = jest.fn();
  });
  test("render", async () => {
    render(
      <UserContext.Provider value={dummyLoginUser}>
        <Home />
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("アカウント切り替え")).toBeInTheDocument;
      expect(screen.getByText(dummyUser.name)).toBeInTheDocument;
      expect(screen.getByText(dummyUser.email)).toBeInTheDocument;
      screen.debug();
    });
  });
  test("logout", async () => {
    mockedAxiosPost.mockResolvedValue({});
    render(
      <UserContext.Provider value={dummyLoginUser}>
        <Home />
      </UserContext.Provider>
    );
    userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(mockedAxiosPost).toHaveBeenCalledWith("/logout", {
        withCredentials: true,
      });
      expect(mockedNavigator).toHaveBeenCalledWith("/login");
    });
  });
  test("axios post error", async () => {
    mockedAxiosPost.mockRejectedValue({});
    render(
      <UserContext.Provider value={dummyLoginUser}>
        <Home />
      </UserContext.Provider>
    );
    await waitFor(() => {
      expect(mockedNavigator).toHaveBeenCalledTimes(0);
    });
  });
});
