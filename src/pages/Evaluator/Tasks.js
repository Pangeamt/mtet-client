import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Card,
  Pagination,
  message,
  Spin,
  Divider,
  Typography,
  Row,
  Col,
  Layout,
  Alert,
} from "antd";
import { navigate } from "@reach/router";
import styled from "styled-components";

import Tu from "./../../components/Tu";
import { handleError, saveTask, getEvaluatorsTasks } from "./../../services";

const { Text } = Typography;
const { Content } = Layout;

const TextLink = styled(Text)`
  cursor: pointer;

  &:hover {
    color: #1890ff;
    text-decoration: underline;
    font-weight: 500;
  }
`;

const ContentWrapper = styled(Content)`
  padding: 50px 0;
`;

const Tasks = ({ id }) => {
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tuvs, setTuvs] = useState([]);
  const [task, setTask] = useState(null);
  const [tu, setTu] = useState(null);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetch = async (restart = true) => {
    try {
      setLoading(true);
      const {
        data: { docs, task },
      } = await getEvaluatorsTasks(id);

      setTuvs(docs);
      setTask(task);
      if (docs.length && restart) {
        let stop = 0;
        for (let i = 0; i < docs.length; i++) {
          let complete = true;
          for (let j = 0; j < docs[i].tuvs.length; j++) {
            if (!docs[i].tuvs[j].complete) {
              stop = i;
              complete = false;
              break;
            }
          }
          if (!complete) break;
        }
        setTu(docs[stop]);
        setCurrent(stop + 1);
      }
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const save = async (values) => {
    message.loading("Action in progress..", 0);
    try {
      await saveTask(values, task.id);
      fetch(false);
      message.destroy();
      nextPage();
      message.success("Successful Action!");
    } catch (error) {
      message.destroy();
      handleError(error);
    }
  };

  const onChange = (pageNumber) => {
    setCurrent(pageNumber);
    setTu(tuvs[pageNumber - 1]);
  };

  const nextPage = () => {
    if (current >= tuvs.length) {
      setCurrent(1);
      setTu(tuvs[0]);
      navigate(`/evaluator`);
    } else {
      setCurrent(current + 1);
      setTu(tuvs[current]);
    }
  };

  const getSegments = (tu) => {
    const segments = {
      next: [],
      prev: [],
    };
    for (let i = 0; i < tuvs.length; i++) {
      if (tu.tuId === tuvs[i].tuId) {
        for (let j = 1; j <= task.project.segments; j++) {
          if (tuvs[i + j]) {
            segments.next.push(tuvs[i + j]);
          }
        }
        for (let j = 1; j <= task.project.segments; j++) {
          if (tuvs[i - j]) {
            segments.prev.push(tuvs[i - j]);
          }
        }
        break;
      }
    }
    return segments;
  };

  const isComplete = (tuvs) => {
    let complete = true;
    tuvs.forEach((element) => {
      if (!element.complete) complete = false;
    });
    return complete;
  };

  return (
    <ContentWrapper>
      <Card style={{ padding: 20 }}>
        <Row>
          <Col xs={24} md={12}>
            <Row style={{ display: "flex", justifyContent: "space-between" }}>
              <Col xs={24} md={12}>
                <Text underline strong>
                  {task
                    ? `${task.project.name} (TaskId ${task.id} ${
                        tu ? `/ TuId ${tu.tuId}` : null
                      })`
                    : null}
                </Text>
              </Col>
              {tu && tu.tuvs && isComplete(tu.tuvs) && (
                <Col xs={24} md={6} style={{ margin: "5px 0", float: "right" }}>
                  <Alert message="This item has been modified" type="success" />
                </Col>
              )}
              {console.log(tu)}
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <Link className="right" to="/evaluator">
              {" "}
              <TextLink>
                {" "}
                <ArrowLeftOutlined /> Tasks
              </TextLink>
            </Link>{" "}
          </Col>
        </Row>
        <Spin spinning={loading}>
          {tu && (
            <React.Fragment>
              <Tu
                task={task}
                key={tu.tuId}
                tu={tu}
                save={save}
                segments={getSegments(tu)}
              ></Tu>
            </React.Fragment>
          )}
          <Divider />
          <Pagination
            key={current}
            defaultCurrent={current}
            className="right"
            pageSize={1}
            total={tuvs.length}
            onChange={onChange}
          />
        </Spin>
      </Card>
    </ContentWrapper>
  );
};

export default Tasks;
