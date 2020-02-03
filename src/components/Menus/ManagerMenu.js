import React from "react";
import { Menu, Icon } from "antd";
import { Link, Location } from "@reach/router";

const ManagerMenu = props => {
  return (
    <Location>
      {({ location }) => {
        return (
          <Menu
            theme="dark"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
          >
            <Menu.Item key="/project-manager">
              <Link to="/project-manager">
                <Icon type="dashboard" />
                <span>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/project-manager/projects">
              <Link to="projects">
                <Icon type="appstore" />
                <span>Projects</span>
              </Link>
            </Menu.Item>
          </Menu>
        );
      }}
    </Location>
  );
};

export default ManagerMenu;
