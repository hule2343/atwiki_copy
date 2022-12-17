import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosInstance } from "axios";
import { axios, discordUrl } from "../Http";
import { CreateUserForm } from "../sign_up_Form";

const mockedNavigator = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

jest.mock("../Http");
const mockedAxios = axios as jest.Mocked<AxiosInstance>;

describe("SignupForm", () => {
  test("when data are entered correctly, onsubmit is called without error and navigator is called with ('/')", async () => {
    mockedAxios.post.mockResolvedValue({});
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
        screen.getByLabelText(/^(?=.*パスワード)(?!.*確認用).*$/),
        "test123"
      );
      userEvent.type(screen.getByLabelText(/パスワード確認用/), "test123");
      userEvent.click(screen.getByRole("checkbox"));
      userEvent.click(screen.getByRole("button"));
    });
    expect(onsubmit).toHaveBeenCalledTimes(1);
    expect(
      screen.queryAllByText(/^(?=.*必須項目です)(?!.*は).*$/)
    ).toHaveLength(0);
    expect(
      screen.queryAllByText(/有効なアドレスを入力してください/)
    ).toHaveLength(0);
    expect(screen.queryAllByText(/6文字以上入力してください/)).toHaveLength(0);
    expect(screen.queryAllByText(/パスワードが一致しません/)).toHaveLength(0);
    expect(mockedAxios.post).toHaveBeenCalledTimes(3);
    expect(mockedAxios.post.mock.calls[0][0]).toBe("/register");
    expect(mockedAxios.post.mock.calls[1][0]).toBe("/logs/log");
    expect(mockedAxios.post.mock.calls[2][0]).toBe(discordUrl);
    expect(mockedNavigator).toHaveBeenCalledWith("/");
  });

  test("when send button is pushed while name and password fields are empty, error messages are showed", async () => {
    onsubmit = jest.fn();
    await act(async () => {
      render(<CreateUserForm />);
    });
    await act(async () => {
      userEvent.click(screen.getByRole("button"));
    });
    expect(screen.getAllByText(/^(?=.*必須項目です)(?!.*は).*$/)).toHaveLength(
      4
    );
  });

  test("when email address is incomplete, prompting for correct address", async () => {
    onsubmit = jest.fn();
    await act(async () => {
      render(<CreateUserForm />);
    });
    await act(async () => {
      userEvent.type(screen.getByLabelText(/メールアドレス/), "kangi");
      userEvent.click(screen.getByRole("button"));
    });
    expect(
      screen.getAllByText(/有効なアドレスを入力してください/)
    ).toHaveLength(1);
    await act(async () => {
      userEvent.type(screen.getByLabelText(/メールアドレス/), "@email");
      userEvent.click(screen.getByRole("button"));
    });
    expect(
      screen.getAllByText(/有効なアドレスを入力してください/)
    ).toHaveLength(1);
  });

  test("when the length of the password is less than 6, error message is showed", async () => {
    onsubmit = jest.fn();
    await act(async () => {
      render(<CreateUserForm />);
    });
    await act(async () => {
      userEvent.type(
        screen.getByLabelText(/^(?=.*パスワード)(?!.*確認用).*$/),
        "test"
      );
      userEvent.click(screen.getByRole("button"));
    });
    expect(screen.getAllByText(/6文字以上入力してください/)).toHaveLength(1);
    await act(async () => {
      userEvent.type(
        screen.getByLabelText(/^(?=.*パスワード)(?!.*確認用).*$/),
        "12"
      );
      userEvent.click(screen.getByRole("button"));
    });
    expect(screen.queryAllByText(/6文字以上入力してください/)).toHaveLength(0);
  });

  test("when password and password confirmation do not match, error is showed", async () => {
    onsubmit = jest.fn();
    await act(async () => {
      render(<CreateUserForm />);
    });
    await act(async () => {
      userEvent.type(
        screen.getByLabelText(/^(?=.*パスワード)(?!.*確認用).*$/),
        "test123"
      );
      userEvent.type(screen.getByLabelText(/パスワード確認用/), "test12");
    });
    expect(screen.getAllByText(/パスワードが一致しません/)).toHaveLength(1);
    await act(async () => {
      userEvent.type(screen.getByLabelText(/パスワード確認用/), "3");
    });
    expect(screen.queryAllByText(/パスワードが一致しません/)).toHaveLength(0);
  });

  test("switch show/hide by pressing the eye button in the password field and the password confirmation field", async () => {
    await act(async () => {
      render(<CreateUserForm />);
    });
    const passField = screen.getByLabelText(
      /^(?=.*パスワード)(?!.*確認用).*$/
    ) as HTMLInputElement;
    const passConfirmField = screen.getByLabelText(
      /パスワード確認用/
    ) as HTMLInputElement;
    expect(passField.type).toBe("password");
    expect(passConfirmField.type).toBe("password");
    await act(async () => {
      userEvent.click(screen.getByTestId("eye-button-1"));
    });
    expect(passField.type).toBe("text");
    expect(passConfirmField.type).toBe("text");
    await act(async () => {
      userEvent.click(screen.getByTestId("eye-button-2"));
    });
    expect(passField.type).toBe("password");
    expect(passConfirmField.type).toBe("password");
  });

  test("when the information you signed up with has already been saved, error message is showed", async () => {
    mockedAxios.post.mockRejectedValue({ response: { status: 409 } });
    await act(async () => {
      render(<CreateUserForm />);
    });
    await act(async () => {
      userEvent.type(screen.getByLabelText(/名前/), "関技 太郎");
      userEvent.type(
        screen.getByLabelText(/メールアドレス/),
        "kangi@email.com"
      );
      userEvent.type(
        screen.getByLabelText(/^(?=.*パスワード)(?!.*確認用).*$/),
        "test123"
      );
      userEvent.type(screen.getByLabelText(/パスワード確認用/), "test123");
      userEvent.click(screen.getByRole("button"));
    });
    expect(
      screen.getAllByText("既に登録されているアカウントと重複があります")
    ).toHaveLength(1);
  });
});
