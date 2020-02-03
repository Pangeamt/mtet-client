import React, { useState } from "react";
import { Form, Input, Tooltip, Icon, Button, Select } from "antd";

const UserFormCmp = ({ form, loading, addUser }) => {
  const [confirmDirty, setConfirmDirty] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        addUser(values);
        form.resetFields();
      }
    });
  };

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  const validatePassword = string => {
    console.log(validatePassword);
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

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="E-mail">
        {getFieldDecorator("email", {
          rules: [
            {
              type: "email",
              message: "The input is not valid E-mail!"
            },
            {
              required: true,
              message: "Please input your E-mail!"
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Password" hasFeedback>
        {getFieldDecorator("password", {
          rules: [
            {
              required: true,
              message: "Please input your password!"
            },
            {
              validator: validateToNextPassword
            }
          ]
        })(<Input.Password />)}
      </Form.Item>
      <Form.Item
        label="Confirm Password"
        hasFeedback
        validateStatus={validatePassword}
      >
        {getFieldDecorator("confirm", {
          rules: [
            {
              required: true,
              message: "Please confirm your password!"
            },
            {
              validator: compareToFirstPassword
            }
          ]
        })(<Input.Password onBlur={handleConfirmBlur} />)}
      </Form.Item>
      <Form.Item
        label={
          <span>
            Nickname&nbsp;
            <Tooltip title="What do you want others to call you?">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        }
      >
        {getFieldDecorator("nickname", {
          rules: [
            {
              required: true,
              message: "Please input nickname!",
              whitespace: true
            }
          ]
        })(<Input />)}
      </Form.Item>

      <Form.Item label="Role" hasFeedback>
        {getFieldDecorator("role", {
          rules: [
            {
              required: true,
              message: "Please select the role!"
            }
          ]
        })(
          <Select>
            <Select.Option value="admin">Administrator</Select.Option>
            <Select.Option value="pm">Project Manager</Select.Option>
            <Select.Option value="evaluator">Evaluator</Select.Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          Create User
        </Button>
      </Form.Item>
    </Form>
  );
};

const UserForm = Form.create({ name: "user-form" })(UserFormCmp);

export default UserForm;
