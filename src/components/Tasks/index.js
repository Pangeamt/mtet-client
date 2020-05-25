import React, { useEffect, useState } from "react";

import {
  DeleteOutlined,
  EyeInvisibleTwoTone,
  EyeTwoTone,
  MailOutlined,
  PlusOutlined,
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Icon as LegacyIcon } from "@ant-design/compatible";
import {
  Row,
  Col,
  Table,
  message,
  Modal,
  Button,
  Typography,
  Progress,
  Card,
  Tooltip,
  Popconfirm,
} from "antd";
import numeral from "numeral";
import styled from "styled-components";

import TaskForm from "./../TaskForm";
import {
  handleError,
  getEvaluators,
  getTasks,
  removeTask,
  addTask,
  assignTask,
  restartTask,
  activeTask,
} from "./../../services";

import "./style.css";

const { Text } = Typography;

const ButtonActions = styled(Button)`
  margin-right: 10px;
  margin-left: 10px;
`;

const Tasks = ({ project }) => {
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
    tuvs.forEach((element) => {
      if (obj[element.tuId]) {
        obj[element.tuId].push(element.id);
      } else {
        obj[element.tuId] = [];
        obj[element.tuId].push(element.id);
      }
    });
    setTus(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvaluators = async () => {
    try {
      const { data } = await getEvaluators();
      setEvaluators(data);
    } catch (error) {
      handleError(error);
    }
  };

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await getTasks(project.id);
      setTasks(data);
      setLoadingActive(false);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(true);
    }
  };

  const remove = async (record) => {
    try {
      setLoadingActive(`load-${record.id}`);
      await removeTask(record.id);
      fetch();
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoadingActive(false);
    }
  };

  const handleCancel = (e) => {
    setVisible(false);
  };
  const handleFormCancel = (e) => {
    setVisibleForm(false);
  };



  const createTasks = (values, form) => {
    const {
      numberTasks,
      overlappingTuvs,
      percentageEvaluationsRandomlyRepeated,
      showSourceText,
      showReferenceText,
    } = values;

    const nTus = Object.keys(tus).length;
    const txe = parseInt(nTus / numberTasks) + 1;
    const copyTus = [];
    Object.keys(tus).forEach((item) => {
      copyTus.push(tus[item]);
    });

    const newTasks = [];
    for (let i = 0; i < numberTasks; i++) {
      let aux = {
        tus: [],
        tuvs: 0,
        showSourceText,
        showReferenceText,
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
        aux.forEach((item) => {
          newTasks[i].tus.push(item);
          newTasks[i].tuvs += item.length;
        });
      }
    }
    if (percentageEvaluationsRandomlyRepeated) {
      newTasks.forEach((element) => {
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
      await addTask(collectionsTasks, project.id);
      setCollectionsTasks([]);
      setVisibleForm(false);
      fetch();
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const assign = async (evaluator) => {
    try {
      setLoadingActive(`assign-${evaluator}`);
      await assignTask(evaluator, selectedTask.id);
      fetch();
      handleCancel();
      setLoadingActive(false);
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoadingActive(false);
    }
  };

  const restart = async (task) => {
    try {
      setLoadingActive(`restart-${task}`);
      await restartTask(task);
      fetch();
      setLoadingActive(false);
      handleCancel();
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoadingActive(false);
    }
  };

  const active = async (task) => {
    try {
      setLoadingActive(`active-${task}`);
      await activeTask(task);
      fetch();
      setLoadingActive(false);
      handleCancel();
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoadingActive(false);
    }
  };

  const showModal = (selected) => {
    setSelectedTask(selected);
    setVisible(true);
  };

  const t_columns = [
    {
      title: "Id",
      key: "id",
      dataIndex: "id",
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
                <MailOutlined /> {record.user.email}
              </Col>
              <Col xs={4}>
                <Button
                  style={{
                    marginTop: 10,
                  }}
                  onClick={() => {
                    showModal(record);
                  }}
                  icon={<UserOutlined />}
                  size="small"
                ></Button>
              </Col>
            </Row>
          );
        } else {
          return (
            <Button
              className="assign-e"
              icon={<PlusOutlined />}
              onClick={() => {
                showModal(record);
              }}
              size="small"
            >
              Assign evaluator
            </Button>
          );
        }
      },
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
              <EyeTwoTone twoToneColor="#52c41a" />
            ) : (
              <EyeInvisibleTwoTone twoToneColor="#eb2f96" />
            )}
            &nbsp;/&nbsp;
            {text ? (
              <EyeTwoTone twoToneColor="#52c41a" />
            ) : (
              <EyeInvisibleTwoTone twoToneColor="#eb2f96" />
            )}
          </div>
        );
      },
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
      },
    },
    {
      title: "",
      key: "restart",
      width: 150,
      render: (text, record) => {
        return (
          <React.Fragment>
           

            <Tooltip placement="top" title="Restart Task">
              <ButtonActions
                loading={loadingActive === `restart-${record.id}`}
                onClick={() => {
                  restart(record.id);
                }}
                size="small"
                icon={<ReloadOutlined />}
              ></ButtonActions>
            </Tooltip>

            <Tooltip placement="top" title="Activate/Deactivate Task">
              <ButtonActions
                loading={loadingActive === `active-${record.id}`}
                onClick={() => {
                  active(record.id);
                }}
                size="small"
                type={record.active ? "primary" : "danger"}
                icon={<LegacyIcon type={record.active ? "check" : "close"} />}
              ></ButtonActions>
            </Tooltip>

            {!record.active && (
              <Popconfirm
                onConfirm={() => {
                  remove(record);
                }}
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
              >
                <ButtonActions
                  loading={loadingActive === `load-${record.id}`}
                  icon={<DeleteOutlined />}
                  type="danger"
                  size="small"
                ></ButtonActions>
              </Popconfirm>
            )}
          </React.Fragment>
        );
      },
    },
  ];

  const e_columns = [
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
      render: (text) => {
        return <span className="text-capitalize">{text}</span>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
      },
    },
  ];
  return (
    <Row>
      <Col xs={24}>
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
        maskClosable={false}
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
        maskClosable={false}
        footer={false}
        title="Create Tasks"
        visible={visibleForm}
        onCancel={handleFormCancel}
      >
        <Row>
          <Col xs={24}>
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
                <Col xs={24}>
                  <Row
                    style={{
                      backgroundColor: "#f0f0ff",
                      padding: "5px 10px",
                    }}
                  >
                    <Col span={24}>
                      <Row gutter={[5, 5]} className="w-100">
                        {collectionsTasks.map((item, i) => {
                          return (
                            <Col span={6}>
                              <Card style={{ padding: "10px 16px" }}>
                                <Row
                                  type="flex"
                                  justify="space-between"
                                  className="w-100"
                                >
                                  <Col xs={24}>{i + 1}</Col>
                                  <Col xs={24}>
                                    #Tus:{" "}
                                    <Text underline>{item.tus.length}</Text>
                                  </Col>
                                  <Col xs={24}>
                                    #Tuvs: <Text underline>{item.tuvs}</Text>
                                  </Col>
                                </Row>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                    <Col xs={24}>
                      <Button
                        style={{ float: "right", marginLeft: 10 }}
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
