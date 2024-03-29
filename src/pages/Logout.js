import React, { useEffect, useContext } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { navigate } from "@reach/router";

import { AppContext } from "./../AppContext";

const Logout = () => {
  const { setToken, setUser } = useContext(AppContext);

  useEffect(() => {
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = () => {
    setToken(null);
    setUser(null);
    reactLocalStorage.clear();
    navigate(`/`);
  };

  return <div></div>;
};

export default Logout;
