import React from "react";

import {
  CopyOutlined,
  DownOutlined,
  EditOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  Table,
  Button,
  Popconfirm,
  Tooltip,
  Progress,
  Dropdown,
  Menu,
} from "antd";
import numeral from "numeral";
import styled from "styled-components";

import TASKS from "./../../assets/tasks.png";
import TUVS from "./../../assets/tuvs.png";

const ButtonActions = styled(Button)`
  margin-right: 10px;
  margin-left: 10px;
`;

const ProjectsList = ({
  loading,
  projects,
  remove,
  select,
  selectClone,
  showsTuvs,
  showsTasks,
}) => {
  const model = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "#Tus",
      dataIndex: "tus",
      key: "tus",
    },
    {
      title: "#Tuvs",
      dataIndex: "tuvs",
      key: "tuvs",
    },
    {
      title: "Complete %",
      key: "complete",
      width: 180,
      render: (text, record) => {
        return (
          <Progress
            percent={numeral((record.complete * 100) / record.total).format(
              "0.00"
            )}
          />
        );
      },
    },

    {
      title: "",
      key: "action",
      fixed: "right",
      width: 200,
      render: (text, record) => {
        const menu = (
          <Menu>
            <Menu.Item
              onClick={() => {
                showsTasks(record);
              }}
              key="1"
            >
              <img
                style={{
                  width: 15,
                  height: 15,
                  margin: "-4px 0px 0 0px",
                }}
                src={TASKS}
                alt=""
                className="mr-2"
              />
              Tasks
            </Menu.Item>
            {record.projects && record.projects.length > 0 && (
              <Menu.Item
                key="2"
                onClick={() => {
                  showsTuvs(record);
                }}
              >
                <img
                  style={{
                    width: 15,
                    height: 15,
                    margin: "-4px 0px 0 0px",
                  }}
                  src={TUVS}
                  alt=""
                />
                Tuvs
              </Menu.Item>
            )}

            {record.projects && record.projects.length === 0 && (
              <Menu.Item key="3">
                <LoadingOutlined />
                loading...
              </Menu.Item>
            )}

            <Menu.Item
              key="4"
              onClick={() => {
                select(record);
              }}
              disabled={record.Tasks && record.Tasks.length > 0}
            >
              <EditOutlined />
              Edit
            </Menu.Item>
            <Menu.Item
              key="4"
              onClick={() => {
                selectClone(record);
              }}
            >
              <CopyOutlined />
              Clone
            </Menu.Item>
          </Menu>
        );
        return (
          <React.Fragment>
            <Dropdown overlay={menu}>
              <Button size="small" className="mr-2">
                Actions <DownOutlined />
              </Button>
            </Dropdown>
            <Tooltip placement="top" title="Delete">
              <Popconfirm
                title="Are you sure?"
                onConfirm={() => {
                  remove(record);
                }}
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              >
                <ButtonActions
                  size="small"
                  type="danger"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </React.Fragment>
        );
      },
    },
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
