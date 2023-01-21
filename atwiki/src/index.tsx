import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { LoginManager } from "./LoginContext";
import "./bgColor.css";
import "./index.css";
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
              <nav className="navbar navbar-mg navbar-dark justify-content-center">
                <div className="d-inline-flex align-items-center">
                  <span
                    className="navbar-brand me-5 fs-2"
                    style={{ fontFamily: "serif" }}
                  >
                    kan
                    <span className="g-color">g</span>i
                  </span>
                  <ul className="navbar-nav flex-row">
                    <li className="nav-item me-4">
                      <NavLink className={"nav-link"} to="/" end>
                        {({ isActive }) => (
                          <span className={isActive ? "fw-bold" : ""}>
                            Home
                          </span>
                        )}
                      </NavLink>
                    </li>
                    <li className="nav-item me-4">
                      <NavLink className={"nav-link"} to="/register">
                        {({ isActive }) => (
                          <span className={isActive ? "fw-bold" : ""}>
                            Sign up
                          </span>
                        )}
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
