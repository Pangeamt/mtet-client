import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Button,
  Progress,
  message,
  Table,
  Typography,
  Card
} from "antd";
import axios from "axios";
import numeral from "numeral";
import { navigate } from "@reach/router";

import { HOST_API } from "./../../config";
import { AppContext } from "./../../AppContext";
import IMAGE from "./undraw_body_text_l3ld.png";

const { Title } = Typography;

const Dashboard = () => {
  const { user, token } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      setLoading(true);
      axios.defaults.headers.common["x-access-token"] = token;
      const { data } = await axios.get(`${HOST_API}/v1/tasks/evaluator`);
      setTasks(data);
      setLoading(false);
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const goToTask = task => {
    navigate(`/evaluator/tasks/${task.id}`);
  };

  const columns = [
    {
      title: "TaskId",
      dataIndex: "TaskId",
      key: "TaskId"
    },
    {
      title: "Project",
      key: "project",
      render: (text, record) => {
        return <span>{record.project.name}</span>;
      }
    },
    {
      title: "Tuvs",
      key: "tuvs",
      render: (text, record) => {
        return <span>{record.total}</span>;
      }
    },
    {
      title: "Complete",
      key: "complete",
      render: (text, record) => {
        return <span>{record.complete}</span>;
      }
    },
    {
      title: "Progress",
      key: "complete",
      render: (text, record) => {
        return (
          <Progress
            percent={numeral((record.complete * 100) / record.total).format(
              "0.00"
            )}
          />
        );
      }
    },
    {
      title: "",
      key: "address",
      width: 120,
      render: (text, record) => {
        return (
          <Button
            className="right"
            onClick={() => {
              goToTask(record);
            }}
            style={{ width: 80 }}
            type="primary"
            size="small"
          >
            {record.complete > 0 ? "Continue" : "Start"}
          </Button>
        );
      }
    }
  ];

  return (
    <div className="container mt-5">
      <article className="article">
        <Row>
          <Col>
            <div class="img-card__body img-card__body--left">
              <h2 class="img-card__title text-capitalize">
                Hello {user.nickname}!
              </h2>
              <p class="img-card__desc lead">
                Here you will be shown the tasks assigned to you and the status
                of each of them.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={6} className="p-2">
            <article className="img-card-v1 mb-4" style={{ height: "340px" }}>
              <div
                className="img-card__cover"
                style={{
                  backgroundImage: `url('${IMAGE}')`
                }}
              ></div>
            </article>
          </Col>
          <Col xs={24} md={18} className="p-2">
            <Card style={{ minHeight: 340 }}>
              <Row>
                <Col>
                  <Title underline level={4}>
                    Your assigned tasks
                  </Title>
                </Col>
              </Row>
              <Row>
                <Col>
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
      </article>
    </div>
  );
};

export default Dashboard;
