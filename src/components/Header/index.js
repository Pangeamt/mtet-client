/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Layout, Dropdown, Icon, Avatar, Button } from "antd";
import styled from "styled-components";
import { reactLocalStorage } from "reactjs-localstorage";
import { navigate } from "@reach/router";

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
        <div className="header-left">
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
        </div>

        <HeaderRight className="header-right">
          {user.role === "manager" && (
            <Button style={{ marginRight: 20 }} type="primary" icon="plus">
              Create a new lease
            </Button>
          )}
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
    </Header>
  );
};

export default Section;
