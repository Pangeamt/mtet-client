import React, { useState, useContext, useEffect } from "react";
import { Card, Layout, Row, Col } from "antd";
import styled from "styled-components";
import { navigate } from "@reach/router";
import { reactLocalStorage } from "reactjs-localstorage";

import { AppContext } from "./../AppContext";
import LoginForm from "./../components/LoginForm";
import { handleError, login } from "./../services";

const { Content } = Layout;

const CardLogin = styled(Card)`
  width: 100%;
  margin: 130px 0 0 0;
`;
const Login = () => {
  const { setUser, setToken, user, token } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      redirect(user);
    }
  }, [token, user]);

  const redirect = (user) => {
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

  const _login = async (form) => {
    try {
      setLoading(true);
      const {
        data: { token, user },
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
    <Content>
      <Row type="flex" justify="center">
        <Col xs={22} md={10} lg={6}>
          <CardLogin>
            <LoginForm loading={loading} login={_login} />
          </CardLogin>
        </Col>
      </Row>
    </Content>
  );
};

export default Login;
