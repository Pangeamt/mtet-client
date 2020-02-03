import React, { useContext, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { Router } from "@reach/router";

import Login from "./pages/Login";

import { NotFound } from "./pages/NotFound";
import { Forbidden } from "./pages/Forbidden";

import { Admin } from "./pages/Admin";
import DashboardAdmin from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";

import { Manager } from "./pages/Manager";
import DashboardManager from "./pages/Manager/Dashboard";
import Projects from "./pages/Manager/Projects";

import { Evaluator } from "./pages/Evaluator";
import DashboardEvaluator from "./pages/Evaluator/Dashboard";

import { AppContext } from "./AppContext";

import "./styles/global.css";

export const App = () => {
  const { user, token, setToken, setUser } = useContext(AppContext);

  useEffect(() => {
    const _token = reactLocalStorage.get("token", false);
    const _user = reactLocalStorage.getObject("user", false);
    setToken(_token);
    setUser(_user);
  }, [setToken, setUser]);

  if (user && token) {
    return (
      <React.Fragment>
        <Router>
          <Login path="/" />
          <Forbidden path="403" />
          <NotFound default />
          <Admin path="admin">
            <DashboardAdmin path="/" />
            <Users path="users" />
          </Admin>
          <Manager path="project-manager">
            <DashboardManager path="/" />
            <Projects path="projects" />
          </Manager>
          <Evaluator path="evaluator">
            {/* <DashboardEvaluator path="/" />
            <BankAccounts path="bank-accounts" /> */}
          </Evaluator>
        </Router>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Router>
          <Login path="/" />
          <NotFound default />
          <Forbidden path="admin" />
          <Forbidden path="admin/users" />
          <Forbidden path="project-manager" />
          <Forbidden path="project-manager/projects" />
        </Router>
      </React.Fragment>
    );
  }
};
