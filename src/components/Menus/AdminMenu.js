import React from "react";
import { DashboardOutlined, TeamOutlined } from '@ant-design/icons';
import { Menu } from "antd";
import { Link, Location } from "@reach/router";

const AdminMenu = props => {
  return (
    <Location>
      {({ location }) => {
        return (
          <Menu
            theme="dark"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
          >
            <Menu.Item key="/admin">
              <Link to="/admin">
                <DashboardOutlined />
                <span>Dashboard</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/users">
              <Link to="users">
                <TeamOutlined />
                <span>Users</span>
              </Link>
            </Menu.Item>
          </Menu>
        );
      }}
    </Location>
  );
};

export default AdminMenu;
