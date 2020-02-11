import React from "react";
import { Form, InputNumber, Button, Checkbox } from "antd";

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

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 12 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 }
    }
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
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
      <Form.Item label="Percent of overlapping tuvs">
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

      <Form.Item label="Percentage of repeated evaluations">
        {getFieldDecorator("percentageEvaluationsRandomlyRepeated", {
          initialValue: 0,
          rules: [
            {
              required: true,
              message: "Please input the Percentage of repeated evaluations!"
            }
          ]
        })(<InputNumber min={0} max={100} />)}
      </Form.Item>

      <Form.Item label="Source text is displayed">
        {getFieldDecorator("showSourceText", {
          valuePropName: "checked",
          initialValue: false
        })(<Checkbox></Checkbox>)}
      </Form.Item>

      <Form.Item label="Reference text is displayed">
        {getFieldDecorator("showReferenceText", {
          valuePropName: "checked",
          initialValue: false
        })(<Checkbox></Checkbox>)}
      </Form.Item>

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
