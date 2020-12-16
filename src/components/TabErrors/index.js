import React from "react";

import { Tabs, Radio, Row, Col, Input } from "antd";

const { TabPane } = Tabs;
const { TextArea } = Input;

const TabErrors = ({
  accuracy,
  fluency,
  terminology,
  style,
  localeConvention,
  setAccuracy,
  setFluency,
  setTerminology,
  setStyle,
  setLocaleConvention,
  translation,
  setTranslation,
  onChange,
  onChangeV4,
}) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane
        tab={
          <span className={accuracy.value !== "0" ? "red-tab" : ""}>
            Accuracy
          </span>
        }
        key="accuracy"
      >
        <Errors
          error={accuracy}
          setError={setAccuracy}
          onChange={onChange}
          field={"accuracy"}
        />
        <br />
        {accuracy.value !== "0" && (
          <Row>
            <Col xs={24} md={8}>
              <SubErrors
                error={accuracy}
                setError={setAccuracy}
                onChange={onChange}
                field={"accuracy"}
                values={[
                  "Under-translation",
                  "untranslated text",
                  "mistranslation",
                  "addition",
                  "omission",
                  "other",
                ]}
              />
            </Col>
            <Col xs={24} md={16}>
              <div style={{ marginTop: 20 }}>
                <h4>Translation proposal</h4>
                <TextArea
                  placeholder="Enter the correct translation"
                  autoSize
                  rows={4}
                  value={translation}
                  onChange={({ target: { value } }) => {
                    setTranslation(value);
                    onChangeV4(value);
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
      </TabPane>
      <TabPane
        tab={
          <span className={fluency.value !== "0" ? "red-tab" : ""}>
            Fluency
          </span>
        }
        key="fluency"
      >
        <Errors
          error={fluency}
          setError={setFluency}
          onChange={onChange}
          field={"fluency"}
        />
        <br />
        {fluency.value !== "0" && (
          <Row>
            <Col xs={24} md={8}>
              <SubErrors
                field={"fluency"}
                onChange={onChange}
                error={fluency}
                setError={setFluency}
                values={[
                  "grammar",
                  "spelling",
                  "reordering",
                  "inconsistency",
                  "other",
                ]}
              />
            </Col>
            <Col xs={24} md={16}>
              <div style={{ marginTop: 20 }}>
                <h4>Translation proposal</h4>
                <TextArea
                  placeholder="Enter the correct translation"
                  autoSize
                  rows={4}
                  value={translation}
                  onChange={({ target: { value } }) => {
                    setTranslation(value);
                    onChangeV4(value);
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
      </TabPane>
      <TabPane
        tab={
          <span className={terminology.value !== "0" ? "red-tab" : ""}>
            Terminology
          </span>
        }
        key="terminology"
      >
        <Errors
          error={terminology}
          setError={setTerminology}
          onChange={onChange}
          field={"terminology"}
        />
        <br />
        {terminology.value !== "0" && (
          <Row>
            <Col xs={24} md={16}>
              <div style={{ marginTop: 20 }}>
                <h4>Translation proposal</h4>
                <TextArea
                  placeholder="Enter the correct translation"
                  autoSize
                  rows={4}
                  value={translation}
                  onChange={({ target: { value } }) => {
                    setTranslation(value);
                    onChangeV4(value);
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
      </TabPane>
      <TabPane
        tab={
          <span className={style.value !== "0" ? "red-tab" : ""}>Style</span>
        }
        key="style"
      >
        <Errors
          error={style}
          setError={setStyle}
          onChange={onChange}
          field={"style"}
        />
        <br />
        {style.value !== "0" && (
          <Row>
            <Col xs={24} md={16}>
              <div style={{ marginTop: 20 }}>
                <h4>Translation proposal</h4>
                <TextArea
                  placeholder="Enter the correct translation"
                  autoSize
                  rows={4}
                  value={translation}
                  onChange={({ target: { value } }) => {
                    setTranslation(value);
                    onChangeV4(value);
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
      </TabPane>
      <TabPane
        tab={
          <span className={localeConvention.value !== "0" ? "red-tab" : ""}>
            Locale_Convention
          </span>
        }
        key="locale_Convention"
      >
        <Errors
          error={localeConvention}
          setError={setLocaleConvention}
          onChange={onChange}
          field={"localeConvention"}
        />
        <br />
        {localeConvention.value !== "0" && (
          <Row>
            <Col xs={24} md={16}>
              <div style={{ marginTop: 20 }}>
                <h4>Translation proposal</h4>
                <TextArea
                  placeholder="Enter the correct translation"
                  autoSize
                  rows={4}
                  value={translation}
                  onChange={({ target: { value } }) => {
                    setTranslation(value);
                    onChangeV4(value);
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
      </TabPane>
    </Tabs>
  );
};

export default TabErrors;

const Errors = ({ error, setError, onChange, field }) => {
  return (
    <Radio.Group
      buttonStyle="solid"
      value={error.value}
      onChange={(e) => {
        error.value = e.target.value;
        setError({ ...error });
        onChange(field, error);
      }}
    >
      <Radio.Button value="0">No Error</Radio.Button>
      <Radio.Button value="1">Minor </Radio.Button>
      <Radio.Button value="2">Major</Radio.Button>
      <Radio.Button value="3 ">Critical</Radio.Button>
    </Radio.Group>
  );
};
const SubErrors = ({ error, setError, values, onChange, field }) => {
  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px",
  };
  const divStyle = {
    margin: "10px 0 5px 20px",
  };

  return (
    <div style={divStyle}>
      <Radio.Group
        value={error.subValue}
        onChange={(e) => {
          error.subValue = e.target.value;
          setError({ ...error });
          onChange(field, error);
        }}
      >
        {values.map((item, i) => {
          return (
            <Radio style={radioStyle} value={i.toString()}>
              {item}
            </Radio>
          );
        })}
      </Radio.Group>
    </div>
  );
};

// Accuracy, Fluency, Terminology, Style, Locale_Convention
// no-error/minor/major/critical
