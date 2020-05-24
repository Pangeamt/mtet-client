import React, { useEffect, useState, useContext } from "react";
import { SaveOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Typography,
  Divider,
  Slider,
  InputNumber,
  Button,
} from "antd";

import EventListener from "react-event-listener";
import { AppContext } from "./../../AppContext";

import "./style.css";

const { Paragraph, Title } = Typography;

const Tuv = ({ item, saveValue, user }) => {
  const [tuv, setTuv] = useState(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (item) {
      setTuv(item);
      setValue(item.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (value) => {
    setValue(value);
    saveValue(tuv.id, value);
  };

  return (
    <Row key={tuv ? tuv.value : ""}>
      {tuv && (
        <React.Fragment>
          <Col xs={24}>
            <Paragraph
              className="p-1"
              style={{
                backgroundColor: "#f0f2f5",
              }}
            >
              {tuv.text}
            </Paragraph>
          </Col>
          <Col xs={24}>
            <Row className="p-1">
              <Col span={12}>
                <Slider
                  disabled={user.id !== item.UserId}
                  min={0}
                  max={100}
                  onChange={onChange}
                  value={
                    typeof parseInt(value) === "number" ? parseInt(value) : 0
                  }
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  disabled={user.id !== item.UserId}
                  min={0}
                  max={100}
                  style={{ marginLeft: 16 }}
                  value={value}
                  onChange={onChange}
                />
              </Col>
            </Row>
          </Col>
        </React.Fragment>
      )}
    </Row>
  );
};

const Tu = ({ tu, isLoading, save, task, segments }) => {
  const { user } = useContext(AppContext);

  const [data, setData] = useState(null);
  const [tuvs, setTuvs] = useState([]);

  useEffect(() => {
    if (tu) {
      setData(tu);
      const array = [];
      tu.tuvs.forEach((element) => {
        array.push({ id: element.id, value: element.value });
      });
      setTuvs(array);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAll = (_tuvs) => {
    save(_tuvs);
  };

  const saveValue = (id, value) => {
    tuvs.forEach((element) => {
      if (element.id === id) element.value = value;
    });
    setTuvs(tuvs);
  };

  const keydownHandler = (e) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      saveAll(tuvs);
    }
  };

  return (
    <Row className="mt-2">
      <EventListener target={document} onKeyDown={keydownHandler} />
      {data && (
        <Col>
          <Row>
            <Col className="p-2 mt-2" xs={24}>
              <Title level={4} strong>
                Source ({data.sourceLang})
              </Title>
              {segments.prev.map((item) => (
                <Paragraph className="segments">
                  {task.showSourceText ? item.source : null}
                </Paragraph>
              ))}
              <Paragraph strong className="segments active">
                {task.showSourceText ? data.source : null}
              </Paragraph>

              {segments.next.map((item) => (
                <Paragraph className="segments">
                  {task.showSourceText ? item.source : null}
                </Paragraph>
              ))}
            </Col>
            <Col className="p-2 mt-2" xs={24}>
              <Title level={4} strong>
                Reference ({data.referenceLang})
              </Title>
              {segments.prev.map((item) => (
                <Paragraph className="segments">
                  {task.showSourceText ? item.reference : null}
                </Paragraph>
              ))}
              <Paragraph strong className="segments active">
                {task.showSourceText ? data.reference : null}
              </Paragraph>
              {segments.next.map((item) => (
                <Paragraph className="segments">
                  {task.showSourceText ? item.reference : null}
                </Paragraph>
              ))}
            </Col>
          </Row>
          <Divider />
          {data.tuvs && data.tuvs.length > 0 && (
            <React.Fragment>
              {data.tuvs.map((item) => {
                return (
                  <Tuv
                    item={item}
                    user={user}
                    isLoading={isLoading}
                    saveValue={saveValue}
                  />
                );
              })}
              <Button
                onClick={() => {
                  saveAll(tuvs);
                }}
                className="right mt-3"
                type="primary"
                icon={<SaveOutlined />}
              >
                Save
              </Button>
            </React.Fragment>
          )}
        </Col>
      )}
    </Row>
  );
};

export default Tu;
