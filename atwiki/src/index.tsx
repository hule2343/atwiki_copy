import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { MemberList, Loglist } from "./Http";
import { LoginForm } from "./login_Form";
import { CreateUserForm } from "./sign_up_Form";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <div>
      <div>
        <div>
          <BrowserRouter>
            <ul>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register">Sign up</NavLink>
              </li>
            </ul>
            <Routes>
              <Route path="/login">
                <LoginForm />
              </Route>
              <Route path="/register">
                <CreateUserForm />
              </Route>
              <Route path="/">
                <div>
                  <div>
                    <MemberList />
                  </div>
                  <div>
                    <Loglist />
                  </div>
                  <div>
                    <NavLink to="/register"> 新規登録　</NavLink>
                  </div>
                </div>
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  </React.StrictMode>
);
