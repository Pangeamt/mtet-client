import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Button,
  Progress,
  message,
  Table,
  Typography,
  Card,
  Layout,
} from "antd";
import numeral from "numeral";
import styled from "styled-components";
import { navigate } from "@reach/router";

import { AppContext } from "./../../AppContext";
import IMAGE from "./undraw_body_text_l3ld.png";

import {
  handleError,
  getEvaluatorsTasksV1,
  finishTask,
} from "./../../services";

const { Title, Text } = Typography;
const { Content } = Layout;

const TextSub = styled(Text)`
  font-size: 1.1875rem;
  font-weight: 300;
`;

const Dashboard = () => {
  const { user } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await getEvaluatorsTasksV1();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const goToTask = (task) => {
    navigate(`/evaluator/tasks/${task.id}`);
  };

  const finish = async (task) => {
    try {
      setLoading(true);
      await finishTask(task.id);
      fetch();
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "TaskId",
      dataIndex: "TaskId",
      key: "TaskId",
    },
    {
      title: "Project",
      key: "project",
      render: (text, record) => {
        return <span>{record.project.name}</span>;
      },
    },
    {
      title: "Tuvs",
      key: "tuvs",
      render: (text, record) => {
        return <span>{record.total}</span>;
      },
    },
    {
      title: "Complete",
      key: "complete",
      render: (text, record) => {
        return <span>{record.completes}</span>;
      },
    },
    {
      title: "Progress",
      key: "complete",
      render: (text, record) => {
        return (
          <Progress
            percent={numeral((record.completes * 100) / record.total).format(
              "0.00"
            )}
          />
        );
      },
    },
    {
      title: "",
      key: "address",
      width: 200,
      render: (text, record) => {
        return (
          <React.Fragment>
            {record.completes === record.total && (
              <Button
                className="right ml-2"
                onClick={() => {
                  finish(record);
                }}
                style={{ width: 80 }}
                type="primary"
                size="small"
              >
                Finish
              </Button>
            )}
            <Button
              className="right"
              onClick={() => {
                goToTask(record);
              }}
              style={{ width: 80 }}
              type="primary"
              size="small"
            >
              {record.completes > 0 ? "Continue" : "Start"}
            </Button>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <Content style={{ padding: 50 }}>
      <Row style={{ marginBottom: 20 }} type="flex" justify="center">
        <Col xs={24}>
          <Title style={{ marginBottom: 0 }} level={2}>
            {" "}
            Hello {user.nickname}!
          </Title>
          <TextSub>
            Here you will be shown the tasks assigned to you and the status of
            each of them.
          </TextSub>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card className="img-card-v1" style={{ height: "340px" }}>
            <div
              className="img-card__cover"
              style={{
                backgroundImage: `url('${IMAGE}')`,
              }}
            ></div>
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card style={{ minHeight: 340, padding: 20 }}>
            <Row>
              <Col>
                <Title underline level={4}>
                  Your assigned tasks
                </Title>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table
                  loading={loading}
                  size="small"
                  dataSource={tasks}
                  columns={columns}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard;
