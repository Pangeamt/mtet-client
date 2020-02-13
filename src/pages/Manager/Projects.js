import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Tabs, Button, Modal, message, Card } from "antd";
import axios from "axios";

import { HOST_API } from "./../../config";

import ProjectsList from "./../../components/ProjectsList";
import ProjectForm from "./../../components/ProjectForm";
import TuvsManager from "./../../components/TuvsManager";
import Tasks from "./../../components/Tasks";
import { AppContext } from "./../../AppContext";
import IMAGE from "./../../assets/pm.png";

const { TabPane } = Tabs;

const Projects = () => {
  const { user, token } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [mode, setMode] = useState("add");
  const [tab, setTab] = useState("projects");

  useEffect(() => {
    fetch(true);
    const fetchInterval = setInterval(() => {
      fetch();
    }, 5000);

    return function cleanup() {
      clearInterval(fetchInterval);
    };
  }, []);

  const fetch = async (load = false) => {
    try {
      if (load) setLoading(true);
      const { data } = await axios.get(`${HOST_API}/v1/projects`);

      setProjects(data);
      setLoading(false);
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const add = async (values, form) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(values).forEach(element => {
        if (element !== "files") formData.append(element, values[element]);
      });

      values.files.forEach(file => {
        formData.append("files[]", file.originFileObj);
      });
      const { data } = await axios.post(`${HOST_API}/v1/projects`, formData, {
        headers: {
          "content-type": "multipart/form-data"
        }
      });
      console.log(data);
      message.success("Successful Action!");
      form.resetFields();
      fetch(true);
      setVisible(false);
    } catch (error) {
      if (error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        message.error(error.message);
      }
      setLoading(false);
    }
  };

  const save = async (values, form) => {
    try {
      setLoading(true);
      await axios({
        method: "patch",
        url: `${HOST_API}/v1/projects/${project.id}`,
        data: values
      });
      fetch(true);
      setVisible(false);
      form.resetFields();
      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const remove = async value => {
    try {
      setLoading(true);
      await axios.delete(`${HOST_API}/v1/projects/${value.id}`);
      setVisible(false);
      fetch(true);
      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const handleCancel = e => {
    console.log(e);
    setVisible(false);
  };

  const selectProject = value => {
    setMode("edit");
    setProject(value);
    setVisible(true);
  };

  const showsTuvs = value => {
    setMode("tuvs");
    setTab("tuvs");
    setProject(value);
  };

  const showsTasks = value => {
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

  const callback = key => {
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
                  backgroundImage: `url('${IMAGE}')`
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
                    remove={remove}
                    showsTuvs={showsTuvs}
                    showsTasks={showsTasks}
                  />
                </TabPane>
                {mode === "tuvs" && project && project.Tuvs.length && (
                  <TabPane tab={`Tuvs (${project.name})`} key="tuvs">
                    <TuvsManager tuvs={project.Tuvs} />
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
        width={800}
        title={getTitle()}
        visible={visible}
        onCancel={handleCancel}
        footer={false}
      >
        <ProjectForm
          loading={loading}
          add={add}
          save={save}
          project={project}
        />
      </Modal>
    </div>
  );
};

export default Projects;
