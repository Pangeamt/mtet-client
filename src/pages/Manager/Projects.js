import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Tabs, Button, Modal, message, Card } from "antd";

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

const { TabPane } = Tabs;

const Projects = () => {
  const { user } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [mode, setMode] = useState("add");
  const [tab, setTab] = useState("projects");

  useEffect(() => {
    fetch(true);
  }, []);

  const fetch = async (load = false) => {
    try {
      if (load) setLoading(true);
      const { data } = await getProjects();
      setProjects(data);
      setLoading(false);
      setVisible(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const add = async (values, form) => {
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
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const addFromFiles = async (values, form) => {
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
      icon="plus"
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
    <div className="container mt-5">
      <article className="article">
        <Row>
          <Col>
            <div class="img-card__body img-card__body--left">
              <h2 class="img-card__title text-capitalize">
                Hello {user.nickname}!
              </h2>
              <p class="img-card__desc lead">
                Here you can manage project, assign tasks and keep track of the
                status of each of these tasks.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={24} md={6} className="p-2">
            <article className="img-card-v1 mb-4" style={{ height: "340px" }}>
              <div
                className="img-card__cover"
                style={{
                  backgroundImage: `url('${IMAGE}')`,
                }}
              ></div>
            </article>
          </Col>
          <Col xs={24} md={18} className="p-2">
            <Card style={{ minHeight: 340 }}>
              <Tabs
                activeKey={tab}
                tabBarExtraContent={
                  mode !== "tuvs" && mode !== "tasks" ? operations : null
                }
                onChange={callback}
              >
                <TabPane tab="Projects" key="projects">
                  <ProjectsList
                    projects={projects}
                    loading={loading}
                    select={selectProject}
                    selectClone={selectClone}
                    remove={remove}
                    showsTuvs={showsTuvs}
                    showsTasks={showsTasks}
                  />
                </TabPane>
                {mode === "tuvs" && project && project.projects.length && (
                  <TabPane tab={`Tuvs (${project.name})`} key="tuvs">
                    <TuvsManager tuvs={project.projects} />
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
      </article>
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
    </div>
  );
};

export default Projects;
