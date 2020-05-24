import React from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Table, Button, Popconfirm } from "antd";

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
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
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
            
            icon="edit"
            size="small"
          />
          <ButtonActions
            onClick={() => {
              showPassForm(record);
            }}
            type="primary"
            
            icon="safety-certificate"
            size="small"
          />
          <Popconfirm
            title="Are you sure？"
            onConfirm={() => {
              remove(record);
            }}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <ButtonActions
              type="danger"
              
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
