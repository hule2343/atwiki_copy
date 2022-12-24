import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { MemberList, axios } from "./Http";
import { LoginContext, UserContext } from "./LoginContext";

const TestUserInfo: React.FC = () => {
  const { loginUser, setUser } = useContext(UserContext);

  return (
    <div className="mx-2">
      <ul className="list-unstyled ms-3">
        <li>{loginUser.name}</li>
        <li>{loginUser.email}</li>
      </ul>
    </div>
  );
};

export const Home: React.FC = () => {
  const is_login = React.useContext(LoginContext);
  const { loginUser, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    axios
      .post("/logout", { withCredentials: true })
      .then((response) => {
        localStorage.clear();
        sessionStorage.clear();
        console.log("logout response data", response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log("logout failed");
          console.log(error);
        }
      });
    navigate("/login");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto border-end bg-light">
          <div className="sticky-top">
            <button
              onClick={handleLogout}
              className="btn btn-outline-secondary btn-sm m-2"
            >
              アカウント切り替え
            </button>
            <div>
              <TestUserInfo />
            </div>
          </div>
        </div>
        <div className="col">
          <MemberList />
        </div>
      </div>
    </div>
  );
};
