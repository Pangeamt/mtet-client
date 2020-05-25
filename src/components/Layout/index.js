import React, { useState, useContext } from "react";
import { Layout, Breadcrumb } from "antd";
import { Location } from "@reach/router";
import styled from "styled-components";

import { AppContext } from "./../../AppContext";
import Header from "./../Header";
import AdminMenu from "./../Menus/AdminMenu";

const { Content, Footer, Sider } = Layout;

const LayoutWrapper = styled(Layout)`
  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }

  .ant-layout-sider-children {
    background: #001529;
  }

  .ant-menu-dark,
  .ant-menu-dark .ant-menu-sub {
    background: #001529;
  }
`;

const AppLayout = (props) => {
  const { user } = useContext(AppContext);
  const [collapsed, setCollapse] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapse(collapsed);
    setCollapse(collapsed);
  };

  return (
    <LayoutWrapper theme="light" style={{ minHeight: "100vh" }}>
      {user.role === "admin" && (
        <Sider collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          {user.role === "admin" && <AdminMenu />}
        </Sider>
      )}
      <Layout>
        <Header onCollapse={onCollapse} collapsed={collapsed} />
        <Content style={{ margin: "0 16px" }}>
          <Location>
            {({ location }) => {
              let words = location.pathname.split("/");
              if (user.role === "admin") {
                return (
                  <Breadcrumb style={{ margin: "16px 0" }}>
                    {words.map((item, i) => {
                      if (item) {
                        item = item.split("-").join(" ");
                        return (
                          <Breadcrumb.Item key={`bri-${i}`}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </Breadcrumb.Item>
                        );
                      }
                      return null;
                    })}
                  </Breadcrumb>
                );
              }
            }}
          </Location>
          {props.children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Power by Pangeanic ©2020
        </Footer>
      </Layout>
    </LayoutWrapper>
  );
};

export default AppLayout;
