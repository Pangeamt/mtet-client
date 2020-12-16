import React, { useState, useEffect, useContext } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Tabs,
  Button,
  Modal,
  message,
  Card,
  Layout,
  Typography,
} from "antd";

import ProjectsList from "./../../components/ProjectsList";
import ProjectForm from "./../../components/ProjectForm";
import ProjectCloneForm from "./../../components/ProjectForm/ProjectCloneForm";
import TuvsManager from "./../../components/TuvsManager";
import Tasks from "./../../components/Tasks";

import {
  handleError,
  getProjects,
  addProject,
  cloneProject,
  saveProject,
  removeProject,
  addProjectFiles,
} from "./../../services";

import { AppContext } from "./../../AppContext";
import IMAGE from "./../../assets/pm.png";
import styled from "styled-components";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const TextSub = styled(Text)`
  font-size: 1.1875rem;
  font-weight: 300;
`;

const Projects = () => {
  const { user } = useContext(AppContext);

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [mode, setMode] = useState("add");
  const [tab, setTab] = useState("projects");

  useEffect(() => {
    fetch(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetch = async (params = {}) => {
    try {
      setLoading(true);
      const {
        data: { docs, total },
      } = await getProjects(params);
      const pag = { ...pagination };
      pag.total = total;

      setProjects(docs);
      setVisible(false);
      setLoading(false);
      setPagination(pag);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const handleTableChange = (pag, filters, sorter) => {
    const pager = {
      ...pagination,
    };
    pager.current = pag.current;
    setPagination(pager);

    fetch({
      results: pag.pageSize,
      page: pag.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  const add = async (values, form, { setFileList }) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(values).forEach((element) => {
        if (element !== "files") formData.append(element, values[element]);
      });

      values.files.forEach((file) => {
        formData.append("files[]", file.originFileObj);
      });
      await addProject(formData);
      form.resetFields();
      fetch(true);
      setFileList([]);
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const addFromFiles = async (
    values,
    form,
    { setFileSrc, setFileRef, setFilesTgt }
  ) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(values).forEach((element) => {
        if (element !== "files") formData.append(element, values[element]);
      });

      if (values.files) {
        values.files.forEach((file) => {
          formData.append("files[]", file.originFileObj);
        });
      } else {
        values.sources.forEach((file) => {
          formData.append("sources[]", file.originFileObj);
        });
        values.references.forEach((file) => {
          formData.append("references[]", file.originFileObj);
        });
        values.targets.forEach((file) => {
          formData.append("targets[]", file.originFileObj);
        });
      }

      await addProjectFiles(formData);
      form.resetFields();
      fetch(true);
      setFileSrc([]);
      setFileRef([]);
      setFilesTgt([]);
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const clone = async (values, form) => {
    try {
      setLoading(true);
      await cloneProject(project.id, values);
      fetch(true);
      setVisible(false);
      form.resetFields();
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const save = async (values, form) => {
    try {
      setLoading(true);
      await saveProject(project.id, values);
      fetch(true);
      setVisible(false);
      form.resetFields();
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const remove = async (value) => {
    try {
      setLoading(true);
      await removeProject(value.id);
      fetch(true);
      setVisible(false);
      message.success("Successful Action!");
    } catch (error) {
      handleError();
      setLoading(false);
    }
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  const selectProject = (value) => {
    setMode("edit");
    setProject(value);
    setVisible(true);
  };

  const selectClone = (value) => {
    setMode("clone");
    setProject(value);
    setVisible(true);
  };

  const showsTuvs = (value) => {
    setMode("tuvs");
    setTab("tuvs");
    setProject(value);
  };

  const showsTasks = (value) => {
    setMode("tasks");
    setTab("tasks");
    setProject(value);
  };

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Add Project";
      case "edit":
        return "Edit Project";
      case "pass":
        return "Update Password";
      case "clone":
        return "Clone Project";

      default:
        break;
    }
  };

  const operations = (
    <Button
      onClick={() => {
        setMode("add");
        setVisible(true);
      }}
      type="primary"
      icon={<PlusOutlined />}
    >
      Add Project
    </Button>
  );

  const callback = (key) => {
    if (key !== "tuvs") {
      setMode("add");
      setProject(null);
    }
    setTab(key);
  };

  return (
    <Content style={{ padding: 50 }}>
      <Row style={{ marginBottom: 20 }} type="flex" justify="center">
        <Col xs={24}>
          <Title style={{ marginBottom: 0 }} level={2}>
            {" "}
            Hello {user.nickname}!
          </Title>
          <TextSub>
            Here you can manage projects, assign tasks and keep track of the
            status of each of these tasks.
          </TextSub>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card className="img-card-v1" style={{ height: "340px" }}>
            <div
              className="img-card__cover"
              style={{
                backgroundImage: `url('${IMAGE}')`,
              }}
            ></div>
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Card style={{ minHeight: 340, padding: 20 }}>
            <Tabs
              activeKey={tab}
              tabBarExtraContent={
                mode !== "tuvs" && mode !== "tasks" ? operations : null
              }
              onChange={callback}
            >
              <TabPane tab="Projects" key="projects">
                <ProjectsList
                  pagination={pagination}
                  handleTableChange={handleTableChange}
                  projects={projects}
                  loading={loading}
                  select={selectProject}
                  selectClone={selectClone}
                  remove={remove}
                  showsTuvs={showsTuvs}
                  showsTasks={showsTasks}
                />
              </TabPane>
              {mode === "tuvs" && project && project.tuvs.length && (
                <TabPane tab={`Tuvs (${project.name})`} key="tuvs">
                  <TuvsManager tuvs={project.tuvs} />
                </TabPane>
              )}
              {mode === "tasks" && project && (
                <TabPane tab={`Tasks (${project.name})`} key="tasks">
                  <Tasks project={project} />
                </TabPane>
              )}
            </Tabs>
          </Card>
        </Col>
      </Row>
      <Modal
        maskClosable={false}
        width={800}
        title={getTitle()}
        visible={visible}
        onCancel={handleCancel}
        footer={false}
      >
        {mode !== "clone" && (
          <ProjectForm
            loading={loading}
            add={add}
            addFromFiles={addFromFiles}
            save={save}
            project={project}
          />
        )}

        {mode === "clone" && (
          <ProjectCloneForm loading={loading} clone={clone} />
        )}
      </Modal>
    </Content>
  );
};

export default Projects;
