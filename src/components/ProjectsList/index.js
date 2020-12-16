import React, { useState } from "react";

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
  Input,
  Space,
} from "antd";

import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

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
  handleTableChange,
  pagination,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchInput, setSearchInput] = useState(null);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            setSearchInput(node);
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (record[dataIndex]) {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return false;
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => {
          if (searchInput) searchInput.select();
        });
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const model = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => parseInt(a.id) - parseInt(b.id),
      ...getColumnSearchProps("id"),
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name - b.name,
      ...getColumnSearchProps("name"),
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",

      sorter: (a, b) => a.source - b.source,
      ...getColumnSearchProps("source"),
    },
    {
      title: "Target",
      dataIndex: "target",
      key: "target",

      sorter: (a, b) => a.target - b.target,
      ...getColumnSearchProps("target"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "#Tus",

      dataIndex: "nTus",
      key: "nTus",
    },
    {
      title: "#Tuvs",
      dataIndex: "nTuvs",
      key: "nTuvs",
    },
    // {
    //   title: "#Tuvs",
    //   dataIndex: "tuvs",
    //   key: "tuvs",
    // },
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
            {record.tuvs && record.tuvs.length > 0 && (
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

            {record.tuvs && record.tuvs.length === 0 && (
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
      onChange={handleTableChange}
      pagination={pagination}
      rowKey={(record) => record.id}
    />
  );
};

export default ProjectsList;
