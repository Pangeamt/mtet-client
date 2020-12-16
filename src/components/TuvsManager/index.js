import React, { useState, useEffect } from "react";
import { Table, Tag, Typography, Input, Space, Button } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import "./style.css";
const { Text } = Typography;

const TuvsManager = ({ tuvs }) => {
  const [tus, setTus] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchInput, setSearchInput] = useState(null);

  useEffect(() => {
    const obj = {};
    tuvs.forEach((element) => {
      if (obj[element.tuId]) {
        if (element.origin === "Source")
          obj[element.tuId].source = element.text;
        if (element.origin === "Reference")
          obj[element.tuId].reference = element.text;
        if (element.origin !== "Source" && element.origin !== "Reference") {
          obj[element.tuId].texts.push({
            source: element.origin,
            texts: element.text,
          });
        }
      } else {
        let aux = {
          source: "",
          tuId: element.tuId,
          reference: "",
          language: element.language,
          texts: [],
        };

        if (element.origin === "Source") aux.source = element.text;
        if (element.origin === "Reference") aux.reference = element.text;
        if (element.origin !== "Source" && element.origin !== "Reference") {
          aux.texts.push({
            source: element.origin,
            texts: element.text,
          });
        }
        obj[element.tuId] = aux;
      }
    });
    const array = [];
    Object.keys(obj).forEach((element, i) => {
      obj[element].key = i;
      array.push(obj[element]);
    });
    setTus(array);
  }, [tuvs]);

  const expandedRowRender = (record) => {
    const cols = [
      { title: "Origin", dataIndex: "source", key: "origin" },
      { title: "Translation", dataIndex: "texts", key: "translation" },
    ];

    const data = record.texts.map((item, i) => {
      item.key = `key-${i}`;
      return item;
    });

    return (
      <Table
        className="nested-table"
        columns={cols}
        dataSource={data}
        pagination={false}
        rowKey={(record) => record.key}
        size="small"
      />
    );
  };

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
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
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

  const columns = [
    {
      title: "Tu ID",
      dataIndex: "tuId",
      key: "tuId",
      width: 100,
      sorter: (a, b) => {
        return a.tuId.localeCompare(b.tuId);
      },
      ...getColumnSearchProps("tuId"),
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      sorter: (a, b) => {
        return a.language.localeCompare(b.language);
      },
      ...getColumnSearchProps("language"),
      render: (text) => (
        <span>
          {" "}
          <Tag color="geekblue" key={text}>
            {text.toUpperCase()}
          </Tag>
        </span>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      ...getColumnSearchProps("source"),
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      ...getColumnSearchProps("reference"),
      render: (text) => <Text>{text}</Text>,
    },
    // {
    //   title: "Translations",
    //   key: "Translations",
    //   //   ...getColumnSearchProps("origin"),
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         {record.texts.map(item => {
    //           return (
    //             <React.Fragment>
    //               <p>Origin:{item.source}</p><br/>
    //               <p>Text:{item.texts}</p><br/>
    //             </React.Fragment>
    //           );
    //         })}
    //       </div>
    //     );
    //   }
    // }
  ];
  return (
    <Table
      columns={columns}
      dataSource={tus}
      size="small"
      expandable={{ expandedRowRender }}
      pagination={{ pageSize: 25 }}
    />
  );
};

export default TuvsManager;
