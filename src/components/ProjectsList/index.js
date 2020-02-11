import React from "react";
import { Table, Button, Popconfirm, Icon, Row, Col, Typography } from "antd";

import styled from "styled-components";
const { Text } = Typography;

const ButtonActions = styled(Button)`
  margin-right: 10px;
`;

const ProjectsList = ({
  loading,
  projects,
  remove,
  select,
  showsTuvs,
  showsTasks
}) => {
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
      title: "Task",
      key: "task",
      render: (text, record) => {
        return (
          <React.Fragment>
            <ButtonActions
              onClick={() => {
                showsTasks(record);
              }}
              type="primary"
              icon="eye"
              size="small"
            >
              Tasks
            </ButtonActions>
          </React.Fragment>
        );
      }
    },
    {
      title: "Tuvs",
      key: "tuvs",
      render: (text, record) => {
        return (
          <React.Fragment>
            {record.Tuvs && record.Tuvs.length > 0 && (
              <ButtonActions
                onClick={() => {
                  showsTuvs(record);
                }}
                type="primary"
                icon="eye"
                size="small"
              >
                Tuvs
              </ButtonActions>
            )}
            {record.Tuvs && record.Tuvs.length === 0 && (
              <ButtonActions icon="loading" size="small">
                Loading...
              </ButtonActions>
            )}
          </React.Fragment>
        );
      }
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      width: 200,
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
