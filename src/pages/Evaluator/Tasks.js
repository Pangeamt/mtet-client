import React, { useState, useEffect, useContext } from "react";
import { Link } from "@reach/router";
import {
  Card,
  Pagination,
  message,
  Spin,
  Divider,
  Typography,
  Icon,
  Row,
  Col
} from "antd";
import { navigate } from "@reach/router";
import axios from "axios";
import styled from "styled-components";

import Tu from "./../../components/Tu";
import { AppContext } from "./../../AppContext";
import { HOST_API } from "./../../config";

const { Text, Title } = Typography;

const TextLink = styled(Text)`
  cursor: pointer;

  &:hover {
    color: #1890ff;
    text-decoration: underline;
    font-weight: 500;
  }
`;

const Tasks = ({ id }) => {
  const { token } = useContext(AppContext);

  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tuvs, setTuvs] = useState([]);
  const [task, setTask] = useState(null);
  const [tu, setTu] = useState(null);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async (restart = true) => {
    try {
      setLoading(true);
      axios.defaults.headers.common["x-access-token"] = token;
      const {
        data: { docs, task }
      } = await axios.get(`${HOST_API}/v1/tasks/${id}`);

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
      setLoading(false);
      message.error(error.message);
      if (error.message === "Request failed with status code 401") {
        navigate(`/evaluator`);
      }
    }
  };

  const save = async values => {
    message.loading("Action in progress..", 0);
    try {
      // Dismiss manually and asynchronously

      axios.defaults.headers.common["x-access-token"] = token;
      await axios({
        method: "post",
        url: `${HOST_API}/v1/tasks/evaluation/save`,
        data: { values, task: task.id }
      });

      fetch(false);
      message.destroy();
      nextPage();
      message.success("Successful Action!");
    } catch (error) {
      message.destroy();
      message.error(error.message);
      if (error.message === "Request failed with status code 401") {
        navigate(`/evaluator`);
      }
    }
  };

  const onChange = pageNumber => {
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

  return (
    <div className="container mt-5">
      <Card>
        <Row>
          <Col xs={24} md={12}>
            <Text underline strong>
              {task
                ? `${task.project.name} (TaskId ${task.id} ${
                    tu ? `/ TuId ${tu.tuId}` : null
                  })`
                : null}
            </Text>
          </Col>
          <Col xs={24} md={12}>
            <Link className="right" to="/evaluator">
              {" "}
              <TextLink>
                {" "}
                <Icon type="arrow-left" /> Tasks
              </TextLink>
            </Link>{" "}
          </Col>
        </Row>
        <Spin spinning={loading}>
          {tu && (
            <React.Fragment>
              <Tu task={task} key={tu.tuId} tu={tu} save={save}></Tu>
            </React.Fragment>
          )}
          <Divider />
          <Pagination
            key={current}
            defaultCurrent={current}
            className="mt-4 right"
            pageSize={1}
            total={tuvs.length}
            onChange={onChange}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default Tasks;
