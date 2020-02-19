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

const { Title, Paragraph } = Typography;

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
              className="p-3 "
              style={{
                backgroundColor: "#f0f2f5"
              }}
            >
              {tuv.text}
            </Paragraph>
          </Col>
          <Col xs={24}>
            <Row className="p-2 ">
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
    }
  }, []);

  const saveAll = () => {
    save(tuvs);
  };

  const saveValue = (id, value) => {
    tuvs.forEach(element => {
      if (element.id === id) element.value = value;
    });
    setTuvs(tuvs);
  };

  return (
    <Row className="mt-5">
      {data && (
        <Col>
          <Row>
            <Col xs={24}>
              <Title level={4}>Source ({data.sourceLang})</Title>
              <Paragraph
                className="p-3 mr-2"
                style={{
                  backgroundColor: "#f0f2f5"
                }}
              >
                {task.showSourceText ? data.source : null}
              </Paragraph>
            </Col>
            <Col xs={24}>
              <Title level={4}>Reference ({data.referenceLang})</Title>
              <Paragraph
                className="p-3 mr-2"
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
                onClick={saveAll}
                className="right mt-5"
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
