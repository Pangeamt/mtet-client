import React from "react";
import { Table, Button, Popconfirm, Icon } from "antd";

import styled from "styled-components";

const ButtonActions = styled(Button)`
  margin-right: 10px;
`;

const ProjectsList = ({ loading, projects, remove, select, showsTuvs }) => {
  const model = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: text => <a>{text}</a>
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source"
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (text, record) => (
        <React.Fragment>
          <ButtonActions
            onClick={() => {
              showsTuvs(record);
            }}
            icon="eye"
            size="small"
          >
            Tuvs
          </ButtonActions>
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

  return (
    <Table
      loading={loading}
      columns={model}
      dataSource={projects}
      size="small"
    />
  );
};

export default ProjectsList;
