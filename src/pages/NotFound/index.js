import React from "react";
import QueueAnim from "rc-queue-anim";
import { Link } from "@reach/router";
import { Button } from "antd";
import "./styles.scss";

const exceptions = [
  "/admin",
  "/admin/",
  "/admin/users",
  "/admin/users/",
  "/project-manager",
  "/project-manager/",
  "/project-manager/projects",
  "/project-manager/projects/",
];

export const NotFound = props => {
  if (!exceptions.includes(props.uri)) {
    return (
      <div className="page-err">
        <QueueAnim type="bottom" className="ui-animate">
          <div key="1">
            <div className="err-container text-center">
              <div className="err-code-container">
                <div className="err-code">
                  {" "}
                  <h1>400</h1>{" "}
                </div>
              </div>
              <h2>Sorry, page not found</h2>

              <Link to="/">
                <Button>Go Back to Login Page</Button>
              </Link>
            </div>
          </div>
        </QueueAnim>
      </div>
    );
  } else {
    return null;
  }
};
