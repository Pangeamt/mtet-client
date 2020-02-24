import axios from "axios";
import { message } from "antd";
import { navigate } from "@reach/router";
import { reactLocalStorage } from "reactjs-localstorage";
import { HOST_API } from "./../config";

export const handleError = error => {
  if (error && error.response && error.response.status === 401) {
    return navigate(`/logout`);
  }
  if (error.response.data.message) {
    return message.error(error.response.data.message);
  }

  return message.error(error.message);
};

export const login = form => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "post",
    url: `${HOST_API}/v1/auth/login`,
    data: form
  });
};

export const getUsers = () => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.get(`${HOST_API}/v1/users`);
};

export const addUser = values => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "post",
    url: `${HOST_API}/v1/users`,
    data: values
  });
};

export const saveUser = (values, id) => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "patch",
    url: `${HOST_API}/v1/users/${id}`,
    data: values
  });
};

export const removeUser = id => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.delete(`${HOST_API}/v1/users/${id}`);
};

export const getProjects = () => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.get(`${HOST_API}/v1/projects`);
};

export const removeProject = id => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.delete(`${HOST_API}/v1/projects/${id}`);
};

export const cloneProject = (id, values) => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "post",
    url: `${HOST_API}/v1/projects/${id}`,
    data: values
  });
};

export const saveProject = (id, values) => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "patch",
    url: `${HOST_API}/v1/projects/${id}`,
    data: values
  });
};

export const addProject = formData => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.post(`${HOST_API}/v1/projects`, formData, {
    headers: {
      "content-type": "multipart/form-data"
    }
  });
};

export const getEvaluators = () => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.get(`${HOST_API}/v1/users/evaluators`);
};

export const getTasks = id => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.get(`${HOST_API}/v1/tasks`, {
    params: {
      project: id
    }
  });
};

export const addTask = (tasks, project) => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "post",
    url: `${HOST_API}/v1/tasks`,
    data: { tasks, project }
  });
};

export const removeTask = id => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "delete",
    url: `${HOST_API}/v1/tasks/${id}`
  });
};

export const assignTask = (evaluator, id) => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "post",
    url: `${HOST_API}/v1/tasks/${id}`,
    data: { evaluator }
  });
};

export const restartTask = id => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "put",
    url: `${HOST_API}/v1/tasks/${id}`
  });
};

export const activeTask = id => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "patch",
    url: `${HOST_API}/v1/tasks/${id}`
  });
};

export const saveTask = (values, id) => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "post",
    url: `${HOST_API}/v1/tasks/evaluation/save`,
    data: { values, task: id }
  });
};

export const getEvaluatorsTasks = id => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.get(`${HOST_API}/v1/tasks/${id}`);
};

export const getEvaluatorsTasksV1 = () => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios.get(`${HOST_API}/v1/tasks/evaluator`);
};

export const finishTask = id => {
  const token = reactLocalStorage.get("token", false);
  axios.defaults.headers.common["x-access-token"] = token;
  return axios({
    method: "patch",
    url: `${HOST_API}/v1/tasks/${id}`,
    data: { finish: true }
  });
};
