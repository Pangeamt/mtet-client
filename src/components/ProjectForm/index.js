import React, { useState } from "react";
import { Form, Input, Upload, Icon, Button, Select, message } from "antd";

import { data } from "./../../data";

const { languages } = data;

const checkFile = (file, allowedFiles) => {
  var extension = file.name.substr(file.name.lastIndexOf(".") + 1);
  var regEx = new RegExp(allowedFiles, "gi");
  if (!regEx.test(extension)) {
    return false;
  }
  return true;
};

const ProjectFormCmp = ({ form, loading, add, save, project }) => {
  const [fileList, setFileList] = useState([]);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["files"] = fileList;
        if (!project) {
          add(values);
        } else {
          save(values);
        }
        form.resetFields();
      }
    });
  };

  const { getFieldDecorator } = form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };

  const props = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },

    beforeUpload: file => {
      const isLt2M = file.size / 1024 / 1024 < 500;
      if (!checkFile(file, "tmx")) {
        message.error("You can only upload tmx file");
      } else if (!isLt2M) {
        message.error("Files must smaller than 500MB");
      }
      return false;
    },

    onChange: info => {
      let aux = [];
      info.fileList.map(item => {
        if (checkFile(item, "tmx")) {
          aux.push(item);
        }
        return aux;
      });

      setFileList(aux);
    },
    fileList,
    multiple: false
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="Name">
        {getFieldDecorator("name", {
          initialValue: project ? project.name : "",
          rules: [
            {
              required: true,
              message: "Please input the Name!"
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Source" hasFeedback>
        {getFieldDecorator("source", {
          initialValue: project ? project.source : "",
          rules: [
            {
              required: true,
              message: "Please select the source!"
            }
          ]
        })(
          <Select>
            {languages &&
              Object.keys(languages).length &&
              Object.keys(languages).map(item => {
                const key = Object.keys(item);
                console.log(key);
                return (
                  <Select.Option value={item}>{languages[item]}</Select.Option>
                );
              })}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Target" hasFeedback>
        {getFieldDecorator("target", {
          initialValue: project ? project.target : "",
          rules: [
            {
              required: true,
              message: "Please select the target!"
            }
          ]
        })(
          <Select>
            {languages &&
              Object.keys(languages).length &&
              Object.keys(languages).map(item => {
                const key = Object.keys(item);
                console.log(key);
                return (
                  <Select.Option value={item}>{languages[item]}</Select.Option>
                );
              })}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Type of evaluation" hasFeedback>
        {getFieldDecorator("type", {
          initialValue: project ? project.type : "",
          rules: [
            {
              required: true,
              message: "Please select the type!"
            }
          ]
        })(
          <Select>
            <Select.Option value="zero-to-one-hundred">
              Zero to one hundred
            </Select.Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Upload {...props}>
          <Button disabled={fileList.length}>
            <Icon type="upload" /> Select Tmx File
          </Button>
        </Upload>
      </Form.Item>

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
