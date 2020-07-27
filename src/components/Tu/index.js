import React, { useEffect, useState, useContext } from "react";
import { SaveOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Typography,
  Divider,
  Slider,
  InputNumber,
  Button,
  Alert,
  Radio,
} from "antd";

import EventListener from "react-event-listener";
import TabErrors from "./../TabErrors";
import { AppContext } from "./../../AppContext";

import "./style.css";

const { Paragraph, Title } = Typography;

const auxValue = {
  value: "0",
  subValue: "0",
  text: "",
};

const Tuv = ({ item, saveValue, saveJson, user, task }) => {
  const [tuv, setTuv] = useState(null);
  const [value, setValue] = useState(0);

  const [accuracy, setAccuracy] = useState(auxValue);
  const [fluency, setFluency] = useState(auxValue);
  const [terminology, setTerminology] = useState(auxValue);
  const [style, setStyle] = useState(auxValue);
  const [localeConvention, setLocaleConvention] = useState(auxValue);

  useEffect(() => {
    console.log("item", item);
    if (item) {
      setTuv(item);
      setValue(item.value);
      setAccuracy(JSON.parse(item.accuracy));
      setFluency(JSON.parse(item.fluency));
      setTerminology(JSON.parse(item.terminology));
      setStyle(JSON.parse(item.style));
      setLocaleConvention(JSON.parse(item.localeConvention));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (value) => {
    setValue(value);
    saveValue(tuv.id, value);
  };
  const onChangeV2 = (e) => {
    setValue(e.target.value);
    saveValue(tuv.id, e.target.value);
  };

  const onChangeV3 = (field, value) => {
    saveJson(tuv.id, field, value);
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
            {task && task.project.type === "zero-to-one-hundred" && (
              <Row style={{ padding: 10 }}>
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
            )}

            {task && task.project.type === "fluency" && (
              <Row style={{ padding: 10 }}>
                <Col>
                  <Radio.Group
                    onChange={onChangeV2}
                    value={value}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="0">Fluent</Radio.Button>
                    <Radio.Button value="1">Minor problems</Radio.Button>
                    <Radio.Button value="2">Major problems</Radio.Button>
                    <Radio.Button value="3 ">
                      Critical/Mistranslation
                    </Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            )}
            {task && task.project.type === "accuracy" && (
              <Row style={{ padding: 10 }}>
                <Col>
                  <Radio.Group
                    onChange={onChangeV2}
                    value={value}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="0">Accurate</Radio.Button>
                    <Radio.Button value="1">Minor problems</Radio.Button>
                    <Radio.Button value="2">Major problems</Radio.Button>
                    <Radio.Button value="3 ">
                      Critical/Mistranslation
                    </Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            )}

            {task && task.project.type === "mqm" && (
              <Row style={{ padding: 10 }}>
                <Col xs={24}>
                  <TabErrors
                    accuracy={accuracy}
                    setAccuracy={setAccuracy}
                    fluency={fluency}
                    setFluency={setFluency}
                    terminology={terminology}
                    setTerminology={setTerminology}
                    style={style}
                    setStyle={setStyle}
                    localeConvention={localeConvention}
                    setLocaleConvention={setLocaleConvention}
                    onChange={onChangeV3}
                  />
                </Col>
              </Row>
            )}
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
        array.push({
          id: element.id,
          value: element.value,
          accuracy: element.accuracy,
          fluency: element.fluency,
          terminology: element.terminology,
          style: element.style,
          localeConvention: element.localeConvention,
        });
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
  const saveJson = (id, field, value) => {
    tuvs.forEach((element) => {
      if (element.id === id) element[field] = value;
    });
    setTuvs(tuvs);
  };

  const keydownHandler = (e) => {
    if (e.keyCode === 13 && e.ctrlKey) {
      saveAll(tuvs);
    }
  };

  return (
    <Row>
      <EventListener target={document} onKeyDown={keydownHandler} />
      {data && (
        <Col>
          <Row>
            <Col xs={24}>
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
            <Col xs={24}>
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
                if (item.text) {
                  return (
                    <Tuv
                      task={task}
                      item={item}
                      user={user}
                      isLoading={isLoading}
                      saveValue={saveValue}
                      saveJson={saveJson}
                    />
                  );
                } else {
                  return (
                    <Alert
                      message={`Tuv incorrecto (${item.id})`}
                      type="error"
                    />
                  );
                }
              })}
              <Button
                onClick={() => {
                  saveAll(tuvs);
                }}
                className="right"
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
