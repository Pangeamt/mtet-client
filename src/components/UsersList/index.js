import React from "react";
import { Table, Button, Popconfirm, Icon } from "antd";

import styled from "styled-components";

const ButtonActions = styled(Button)`
  margin-right: 10px;
`;

const UsersList = ({ loading, users, remove, select, showPassForm }) => {
  const userModel = [
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
      render: text => <a>{text}</a>
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role"
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (text, record) => (
        <React.Fragment>
          <ButtonActions
            onClick={() => {
              select(record);
            }}
            type="primary"
            shape="circle"
            icon="edit"
            size="small"
          />
          <ButtonActions
            onClick={() => {
              showPassForm(record);
            }}
            type="primary"
            shape="circle"
            icon="safety-certificate"
            size="small"
          />
          <Popconfirm
            title="Are you sure？"
            onConfirm={() => {
              remove(record);
            }}
            icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
          >
            <ButtonActions
              type="danger"
              shape="circle"
              icon="delete"
              size="small"
            />
          </Popconfirm>
        </React.Fragment>
      )
    }
  ];

  return (
    <Table
      loading={loading}
      columns={userModel}
      dataSource={users}
      size="small"
    />
  );
};

export default UsersList;
