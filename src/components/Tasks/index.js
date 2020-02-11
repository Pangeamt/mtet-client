import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Table,
  message,
  Alert,
  Button,
  Typography,
  Progress,
  Icon
} from "antd";
import axios from "axios";
import { HOST_API } from "./../../config";

import "./style.css";

const { Title } = Typography;

const Tasks = ({ project }) => {
  const tuvs = project.Tuvs || [];

  const [loading, setLoading] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);
  const [evaluators, setEvaluators] = useState([]);
  const [collectionsTasks, setCollectionsTasks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [tus, setTus] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchEvaluators();
    fetch();
    const obj = {};
    tuvs.forEach(element => {
      if (obj[element.tuId]) {
        obj[element.tuId].push(element.id);
      } else {
        obj[element.tuId] = [];
        obj[element.tuId].push(element.id);
      }
    });
    setTus(obj);
  }, []);

  const fetchEvaluators = async () => {
    try {
      const { data } = await axios.get(`${HOST_API}/v1/users/evaluators`);
      setEvaluators(data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const fetch = async () => {
    try {
      const { data } = await axios.get(`${HOST_API}/v1/tasks`, {
        params: {
          project: project.id
        }
      });
      setTasks(data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const active = async (record, value) => {
    try {
      setLoadingActive(`load-${record.id}`);
      const {
        data: { doc }
      } = await axios({
        method: "patch",
        url: `${HOST_API}/v1/tasks/${record.id}`,
        data: { active: value }
      });
      const ntasks = tasks.map(item => {
        if (item.id === record.id) {
          item.active = doc.active;
        }
        return item;
      });
      setTasks(ntasks);
      setLoadingActive(false);

      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoadingActive(false);
    }
  };

  const e_columns = [
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    }
  ];
  const c_columns = [
    {
      title: "Evaluators",
      key: "evaluators",
      render: (text, record) => {
        return <span>{record.evaluator.nickname}</span>;
      }
    },
    {
      title: "Tus",
      key: "tus",
      render: (text, record) => {
        return <span>{record.tus.length}</span>;
      }
    }
  ];
  const t_columns = [
    {
      title: "Id",
      key: "id",
      dataIndex: "id"
    },
    {
      title: "Evaluator",
      key: "evaluator",
      render: (text, record) => {
        return (
          <span>
            {`${record.user.nickname.toUpperCase()}`}
            <br />
            <Icon type="mail" /> {record.user.email}
          </span>
        );
      }
    },
    {
      title: "Active",
      key: "active",
      render: (text, record) => {
        if (record.active) {
          return (
            <Button
              onClick={() => {
                active(record, false);
              }}
              loading={loadingActive === `load-${record.id}`}
              icon="check"
              type="primary"
              shape="circle"
              size="small"
            ></Button>
          );
        } else {
          return (
            <Button
              onClick={() => {
                active(record, true);
              }}
              loading={loadingActive === `load-${record.id}`}
              className="stop-button"
              icon="stop"
              type="danger"
              shape="circle"
              size="small"
            ></Button>
          );
        }
      }
    },
    {
      title: "Complete",
      key: "complete",
      render: (text, record) => {
        return (
          <span>
            <Progress
              percent={(100 * record.complete) / record.total}
              status="active"
            />
          </span>
        );
      }
    }
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelected(selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name
    })
  };

  const createTasks = () => {
    const ntus = Object.keys(tus).length;
    const txe = ntus / selected.length;
    const copyTus = [];
    Object.keys(tus).map(item => {
      copyTus.push(tus[item]);
    });

    const newTasks = [];
    selected.map(item => {
      let aux = {
        evaluator: item,
        tus: []
      };
      for (let i = 0; i < txe; i++) {
        const pop = copyTus.pop();
        if (pop) aux.tus.push(pop);
      }
      newTasks.push(aux);
    });

    if (project.evaluationsOverlap) {
      const nt = parseInt((txe * 5) / 100); //5% Overlapping

      for (let i = 0; i < newTasks.length; i++) {
        let aux = [];
        for (let j = 0; j < newTasks.length; j++) {
          if (i !== j) {
            newTasks[j].tus.forEach((element, index) => {
              if (index < nt) {
                aux.push(element);
              }
            });
          }
        }
        aux.map(item => newTasks[i].tus.push(item));
      }
    }
    if (project.percentageEvaluationsRandomlyRepeated) {
      newTasks.forEach(element => {
        let aux = element.tus;
        const ntr = parseInt(
          (element.tus.length * project.percentageEvaluationsRandomlyRepeated) /
            100
        );

        for (let i = 0; i < ntr; i++) {
          const pos = Math.floor(Math.random() * ntr + 1);
          element.tus.push(aux[pos]);
        }
      });
    }
    setCollectionsTasks(newTasks);
  };

  const create = async (values, form) => {
    try {
      setLoading(true);

      const req = await axios({
        method: "post",
        url: `${HOST_API}/v1/tasks`,
        data: { tasks: collectionsTasks, project: project.id }
      });
      console.log(req);
      setCollectionsTasks([]);
      setLoading(false);

      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col xs={24} md={12} className="p-2">
        <Table size="small" dataSource={tasks} columns={t_columns} />
      </Col>
      <Col xs={24} md={12} className="p-2">
        <Row>
          <Col>
            <Alert
              className="mb-2"
              message="Select the users to whom the tasks will be assigned."
              type="info"
              showIcon
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              className="w-100"
              rowSelection={rowSelection}
              size="small"
              columns={e_columns}
              dataSource={evaluators}
            />
          </Col>
        </Row>
        {collectionsTasks.length > 0 && (
          <Row>
            <Col>
              <Title level={4}>New Tasks</Title>
              <Table
                className="w-100"
                size="small"
                columns={c_columns}
                dataSource={collectionsTasks}
              />
            </Col>
          </Row>
        )}
        {collectionsTasks.length === 0 && (
          <Row>
            <Col>
              <Button
                disabled={selected.length < 1}
                style={{ float: "right" }}
                type="primary"
                onClick={createTasks}
              >
                Create Tasks
              </Button>
            </Col>
          </Row>
        )}
        {collectionsTasks.length > 0 && (
          <Row>
            <Col>
              <Button
                disabled={selected.length < 1}
                style={{ float: "right" }}
                type="primary"
                loading={loading}
                onClick={create}
              >
                Confirm creation of new tasks
              </Button>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
};

export default Tasks;
