import React, { useEffect, useState, useContext } from "react";
import { SaveOutlined } from "@ant-design/icons";
import styled from "styled-components";
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
  Popconfirm,
  Input,
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

const ColR = styled(Col)`
  background-color: #ffccc7;
  padding: 5px 15px;
  margin: 0px 5px;
  border-radius: 10px;
  margin-top: 15px;
  padding-bottom: 20px;
`;

const ColTR = styled(Col)`
  padding: 5px 15px;
  margin: 10px 5px;
`;

const ColL = styled(Col)`
  background-color: #bae7ff;
  padding: 5px 15px;
  margin: 0px 5px;
  border-radius: 10px;
  margin-top: 15px;
  padding-bottom: 20px;
`;

const isComplete = (tuvs) => {
  let complete = true;
  tuvs.forEach((element) => {
    if (!element.complete) complete = false;
  });
  return complete;
};

const Tuv = ({ item, saveValue, saveJson, saveTranslation, user, task }) => {
  const [tuv, setTuv] = useState(null);
  const [value, setValue] = useState(0);
  const [translation, setTranslation] = useState("");
  const [comment, setComment] = useState("");

  const [accuracy, setAccuracy] = useState(auxValue);
  const [fluency, setFluency] = useState(auxValue);
  const [terminology, setTerminology] = useState(auxValue);
  const [style, setStyle] = useState(auxValue);
  const [localeConvention, setLocaleConvention] = useState(auxValue);

  useEffect(() => {
    if (item) {
      setTuv(item);
      setValue(item.value);
      setAccuracy(JSON.parse(item.accuracy));
      setFluency(JSON.parse(item.fluency));
      setTerminology(JSON.parse(item.terminology));
      setStyle(JSON.parse(item.style));
      setLocaleConvention(JSON.parse(item.localeConvention));
      setTranslation(item.translation || "");
      setComment(item.comment || "");
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
  const onChangeV4 = (value) => {
    saveTranslation(tuv.id, value);
  };

  const onChangeComment = (e) => {
    setComment(e.target.value);
    saveJson(tuv.id, 'comment', e.target.value);
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
                padding: "5px 10px",
              }}
            >
              {tuv.text}
            </Paragraph>
          </Col>
          <Input.TextArea placeholder="Comment..." value={comment} onChange={onChangeComment}></Input.TextArea>
          <Col xs={24}>
            {task &&
              (task.project.type === "zero-to-one-hundred" ||
                !task.project.type) && (
                <Row style={{ padding: 10 }}>
                  <Col span={12}>
                    <Slider
                      disabled={user.id !== item.UserId}
                      min={0}
                      max={100}
                      onChange={onChange}
                      value={
                        typeof parseInt(value) === "number"
                          ? parseInt(value)
                          : 0
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
              <Row>
                <Col xs={24}>
                  <TabErrors
                    translation={translation}
                    setTranslation={setTranslation}
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
                    onChangeV4={onChangeV4}
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
          translation: element.translation,
          comment: element.comment,
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
  const saveTranslation = (id, translation) => {
    tuvs.forEach((element) => {
      if (element.id === id) element.translation = translation;
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
        <Col xs={24}>
          <Row>
            <ColR xs={24} md={10}>
              <Title level={4} strong style={{ marginBottom: 0 }}>
                Source ({data.sourceLang})
              </Title>
              <Divider style={{ margin: "5px 0px" }} />
              {segments.prev.map((item) => (
                <Paragraph className="segments" style={{ paddingLeft: 18 }}>
                  {task.showSourceText ? item.source : null}
                </Paragraph>
              ))}
              <Paragraph strong className="segments active">
                → {task.showSourceText ? data.source : null}
              </Paragraph>

              {segments.next.map((item) => (
                <Paragraph className="segments" style={{ paddingLeft: 18 }}>
                  {task.showSourceText ? item.source : null}
                </Paragraph>
              ))}
            </ColR>
            <ColL xs={24} md={12}>
              <Title level={4} strong style={{ marginBottom: 0 }}>
                Reference ({data.referenceLang})
              </Title>
              <Divider style={{ margin: "5px 0px" }} />
              {segments.prev.map((item) => (
                <Paragraph className="segments" style={{ paddingLeft: 18 }}>
                  {task.showSourceText ? item.reference : null}
                </Paragraph>
              ))}
              <Paragraph strong className="segments active">
                → {task.showSourceText ? data.reference : null}
              </Paragraph>
              {segments.next.map((item) => (
                <Paragraph className="segments" style={{ paddingLeft: 18 }}>
                  {task.showSourceText ? item.reference : null}
                </Paragraph>
              ))}
            </ColL>
          </Row>
          <Divider style={{ margin: "5px 0px" }} />
          {data.tuvs && data.tuvs.length > 0 && (
            <React.Fragment>
              <Row>
                {data.tuvs.map((item) => {
                  if (item.text) {
                    return (
                      <ColTR xs={24} md={10}>
                        <Tuv
                          task={task}
                          item={item}
                          user={user}
                          isLoading={isLoading}
                          saveValue={saveValue}
                          saveJson={saveJson}
                          saveTranslation={saveTranslation}
                        />
                      </ColTR>
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
              </Row>

              {!isComplete(data.tuvs) && (
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
              )}
              {isComplete(data.tuvs) && (
                <Popconfirm
                  placement="topLeft"
                  title="Are you sure to modify this element?"
                  onConfirm={() => {
                    saveAll(tuvs);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button ghost
                    className="right"
                    type="primary"
                    icon={<SaveOutlined />}
                  >
                    Change
                  </Button>
                </Popconfirm>
              )}
            </React.Fragment>
          )}
        </Col>
      )}
    </Row>
  );
};

export default Tu;
