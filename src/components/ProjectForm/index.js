import React, { useState } from "react";
import {
  Form,
  Input,
  Upload,
  Icon,
  Button,
  Select,
  message,
  Switch,
  Checkbox,
  InputNumber
} from "antd";

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
    if (!project && !fileList.length) {
      message.error("You need to upload a tmx file");
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["files"] = fileList;
        if (!project) {
          add(values, form);
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
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };
  const _formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 4 }
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
        {getFieldDecorator("showSourceText", {
          valuePropName: "checked",
          initialValue: project ? project.showSourceText : false
        })(<Checkbox>Source text is displayed</Checkbox>)}
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        {getFieldDecorator("showReferenceText", {
          initialValue: project ? project.showReferenceText : "",
          valuePropName: "checked"
        })(<Checkbox>Reference text is displayed</Checkbox>)}
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        {getFieldDecorator("evaluationsOverlap", {
          initialValue: project ? project.evaluationsOverlap : "",
          valuePropName: "checked"
        })(
          <Checkbox>Evaluations overlap between different evaluators</Checkbox>
        )}
      </Form.Item>
      <Form.Item
        {..._formItemLayout}
        label="Are a percentage of the evaluations randomly repeated?"
      >
        {getFieldDecorator("percentageEvaluationsRandomlyRepeated", {
          initialValue: project
            ? project.percentageEvaluationsRandomlyRepeated
            : ""
        })(<InputNumber min={0} max={100} defaultValue={3} />)}
      </Form.Item>

      {!project && (
        <Form.Item {...tailFormItemLayout}>
          <Upload {...props}>
            <Button disabled={fileList.length}>
              <Icon type="upload" /> Select Tmx File
            </Button>
          </Upload>
        </Form.Item>
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
