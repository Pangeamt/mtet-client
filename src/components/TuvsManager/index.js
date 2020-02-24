import React, { useState, useEffect } from "react";
import { Table, Tag, Typography } from "antd";
import "./style.css";
const { Text } = Typography;

const TuvsManager = ({ tuvs }) => {
  const [tus, setTus] = useState([]);

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
