import React from "react";
import { Button, Popconfirm, Icon } from "antd";
import styled from "styled-components";

const ButtonActions = styled(Button)`
  margin-right: 10px;
`;

export const userModel = ({ remove, select }) => [
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
    width: 100,
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
