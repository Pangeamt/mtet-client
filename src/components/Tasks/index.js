import React, { useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Table,
  message,
  Modal,
  Button,
  List,
  Typography,
  Progress,
  Icon
} from "antd";
import axios from "axios";
import { HOST_API } from "./../../config";
import { AppContext } from "./../../AppContext";
import TaskForm from "./../TaskForm";

import "./style.css";

const { Title, Text } = Typography;

const Tasks = ({ project }) => {
  const { token } = useContext(AppContext);
  const tuvs = project.Tuvs || [];

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingActive, setLoadingActive] = useState(false);
  const [evaluators, setEvaluators] = useState([]);
  const [collectionsTasks, setCollectionsTasks] = useState([]);
  const [tus, setTus] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);

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
      axios.defaults.headers.common["x-access-token"] = token;
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
      axios.defaults.headers.common["x-access-token"] = token;
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

  const handleCancel = e => {
    setVisible(false);
  };

  const createTasks = (values, form) => {
    const {
      numberTasks,
      overlappingTuvs,
      percentageEvaluationsRandomlyRepeated,
      showSourceText,
      showReferenceText
    } = values;

    const nTus = Object.keys(tus).length;
    const txe = parseInt(nTus / numberTasks) + 1;
    const copyTus = [];
    Object.keys(tus).map(item => {
      copyTus.push(tus[item]);
    });

    const newTasks = [];
    for (let i = 0; i < numberTasks; i++) {
      let aux = {
        tus: [],
        tuvs: 0,
        showSourceText,
        showReferenceText
      };

      for (let j = 0; j < txe; j++) {
        const pop = copyTus.pop();
        if (pop) {
          aux.tus.push(pop);
          aux.tuvs += pop.length;
        }
      }
      newTasks.push(aux);
    }

    if (overlappingTuvs > 0) {
      const nt = parseInt((txe * overlappingTuvs) / 100); //5% Overlapping

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
        aux.map(item => {
          newTasks[i].tus.push(item);
          newTasks[i].tuvs += item.length;
        });
      }
    }
    if (percentageEvaluationsRandomlyRepeated) {
      newTasks.forEach(element => {
        let aux = element.tus;
        const ntr = parseInt(
          (element.tus.length * percentageEvaluationsRandomlyRepeated) / 100
        );

        for (let i = 0; i < ntr; i++) {
          const pos = Math.floor(Math.random() * ntr + 1);
          element.tus.push(aux[pos]);
          element.tuvs += aux[pos].length;
        }
      });
    }

    setCollectionsTasks(newTasks);
  };

  const create = async () => {
    try {
      setLoading(true);
      axios.defaults.headers.common["x-access-token"] = token;
      await axios({
        method: "post",
        url: `${HOST_API}/v1/tasks`,
        data: { tasks: collectionsTasks, project: project.id }
      });

      setCollectionsTasks([]);
      fetch();
      setLoading(false);

      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const assign = async evaluator => {
    try {
      setLoadingActive(`assign-${evaluator}`);
      axios.defaults.headers.common["x-access-token"] = token;
      await axios({
        method: "post",
        url: `${HOST_API}/v1/tasks/${selectedTask.id}`,
        data: { evaluator }
      });

      fetch();
      setLoadingActive(false);
      handleCancel();
      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoadingActive(false);
    }
  };

  const restart = async task => {
    try {
      setLoadingActive(`assign-${task}`);
      axios.defaults.headers.common["x-access-token"] = token;
      await axios({
        method: "put",
        url: `${HOST_API}/v1/tasks/${task}`
      });

      fetch();
      setLoadingActive(false);
      handleCancel();
      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoadingActive(false);
    }
  };

  const showModal = selected => {
    setSelectedTask(selected);
    setVisible(true);
  };

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
        if (record.user) {
          return (
            <span>
              {`${record.user.nickname.toUpperCase()}`}
              <br />
              <Icon type="mail" /> {record.user.email}
            </span>
          );
        } else {
          return (
            <Button
              onClick={() => {
                showModal(record);
              }}
              type="primary"
              size="small"
            >
              Assign evaluator
            </Button>
          );
        }
      }
    },
    {
      title: "Active",
      key: "active",
      render: (text, record) => {
        if (record.active) {
          return (
            <Button
              disabled={!record.user}
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
              disabled={!record.user}
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
    },
    {
      title: "",
      key: "restart",
      render: (text, record) => {
        if (record.active || record.user) {
          return (
            <Button
              loading={loadingActive === `restart-${record.id}`}
              onClick={() => {
                restart(record.id);
              }}
              type="danger"
              size="small"
              icon="reload"
            >
              Restart
            </Button>
          );
        }
      }
    }
  ];

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
    },
    {
      title: "",
      key: "select",
      render: (text, record) => {
        return (
          <Button
            loading={loadingActive === `assign-${record.id}`}
            onClick={() => {
              assign(record.id);
            }}
            type="primary"
            size="small"
          >
            Select
          </Button>
        );
      }
    }
  ];
  return (
    <Row>
      <Col xs={24} md={12} className="p-2">
        <Table size="small" dataSource={tasks} columns={t_columns} />
      </Col>
      <Col xs={24} md={12} className="p-2">
        <Row>
          <Col xs={24} md={16}>
            <TaskForm
              create={createTasks}
              project={project}
              tasks={collectionsTasks}
            />
          </Col>
          <Col xs={24} md={8}>
            {collectionsTasks.length > 0 && (
              <Row>
                <Col>
                  <List
                    size="small"
                    header={<Title level={4}>New Tasks</Title>}
                    bordered
                    dataSource={collectionsTasks}
                    renderItem={(item, i) => (
                      <List.Item>
                        <Row
                          type="flex"
                          justify="space-between"
                          className="w-100"
                        >
                          <Col xs={4}>{i + 1}</Col>
                          <Col xs={10}>
                            #Tus: <Text underline>{item.tus.length}</Text>
                          </Col>
                          <Col xs={10}>
                            #Tuvs: <Text underline>{item.tuvs}</Text>
                          </Col>
                        </Row>
                      </List.Item>
                    )}
                  />
                </Col>
                <Col className="my-5">
                  <Button
                    className="ml-2"
                    style={{ float: "right" }}
                    type="primary"
                    loading={loading}
                    onClick={create}
                  >
                    Confirm
                  </Button>
                  <Button
                    style={{ float: "right" }}
                    type="danger"
                    onClick={() => {
                      setCollectionsTasks([]);
                    }}
                  >
                    Clean
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Col>
      <Modal
        title="Evaluators"
        visible={visible}
        onCancel={handleCancel}
        footer={false}
      >
        <Table
          className="w-100"
          size="small"
          columns={e_columns}
          dataSource={evaluators}
        />
      </Modal>
    </Row>
  );
};

export default Tasks;
