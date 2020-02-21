import React, { useState } from "react";
import { Form, Input, Upload, Icon, Button, Select, message } from "antd";

const ProjectCloneFormCmp = ({ form, loading, clone }) => {
  const handleSubmit = e => {
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        clone(values, form);
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
      <Form.Item label="Name">
        {getFieldDecorator("name", {
          rules: [
            {
              required: true,
              message: "Please input the Name!"
            }
          ]
        })(<Input />)}
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          Clone Project
        </Button>
      </Form.Item>
    </Form>
  );
};

const ProjectCloneForm = Form.create({ name: "project-clone-form" })(
  ProjectCloneFormCmp
);

export default ProjectCloneForm;
