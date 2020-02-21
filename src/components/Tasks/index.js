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
  Icon,
  Card,
  Tooltip,
  Popconfirm
} from "antd";
import axios from "axios";
import { HOST_API } from "./../../config";
import { AppContext } from "./../../AppContext";
import TaskForm from "./../TaskForm";
import numeral from "numeral";

import "./style.css";

const { Title, Text } = Typography;

const Tasks = ({ project }) => {
  const { token } = useContext(AppContext);
  const tuvs = project.projects || [];

  const [visible, setVisible] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);
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
      setLoading(true);
      axios.defaults.headers.common["x-access-token"] = token;
      const { data } = await axios.get(`${HOST_API}/v1/tasks`, {
        params: {
          project: project.id
        }
      });
      setTasks(data);
      setLoadingActive(false);
      setLoading(false);
    } catch (error) {
      message.error(error.message);
      setLoading(true);
    }
  };

  const remove = async (record, value) => {
    try {
      setLoadingActive(`load-${record.id}`);
      axios.defaults.headers.common["x-access-token"] = token;
      await axios({
        method: "delete",
        url: `${HOST_API}/v1/tasks/${record.id}`
      });
      fetch();

      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoadingActive(false);
    }
  };

  const handleCancel = e => {
    setVisible(false);
  };
  const handleFormCancel = e => {
    setVisibleForm(false);
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
      setVisibleForm(false);
      fetch();

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
      setLoadingActive(`restart-${task}`);
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

  const active = async task => {
    try {
      setLoadingActive(`active-${task}`);
      axios.defaults.headers.common["x-access-token"] = token;
      await axios({
        method: "patch",
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
            <Row>
              <Col xs={20}>
                {`${record.user.nickname.toUpperCase()}`}
                <br />
                <Icon type="mail" /> {record.user.email}
              </Col>
              <Col xs={4}>
                <Button
                  style={{
                    marginTop: 10
                  }}
                  onClick={() => {
                    showModal(record);
                  }}
                  icon="user"
                  size="small"
                ></Button>
              </Col>
            </Row>
          );
        } else {
          return (
            <Button
              className="assign-e"
              icon="plus"
              onClick={() => {
                showModal(record);
              }}
              size="small"
            >
              Assign evaluator
            </Button>
          );
        }
      }
    },
    {
      title: "Source/Reference",
      width: 140,
      dataIndex: "showSourceText",
      render: (text, record) => {
        return (
          <div>
            &nbsp;&nbsp;
            {record.showReferenceText ? (
              <Icon type="eye" theme="twoTone" twoToneColor="#52c41a" />
            ) : (
              <Icon
                type="eye-invisible"
                theme="twoTone"
                twoToneColor="#eb2f96"
              />
            )}
            &nbsp;/&nbsp;
            {text ? (
              <Icon type="eye" theme="twoTone" twoToneColor="#52c41a" />
            ) : (
              <Icon
                type="eye-invisible"
                theme="twoTone"
                twoToneColor="#eb2f96"
              />
            )}
          </div>
        );
      }
    },

    {
      title: "Complete %",
      key: "complete",
      render: (text, record) => {
        return (
          <span>
            <Progress
              percent={numeral((record.complete * 100) / record.total).format(
                "0.00"
              )}
            />
          </span>
        );
      }
    },
    {
      title: "",
      key: "restart",
      width: 120,
      render: (text, record) => {
        return (
          <React.Fragment>
            {!record.active && (
              <Popconfirm
                onConfirm={() => {
                  remove(record, false);
                }}
                title="Are you sure？"
                okText="Yes"
                cancelText="No"
              >
                <Button
                  className="ml-2 right"
                  loading={loadingActive === `load-${record.id}`}
                  icon="delete"
                  type="danger"
                  size="small"
                ></Button>
              </Popconfirm>
            )}

            <Tooltip placement="top" title="Restart Task">
              <Button
                className="ml-2 right"
                loading={loadingActive === `restart-${record.id}`}
                onClick={() => {
                  restart(record.id);
                }}
                size="small"
                icon="reload"
              ></Button>
            </Tooltip>
            <Tooltip placement="top" title="Activate/Deactivate Task">
              <Button
                className="right"
                loading={loadingActive === `active-${record.id}`}
                onClick={() => {
                  active(record.id);
                }}
                size="small"
                type={record.active ? "primary" : "danger"}
                icon={record.active ? "check" : "close"}
              ></Button>
            </Tooltip>
          </React.Fragment>
        );
      }
    }
  ];

  const e_columns = [
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
      render: text => {
        return <span className="text-capitalize">{text}</span>;
      }
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
            disabled={
              selectedTask.user ? record.id === selectedTask.user.id : false
            }
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
      <Col xs={24} className="p-2">
        <Button
          disabled={loading}
          style={{ float: "right", position: "relative", zIndex: 100 }}
          className="mb-2"
          size="small"
          type="primary"
          onClick={() => {
            setVisibleForm(true);
          }}
        >
          Create Tasks
        </Button>
        <Table
          loading={loading}
          size="small"
          dataSource={tasks}
          columns={t_columns}
        />
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
      <Modal
        footer={false}
        title="Create Tasks"
        visible={visibleForm}
        onCancel={handleFormCancel}
      >
        <Row>
          <Col xs={24} className="p-2">
            <Row>
              {collectionsTasks.length === 0 && (
                <Col xs={24}>
                  <TaskForm
                    create={createTasks}
                    project={project}
                    tasks={collectionsTasks}
                  />
                </Col>
              )}

              {collectionsTasks.length > 0 && (
                <Col xs={24} className="p-2">
                  <Row
                    style={{
                      backgroundColor: "#f0f0ff",
                      padding: "5px 10px"
                    }}
                  >
                    <Col>
                      <Card>
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
                      </Card>
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
                        disabled={loading}
                        style={{ float: "right" }}
                        type="danger"
                        onClick={() => {
                          setCollectionsTasks([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Modal>
    </Row>
  );
};

export default Tasks;
