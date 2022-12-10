import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../login_Form";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

describe("LoginFrom", () => {
  test("when name and password are entered, they are passed to onSubmit", async () => {
    onsubmit = jest.fn();
    await act(async () => {
      render(<LoginForm />);
    });
    userEvent.type(screen.getByRole("textbox", { name: "名前" }), "tanaka");
    userEvent.type(screen.getByLabelText("パスワード"), "test123");
    userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(onsubmit).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("必須項目です")).toBeNull;
      expect(screen.queryByText("パスワードを入力してください")).toBeNull;
    });
  });

  test("when send button is pushed while name and password fields are empty, error messages are showed", async () => {
    onsubmit = jest.fn();
    await act(async () => {
      render(<LoginForm />);
    });
    userEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryByText("必須項目です")).toBeInTheDocument;
      expect(screen.queryByText("パスワードを入力してください"))
        .toBeInTheDocument;
    });
  });
});
