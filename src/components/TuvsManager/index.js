import React, { useState, useEffect } from "react";
import { Table, Button, Icon, Input, Row, Col, Tag, Typography } from "antd";
import Highlighter from "react-highlight-words";
import "./style.css";
const { Text } = Typography;

const TuvsManager = ({ tuvs }) => {
  const [tus, setTus] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => {
    const obj = {};
    tuvs.forEach(element => {
      if (obj[element.tuId]) {
        if (element.origin === "Source")
          obj[element.tuId].source = element.text;
        if (element.origin === "Reference")
          obj[element.tuId].reference = element.text;
        if (element.origin !== "Source" && element.origin !== "Reference") {
          obj[element.tuId].texts.push({
            source: element.origin,
            texts: element.text
          });
        }
      } else {
        let aux = {
          source: "",
          tuId: element.tuId,
          reference: "",
          language: element.language,
          texts: []
        };

        if (element.origin === "Source") aux.source = element.text;
        if (element.origin === "Reference") aux.reference = element.text;
        if (element.origin !== "Source" && element.origin !== "Reference") {
          aux.texts.push({
            source: element.origin,
            texts: element.text
          });
        }
        obj[element.tuId] = aux;
      }
    });
    const array = [];
    Object.keys(obj).forEach(element => {
      array.push(obj[element]);
    });
    setTus(array);
  }, [tuvs]);

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            setSearchText(node);
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
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
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchText.select());
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      )
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText("");
  };

  const expandedRowRender = record => {
    const cols = [
      { title: "Origin", dataIndex: "source", key: "origin" },
      { title: "Translation", dataIndex: "texts", key: "translation" }
    ];

    return (
      <Table
        className="nested-table"
        columns={cols}
        dataSource={record.texts}
        pagination={false}
        size="small"
      />
    );
  };

  const columns = [
    {
      title: "Tu ID",
      dataIndex: "tuId",
      key: "tuId",
      //   ...getColumnSearchProps("origin"),
      render: text => <span>{text}</span>
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      //   ...getColumnSearchProps("origin"),
      render: text => (
        <span>
          {" "}
          <Tag color="geekblue" key={text}>
            {text.toUpperCase()}
          </Tag>
        </span>
      )
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      //   ...getColumnSearchProps("origin"),
      render: text => <Text>{text}</Text>
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      //   ...getColumnSearchProps("origin"),
      render: text => <Text>{text}</Text>
    }
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
      expandedRowRender={expandedRowRender}
      pagination={{ pageSize: 25 }}
    />
  );
};

export default TuvsManager;
