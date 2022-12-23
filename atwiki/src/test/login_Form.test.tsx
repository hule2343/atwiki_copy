import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosInstance } from "axios";
import { User, axios } from "../Http";
import { UserContext } from "../LoginContext";
import { LoginForm } from "../login_Form";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

jest.mock("../Http");
const mockedAxios = axios as jest.Mocked<AxiosInstance>;

describe("LoginForm", () => {
  test("when name and password are entered, onsubmit is called without error and navigator is called with ('/')", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });
    mockedAxios.get.mockResolvedValue({ data: { is_login: true } });

    const dummyLoginUser = { loginUser: {} as User, setUser: () => {} };

    await act(async () => {
      render(
        <UserContext.Provider value={dummyLoginUser}>
          <LoginForm />
        </UserContext.Provider>
      );
    });
    await act(async () => {
      userEvent.type(screen.getByLabelText("名前"), "tanaka");
      userEvent.type(screen.getByLabelText("パスワード"), "test123");
      userEvent.click(screen.getByRole("button"));
    });
    expect(screen.queryByText("必須項目です")).toBeNull;
    expect(screen.queryByText("パスワードを入力してください")).toBeNull;
    expect(mockedNavigator).toHaveBeenCalledWith("/");
  });

  test("when send button is pushed while name and password fields are empty, error messages are showed", async () => {
    await act(async () => {
      render(<LoginForm />);
    });
    await act(async () => {
      userEvent.click(screen.getByRole("button"));
    });
    expect(screen.queryByText("必須項目です")).toBeInTheDocument;
    expect(screen.queryByText("パスワードを入力してください"))
      .toBeInTheDocument;
  });

  test("switch show/hide by pressing the eye button in the password field", async () => {
    await act(async () => {
      render(<LoginForm />);
    });
    const passField = screen.getByLabelText("パスワード") as HTMLInputElement;
    expect(passField.type).toBe("password");
    await act(async () => {
      userEvent.click(screen.getByTestId("eye-button"));
    });
    expect(passField.type).toBe("text");
  });

  test("when login is failed, error message is showed", async () => {
    mockedAxios.post.mockRejectedValue({ data: {} });

    await act(async () => {
      render(<LoginForm />);
    });
    expect(screen.queryByText("ログインに失敗しました")).toBeNull;
    await act(async () => {
      userEvent.type(screen.getByRole("textbox", { name: "名前" }), "tanaka");
      userEvent.type(screen.getByLabelText("パスワード"), "test123");
      userEvent.click(screen.getByRole("button"));
    });
    expect(screen.queryByText("ログインに失敗しました")).toBeInTheDocument;
  });
});
