import React, { useState, useEffect, useContext } from "react";
import { navigate } from "@reach/router";
import {
  Card,
  Table,
  Tabs,
  message,
  Slider,
  InputNumber,
  Button,
  Row,
  Col,
  Typography
} from "antd";
import axios from "axios";

import { AppContext } from "./../../AppContext";
import { HOST_API } from "./../../config";

const { Text } = Typography;
const { TabPane } = Tabs;

const Tasks = ({ id }) => {
  const { token } = useContext(AppContext);

  const [defaultCurrent, setDefaultCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingEvs, setLoadingEvs] = useState([]);
  const [tuvs, setTuvs] = useState([]);
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      axios.defaults.headers.common["x-access-token"] = token;
      const {
        data: { docs, task }
      } = await axios.get(`${HOST_API}/v1/tasks/${id}`);
      setTuvs(docs);
      setTask(task);

      let fp = 0;
      for (let i = 0; i < docs.length; i++) {
        if (!docs[i].complete) {
          fp = i;
          break;
        }
      }
      let _pag = parseInt(fp / 10) + 1;
      setDefaultCurrent(_pag);

      setLoading(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const modifyValue = (record, value) => {
    const q = tuvs.map(elem => {
      if (elem.id === record.id) {
        elem.value = value;
      }
      return elem;
    });
    setTuvs(q);
  };

  const addLoading = id => {
    const nameL = `save-${id}`;
    const le = loadingEvs;
    le.push(nameL);
    setLoadingEvs(le);
  };

  const delLoading = id => {
    const nameL = `save-${id}`;
    const le = loadingEvs.filter(item => item !== nameL);
    setLoadingEvs(le);
  };

  const isLoading = id => {
    const nameL = `save-${id}`;
    const le = loadingEvs.filter(item => item !== nameL);
    if (le && le.length) return true;
    return false;
  };

  const save = async record => {
    try {
      addLoading(record.id);
      axios.defaults.headers.common["x-access-token"] = token;
      await axios({
        method: "patch",
        url: `${HOST_API}/v1/tasks/evaluation/${record.id}`,
        data: { value: record.value }
      });

      const q = tuvs.map(elem => {
        if (elem.id === record.id) {
          elem.complete = true;
        }
        return elem;
      });
      setTuvs(q);
      delLoading(record.id);
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "From",
      dataIndex: "from",
      key: "from"
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: text => {
        if (task && task.showSourceText) {
          return <span>{text}</span>;
        } else {
          return <span>---</span>;
        }
      }
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: text => {
        if (task && task.showReferenceText) {
          return <span>{text}</span>;
        } else {
          return <span>---</span>;
        }
      }
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
      render: text => {
        return (
          <span>
            <Text code>{text}</Text>
          </span>
        );
      }
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (text, record) => {
        return (
          <Row>
            <Col span={12}>
              <Slider
                disabled={record.complete}
                min={0}
                max={100}
                onChange={e => {
                  modifyValue(record, e);
                }}
                value={parseInt(text)}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                disabled={record.complete}
                min={0}
                max={100}
                style={{ marginLeft: 16 }}
                value={parseInt(text)}
                onChange={e => {
                  modifyValue(record, e);
                }}
              />
            </Col>
            <Col span={4}>
              {!record.complete && (
                <Button
                  loading={isLoading(record.id)}
                  type="primary"
                  size="small"
                  icon="save"
                  style={{ float: "right", margin: "5px 0px 0 0" }}
                  onClick={() => {
                    save(record);
                  }}
                />
              )}
            </Col>
          </Row>
        );
      }
    }
  ];

  return (
    <div className="container mt-5">
      <Card>
        <Tabs defaultActiveKey="tuvs">
          <TabPane tab="Tuvs" key="tuvs">
            <Table
              key={defaultCurrent}
              loading={loading}
              size="small"
              dataSource={tuvs}
              columns={columns}
              pagination={{ defaultCurrent }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Tasks;
