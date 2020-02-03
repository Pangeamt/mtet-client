import React from "react";
import { Form, Input, Button } from "antd";
const FormItem = Form.Item;

const LoginForm = ({ form, loading, login }) => {
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        login(values);
      }
    });
  };

  const { getFieldDecorator } = form;
  return (
    <section className="form-v1-container">
      <h2>LOGO</h2>

      <Form onSubmit={handleSubmit} className="form-v1">
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
              }
            ]
          })(<Input.Password />)}
        </Form.Item>

        <FormItem>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="btn-cta btn-block"
          >
            Log in
          </Button>
        </FormItem>
      </Form>
    </section>
  );
};

const WrappedNormalLoginForm = Form.create()(LoginForm);

export default WrappedNormalLoginForm;
