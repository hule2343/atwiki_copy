import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosInstance } from "axios";
import { axios } from "../Http";
import { CreateUserForm } from "../sign_up_Form";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

jest.mock("../Http");
const mockedAxios = axios as jest.Mocked<AxiosInstance>;

describe("SignupForm", () => {
  test("when data are entered correctly, onsubmit is called", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });
    onsubmit = jest.fn();
    await act(async () => {
      render(<CreateUserForm />);
    });
    await act(async () => {
      userEvent.type(screen.getByLabelText(/名前/), "関技 太郎");
      userEvent.type(
        screen.getByLabelText(/メールアドレス/),
        "kangi@email.com"
      );
      userEvent.type(screen.getByLabelText(/電話番号/), "0000000000");
      userEvent.type(
        screen.getByLabelText(/(?=.*パスワード)(?!.*確認用)/),
        "test123"
      );
      userEvent.type(screen.getByLabelText(/パスワード確認用/), "test123");
      userEvent.click(screen.getByRole("checkbox"));
      userEvent.click(screen.getByRole("button"));
    });
    expect(onsubmit).toBeCalledTimes(1);
  });

  test("when send button is pushed while name and password fields are empty, error messages are showed", async () => {
    onsubmit = jest.fn();
    await act(async () => {
      render(<CreateUserForm />);
    });
    await act(async () => {
      userEvent.click(screen.getByRole("button"));
    });
    expect(screen.getAllByText(/必須項目です/)).toHaveLength(4);
  });
});
