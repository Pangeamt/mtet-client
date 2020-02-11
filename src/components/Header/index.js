/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Layout, Dropdown, Icon, Avatar, Button } from "antd";
import styled from "styled-components";
import { reactLocalStorage } from "reactjs-localstorage";
import { navigate } from "@reach/router";

import "./style.css";
import avatarDropdown from "./avatarDropdown";
import { AppContext } from "./../../AppContext";

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const { Header } = Layout;

const Section = props => {
  const { user, setUser, setToken } = useContext(AppContext);

  const logout = () => {
    setToken(null);
    setUser(null);
    reactLocalStorage.clear();
    navigate(`/`);
  };

  return (
    <Header className="app-header">
      <div className="app-header-inner bg-white">
        <div
          className={
            user.role === "evaluator" ? "container " : "header-by-role w-100"
          }
        >
          <div className="header-left">
            {user.role !== "evaluator" && (
              <div
                onClick={() => {
                  props.onCollapse(!props.collapsed);
                }}
                className="list-unstyled list-inline"
              >
                <a href="#" className="list-inline-item">
                  {" "}
                  <Icon
                    type={props.collapsed ? "menu-unfold" : "menu-fold"}
                    className="list-icon"
                  />{" "}
                </a>
              </div>
            )}
          </div>
          <HeaderRight className="header-right">
            <div className="list-unstyled list-inline">
              <Dropdown
                className="list-inline-item"
                overlay={avatarDropdown({ user, logout })}
                trigger={["click"]}
                placement="bottomRight"
              >
                <a className="ant-dropdown-link no-link-style" href="#">
                  <Avatar icon="user" size="small" />
                </a>
              </Dropdown>
            </div>
          </HeaderRight>
        </div>
      </div>
    </Header>
  );
};

export default Section;
