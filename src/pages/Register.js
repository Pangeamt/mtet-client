import React from "react";
import { Card } from "antd";
import styled from "styled-components";
import RegisterForm from "./../components/RegisterForm";

const CardLogin = styled(Card)`
  width: 100%;
  margin-top: 150px;
`;
export const Register = () => (
  <div className="container">
    <div className="row justify-content-center align-items-center">
      <div className="col-12 col-sm-12 col-md-10 col-lg-7">
        <CardLogin>
          <RegisterForm />
        </CardLogin>
      </div>
    </div>
  </div>
);
