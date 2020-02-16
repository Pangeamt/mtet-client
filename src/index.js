import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";

import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

// 3rd
import "./styles/antd.less";
import "./styles/bootstrap/bootstrap.scss";
// custom
import "./styles/layout.scss";
import "./styles/theme.scss";
import "./styles/ui.scss";
import "./styles/vendors.scss";

import { AppContext } from "./AppContext";
import { App } from "./App";
import * as serviceWorker from "./serviceWorker";

const Container = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const value = useMemo(() => ({ user, setUser, token, setToken }), [
    user,
    setUser,
    token,
    setToken
  ]);

  return (
    <AppContext.Provider value={value}>
      <App />
    </AppContext.Provider>
  );
};

ReactDOM.render(<Container />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
