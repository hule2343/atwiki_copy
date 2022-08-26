import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { MemberList, Loglist } from "./Http";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <div>
      <div>
        <MemberList />
      </div>
      <div>
        <Loglist />
      </div>
    </div>
  </React.StrictMode>
);
