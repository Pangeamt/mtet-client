import React, { useState, useEffect } from "react";
import { UserAddOutlined } from '@ant-design/icons';
import { Tabs, Button, Modal, message, Card } from "antd";

import UsersList from "./../../components/UsersList";
import UserForm from "./../../components/UserForm";
import UserEditForm from "../../components/UserForm/UserEditForm";
import PasswordForm from "../../components/UserForm/PasswordForm";

import {
  handleError,
  getUsers,
  addUser,
  saveUser,
  removeUser
} from "./../../services";

const { TabPane } = Tabs;

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("add");

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
      const { data } = await getUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const add = async values => {
    try {
      setLoading(true);
      await addUser(values);
      setVisible(false);
      fetch(true);
      message.success("Successful Action!");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  const save = async values => {
    try {
      setLoading(true);
      await saveUser(values, user.id);
      setVisible(false);
      fetch(true);
      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const remove = async value => {
    try {
      setLoading(true);
      await removeUser(value.id);
      setVisible(false);
      fetch(true);
      message.success("Successful Action!");
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  const handleCancel = e => {
    setVisible(false);
  };

  const selectUser = value => {
    setMode("edit");
    setUser(value);
    setVisible(true);
  };

  const showPassForm = value => {
    setMode("pass");
    setUser(value);
    setVisible(true);
  };

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Add User";
      case "edit":
        return "Edit User";
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
      icon={<UserAddOutlined />}
    >
      Add User
    </Button>
  );

  return (
    <React.Fragment>
      <Card>
        <Tabs tabBarExtraContent={operations}>
          <TabPane tab="Users" key="users">
            <UsersList
              users={users}
              loading={loading}
              select={selectUser}
              showPassForm={showPassForm}
              remove={remove}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        maskClosable={false}
        title={getTitle()}
        visible={visible}
        onCancel={handleCancel}
        footer={false}
      >
        {mode === "add" && <UserForm loading={loading} addUser={add} />}
        {mode === "pass" && <PasswordForm loading={loading} saveUser={save} />}
        {mode === "edit" && (
          <UserEditForm loading={loading} saveUser={save} user={user} />
        )}
      </Modal>
    </React.Fragment>
  );
};

export default Users;
