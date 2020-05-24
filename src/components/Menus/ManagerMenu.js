import React from "react";
import { AppstoreOutlined, DashboardOutlined } from '@ant-design/icons';
import { Menu } from "antd";
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
                <DashboardOutlined />
                <span>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/project-manager/projects">
              <Link to="projects">
                <AppstoreOutlined />
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
