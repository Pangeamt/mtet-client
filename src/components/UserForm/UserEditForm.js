import React from "react";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Tooltip, Button, Select } from "antd";

const UserEditFormCmp = ({ user, form, loading, saveUser }) => {
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveUser(values);
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

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <Form.Item label="E-mail">
        {getFieldDecorator("email", {
          initialValue: user.email,
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
      <Form.Item
        label={
          <span>
            Nickname&nbsp;
            <Tooltip title="What do you want others to call you?">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
      >
        {getFieldDecorator("nickname", {
          initialValue: user.nickname,
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
          initialValue: user.role,
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
          Save User
        </Button>
      </Form.Item>
    </Form>
  );
};

const UserEditForm = Form.create({ name: "user-form" })(UserEditFormCmp);

export default UserEditForm;
