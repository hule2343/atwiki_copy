import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { MemberList, WorkDayList, Log } from "./Http";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <div>
      <div>
        <MemberList />
      </div>
      <div>
        <WorkDayList />
      </div>
      <div>
        <Log />
      </div>
    </div>
  </React.StrictMode>
);
