import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Home } from "./Http";
import "./index.css";
import { LoginManager } from "./LoginContext";
import { LoginRequire } from "./loginRequire";
import { LoginForm } from "./login_Form";
import { CreateUserForm } from "./sign_up_Form";
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <div>
      <div>
        <div>
          <LoginManager>
            <BrowserRouter>
              <nav className="navbar navbar-expand-mg navbar-light bg-light">
                <div className="container-fluid">
                  <ul className="navbar-nav d-flex flex-row">
                    {localStorage.getItem("loginuser") ? (
                      <></>
                    ) : (
                      <li className="nav-item me-4">
                        <NavLink className={"nav-link"} to="/login">
                          Login
                        </NavLink>
                      </li>
                    )}
                    <li className="nav-item me-4">
                      <NavLink className={"nav-link"} to="/register">
                        Sign up
                      </NavLink>
                    </li>
                    <li className="nav-item me-4">
                      <NavLink className={"nav-link"} to="/">
                        kangi
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </nav>
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<CreateUserForm />} />
                <Route
                  path="/"
                  element={<LoginRequire component={<Home />} />}
                />
              </Routes>
            </BrowserRouter>
          </LoginManager>
        </div>
      </div>
    </div>
  </React.StrictMode>
);
