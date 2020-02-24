/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import { Menu, Icon } from "antd";

import styled from "styled-components";

const MenuWrapper = styled(Menu)`
  &.ant-menu {
    position: relative;
    margin: 0;
    padding: 4px 0;
    text-align: left;
    list-style-type: none;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 6px;
    outline: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .ant-menu-item {
      clear: both;
      margin: 0;
      padding: 5px 12px;
      color: rgba(0, 0, 0, 0.65);
      font-weight: normal;
      font-size: 14px;
      line-height: 30px;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.3s;
    }
  }
`;

const avatarDropdown = ({ user, logout }) => {
  return (
    <MenuWrapper className="app-header-dropdown">
      <Menu.Item key="4">
        {" "}
        Signed in as <strong>{user.nickname}</strong>{" "}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="0">
        {" "}
        <a href="#">
          <Icon type="user" />
          Profile
        </a>{" "}
      </Menu.Item>
      <Menu.Item key="1" disabled>
        {" "}
        <Icon type="setting" />
        Settings{" "}
      </Menu.Item>
      <Menu.Item key="2">
        {" "}
        <a href="#">
          <Icon type="question-circle-o" />
          Need Help?
        </a>{" "}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={logout}>
        <span>
          {" "}
          <Icon type="logout" />
          Sign out
        </span>
      </Menu.Item>
    </MenuWrapper>
  );
};

export default avatarDropdown;
