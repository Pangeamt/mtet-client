import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Upload,
  Icon,
  Button,
  Select,
  message,
  Slider,
  InputNumber,
  Row,
  Col,
  Tooltip,
  Radio,
  Alert,
  Typography,
} from "antd";

const checkFile = (file, allowedFiles) => {
  var extension = file.name.substr(file.name.lastIndexOf(".") + 1);
  var regEx = new RegExp(allowedFiles, "gi");
  if (!regEx.test(extension)) {
    return false;
  }
  return true;
};

const { Text } = Typography;
const ProjectFormCmp = ({
  form,
  loading,
  add,
  save,
  project,
  mode,
  addFromFiles,
}) => {
  const [fileList, setFileList] = useState([]);
  const [fileSrc, setFileSrc] = useState([]);
  const [fileRef, setFileRef] = useState([]);
  const [filesTgt, setFilesTgt] = useState([]);
  const [segments, setSegments] = useState(0);
  const [dataSource, setDataSource] = useState(1);

  useEffect(() => {
    if (project) {
      setSegments(project.segments || 0);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dataSource === 1 && !project && !fileList.length) {
      message.error("You need to upload a tmx file");
      return;
    }
    if (dataSource === 2 && !project) {
      if (!fileSrc.length) {
        message.error("You need to upload a Sources file");
        return;
      }
      if (!fileRef.length) {
        message.error("You need to upload a References file");
        return;
      }
      if (!filesTgt.length) {
        message.error("You need to upload some  Targets files");
        return;
      }
    }
    form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        values["segments"] = segments;
        if (dataSource === 1) values["files"] = fileList;
        if (dataSource === 2) {
          values["sources"] = fileSrc;
          values["references"] = fileRef;
          values["targets"] = filesTgt;
        }
        if (!project) {
          if (dataSource === 1) {
            await add(values, form);
            setFileList([]);
          }
          if (dataSource === 2) {
            await addFromFiles(values, form);
            setFileSrc([]);
            setFileRef([]);
            setFilesTgt([]);
          }
        } else {
          save(values, form);
        }
      }
    });
  };

  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 500;
      if (!checkFile(file, "tmx")) {
        message.error("You can only upload tmx file");
      } else if (!isLt2M) {
        message.error("Files must smaller than 500MB");
      }
      return false;
    },

    onChange: (info) => {
      let aux = [];
      info.fileList.map((item) => {
        if (checkFile(item, "tmx")) {
          aux.push(item);
        }
        return aux;
      });

      setFileList(aux);
    },
    fileList,
    multiple: false,
  };

  const propsSrc = {
    onRemove: (file) => {
      const index = fileSrc.indexOf(file);
      const newFileList = fileSrc.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 500;
      if (!checkFile(file, "txt")) {
        message.error("You can only upload txt file");
      } else if (!isLt2M) {
        message.error("Files must smaller than 500MB");
      }
      return false;
    },

    onChange: (info) => {
      let aux = [];
      info.fileList.map((item) => {
        if (checkFile(item, "txt")) {
          aux.push(item);
        }
        return aux;
      });

      setFileSrc(aux);
    },
    fileSrc,
    multiple: false,
  };

  const propsRef = {
    onRemove: (file) => {
      const index = fileRef.indexOf(file);
      const newFileList = fileRef.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 500;
      if (!checkFile(file, "txt")) {
        message.error("You can only upload txt file");
      } else if (!isLt2M) {
        message.error("Files must smaller than 500MB");
      }
      return false;
    },

    onChange: (info) => {
      let aux = [];
      info.fileList.map((item) => {
        if (checkFile(item, "txt")) {
          aux.push(item);
        }
        return aux;
      });

      setFileRef(aux);
    },
    fileRef,
    multiple: false,
  };

  const propsTgt = {
    onRemove: (file) => {
      const index = filesTgt.indexOf(file);
      const newFileList = filesTgt.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: (file) => {
      const isLt2M = file.size / 1024 / 1024 < 500;
      if (!checkFile(file, "txt")) {
        message.error("You can only upload txt file");
      } else if (!isLt2M) {
        message.error("Files must smaller than 500MB");
      }
      return false;
    },

    onChange: (info) => {
      let aux = [];
      info.fileList.map((item) => {
        if (checkFile(item, "txt")) {
          aux.push(item);
        }
        return aux;
      });

      setFilesTgt(aux);
    },
    filesTgt,
    multiple: true,
  };

  const onChange = (value) => {
    setSegments(value);
  };
  const onChangeDataSource = (e) => {
    setDataSource(e.target.value);
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="Data source">
        {getFieldDecorator("dataSource", {
          initialValue: dataSource,
        })(
          <Radio.Group name="radiogroup" onChange={onChangeDataSource}>
            <Radio value={1}>TMX</Radio>
            <Radio value={2}>Files</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item label="Name">
        {getFieldDecorator("name", {
          initialValue: project ? project.name : "",
          rules: [
            {
              required: true,
              message: "Please input the Name!",
            },
          ],
        })(<Input />)}
      </Form.Item>

      <Form.Item label="Type of evaluation" hasFeedback>
        {getFieldDecorator("type", {
          initialValue: project ? project.type : "",
          rules: [
            {
              required: true,
              message: "Please select the type!",
            },
          ],
        })(
          <Select>
            <Select.Option value="zero-to-one-hundred">
              Zero to one hundred
            </Select.Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item
        label={
          <span>
            Segments&nbsp;
            <Tooltip title="Segments before and after display (Context)">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        }
      >
        {getFieldDecorator("type", {
          initialValue: project ? project.type : "",
          rules: [
            {
              required: true,
              message: "Please select the type!",
            },
          ],
        })(
          <Row>
            <Col span={12}>
              <Slider
                min={0}
                max={5}
                value={typeof segments === "number" ? segments : 0}
                onChange={onChange}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                value={typeof segments === "number" ? segments : 0}
                min={0}
                max={5}
                style={{ marginLeft: 16 }}
                onChange={onChange}
              />
            </Col>
          </Row>
        )}
      </Form.Item>

      {!project && (
        <React.Fragment>
          {dataSource === 1 && (
            <Form.Item {...tailFormItemLayout}>
              <Upload {...props}>
                <Button disabled={fileList.length}>
                  <Icon type="upload" /> Select Tmx File
                </Button>
              </Upload>
            </Form.Item>
          )}
          {dataSource === 2 && (
            <React.Fragment>
              <Row>
                <Col xs={24} sm={8}></Col>
                <Col xs={24} sm={16}>
                  <Row>
                    <Col span={10}></Col>
                    <Col span={14}>
                      <Text strong>Format for the File Name</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item {...tailFormItemLayout}>
                    <Row>
                      <Col span={10}>
                        <Upload {...propsSrc}>
                          <Button disabled={fileSrc.length}>
                            <Icon type="upload" /> Select Sources File
                          </Button>
                        </Upload>
                      </Col>
                      <Col span={14}>
                        <Alert
                          message={
                            <span>
                              "sources.en.txt"
                            </span>
                          }
                          type="info"
                          showIcon
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item {...tailFormItemLayout}>
                    <Row>
                      <Col span={10}>
                        <Upload {...propsRef}>
                          <Button disabled={fileRef.length}>
                            <Icon type="upload" /> Select References File
                          </Button>
                        </Upload>
                      </Col>
                      <Col span={14}>
                        <Alert
                          message={
                            <span>
                              "references.en.txt"
                            </span>
                          }
                          type="info"
                          showIcon
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item {...tailFormItemLayout}>
                    <Row>
                      <Col span={10}>
                        <Upload {...propsTgt}>
                          <Button>
                            <Icon type="upload" /> Select Target Files
                          </Button>
                        </Upload>
                      </Col>
                      <Col span={14}>
                        <Alert
                          message={
                            <span>
                              "Google.en.txt"
                            </span>
                          }
                          type="info"
                          showIcon
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      <Form.Item {...tailFormItemLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          {project ? "Save" : "Create"} Project
        </Button>
      </Form.Item>
    </Form>
  );
};

const ProjectForm = Form.create({ name: "project-form" })(ProjectFormCmp);

export default ProjectForm;
