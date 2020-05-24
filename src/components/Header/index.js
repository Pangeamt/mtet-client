/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Dropdown, Avatar, Row, Col } from "antd";
import { reactLocalStorage } from "reactjs-localstorage";
import { navigate, Link } from "@reach/router";

import "./style.css";
import avatarDropdown from "./avatarDropdown";
import LOGO from "./../../assets/NTEU_MTET.png";
import { AppContext } from "./../../AppContext";

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
            user.role !== "admin" ? "container " : "header-by-role w-100"
          }
        >
          <Row>
            <Col xs={12}>
              {user.role === "admin" && (
                <div
                  onClick={() => {
                    props.onCollapse(!props.collapsed);
                  }}
                  className="list-unstyled list-inline"
                >
                  <a href="#" className="list-inline-item">
                    {" "}
                    <LegacyIcon
                      type={props.collapsed ? "menu-unfold" : "menu-fold"}
                      className="list-icon"
                    />{" "}
                  </a>
                </div>
              )}
              <Link to="/">
                <img
                  src={LOGO}
                  alt=""
                  style={{
                    height: 50,
                    marginLeft: 10
                  }}
                />
              </Link>
            </Col>
            <Col xs={12}>
              <div className="right list-unstyled list-inline">
                <Dropdown
                  className="list-inline-item"
                  overlay={avatarDropdown({ user, logout })}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <a className="ant-dropdown-link no-link-style" href="#">
                    <Avatar icon={<UserOutlined />} size="small" />
                  </a>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Header>
  );
};

export default Section;
