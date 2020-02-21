import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Divider,
  Slider,
  InputNumber,
  Button
} from "antd";

import EventListener, { withOptions } from "react-event-listener";

const { Text, Paragraph } = Typography;

const Tuv = ({ item, saveValue }) => {
  const [tuv, setTuv] = useState(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (item) {
      setTuv(item);
      setValue(item.value);
    }
  }, []);

  const onChange = value => {
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
                backgroundColor: "#f0f2f5"
              }}
            >
              {tuv.text}
            </Paragraph>
          </Col>
          <Col xs={24}>
            <Row className="p-1">
              <Col span={12}>
                <Slider
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

const Tu = ({ tu, isLoading, save, task }) => {
  const [data, setData] = useState(null);
  const [tuvs, setTuvs] = useState([]);

  useEffect(() => {
    if (tu) {
      setData(tu);
      const array = [];
      tu.tuvs.forEach(element => {
        array.push({ id: element.id, value: element.value });
      });
      setTuvs(array);
      // document.addEventListener("keydown", keydownHandler);
    }
  }, []);

  const saveAll = _tuvs => {
    save(_tuvs);
  };

  const saveValue = (id, value) => {
    tuvs.forEach(element => {
      if (element.id === id) element.value = value;
    });
    setTuvs(tuvs);
  };

  const keydownHandler = e => {
    if (e.keyCode === 13 && e.ctrlKey) {
      saveAll(tuvs);
    }
  };

  return (
    <Row className="mt-5">
      <EventListener target={document} onKeyDown={keydownHandler} />
      {data && (
        <Col>
          <Row>
            <Col xs={24}>
              <Text strong>Source ({data.sourceLang})</Text>
              <Paragraph
                className="p-1 mr-2"
                style={{
                  backgroundColor: "#f0f2f5"
                }}
              >
                {task.showSourceText ? data.source : null}
              </Paragraph>
            </Col>
            <Col xs={24}>
              <Text strong>Reference ({data.referenceLang})</Text>
              <Paragraph
                className="p-1 mr-2"
                style={{
                  backgroundColor: "#f0f2f5"
                }}
              >
                {task.showReferenceText ? data.reference : null}
              </Paragraph>
            </Col>
          </Row>
          <Divider />
          {data.tuvs && data.tuvs.length > 0 && (
            <React.Fragment>
              {data.tuvs.map(item => {
                return (
                  <Tuv
                    item={item}
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
                icon="save"
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
