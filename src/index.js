import App from "./App";
import { createRoot } from "react-dom/client";
import React, { StrictMode } from "react";
import "amis/lib/themes/cxd.css";
import "amis/lib/helper.css";
import "amis/sdk/iconfont.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
