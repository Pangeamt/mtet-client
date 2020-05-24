import React from "react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, InputNumber, Button, Checkbox } from "antd";

const TasksFormCmp = ({ form, create, tasks }) => {
  const handleSubmit = e => {
    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        create(values, form);
      }
    });
  };

  const { getFieldDecorator } = form;

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col xs={24} md={12} className="p-2">
          <Form.Item label="Number of tasks">
            {getFieldDecorator("numberTasks", {
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: "Please input the Number of tasks!"
                }
              ]
            })(<InputNumber min={1} />)}
          </Form.Item>
        </Col>
        <Col xs={24} md={12} className="p-2">
          <Row>
            <Col xs={24}>
              <Form.Item style={{ marginBottom: 0 }}>
                {getFieldDecorator("showReferenceText", {
                  valuePropName: "checked",
                  initialValue: false
                })(<Checkbox>Show reference text</Checkbox>)}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("showSourceText", {
                  valuePropName: "checked",
                  initialValue: false
                })(<Checkbox>Show source text</Checkbox>)}
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12} className="p-2">
          <Form.Item label="% repeated evaluations">
            {getFieldDecorator("percentageEvaluationsRandomlyRepeated", {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message:
                    "Please input the Percentage of repeated evaluations!"
                }
              ]
            })(<InputNumber min={0} max={100} />)}
          </Form.Item>
        </Col>
        <Col xs={24} md={12} className="p-2">
          <Form.Item label="% overlapping tuvs">
            {getFieldDecorator("overlappingTuvs", {
              initialValue: 0,
              rules: [
                {
                  required: true,
                  message: "Please input the Percent of overlapping tuvs!"
                }
              ]
            })(<InputNumber min={0} />)}
          </Form.Item>
        </Col>
      </Row>{" "}
      <Form.Item className="w-100">
        <Button
          disabled={tasks.length}
          style={{ float: "right" }}
          type="primary"
          htmlType="submit"
        >
          Create Tasks
        </Button>
      </Form.Item>
    </Form>
  );
};

const TaskForm = Form.create({ name: "task-form" })(TasksFormCmp);

export default TaskForm;
