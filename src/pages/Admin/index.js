import React, { useContext, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { navigate } from "@reach/router";

import AppLayout from "./../../components/Layout";
import { AppContext } from "./../../AppContext";

export const Admin = props => {
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user.role !== "admin") {
      reactLocalStorage.clear();
      navigate(`/403`);
    }
  }, [user.role]);

  return <AppLayout>{props.children}</AppLayout>;
};
