import React, { useState, useContext, useEffect } from "react";
import { Card } from "antd";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { reactLocalStorage } from "reactjs-localstorage";

import { AppContext } from "./../AppContext";
import LoginForm from "./../components/LoginForm";
import { handleError, login } from "./../services";

const CardLogin = styled(Card)`
  width: 100%;
  margin-top: 150px;
`;
const Login = () => {
  const { setUser, setToken, user, token } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      redirect(user);
    }
  }, [token, user]);

  const redirect = user => {
    if (user.role === "admin") {
      return navigate(`/admin`);
    }
    if (user.role === "pm") {
      return navigate(`/project-manager`);
    }
    if (user.role === "evaluator") {
      return navigate(`/evaluator`);
    }
  };

  const _login = async form => {
    try {
      setLoading(true);
      const {
        data: { token, user }
      } = await login(form);

      if (token && user) {
        reactLocalStorage.set("token", token);
        reactLocalStorage.setObject("user", user);
        setUser(user);
        setToken(token);
        setLoading(false);
        redirect(user);
      }
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          <CardLogin>
            <LoginForm loading={loading} login={_login} />
          </CardLogin>
        </div>
      </div>
    </div>
  );
};

export default Login;
