import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./Http";
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
              <li>
                <NavLink to="/">kangi</NavLink>
              </li>
            </ul>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<CreateUserForm />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  </React.StrictMode>
);
