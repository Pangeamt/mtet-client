import React from "react";
import { Row, Col, Card, Icon, Tag, List } from "antd";
import currencyFormatter from "currency-formatter";
import styled from "styled-components";

const SpanName = styled.span`
  width: 50%;
`;

const list = {
  checks: [
    {
      name: "Fernan",
      type: "out",
      datetime: "27/03/2018"
    },
    {
      name: "JAMES",
      type: "in",
      datetime: "01/04/2018"
    },
    {
      name: "Luca Abbruzzese",
      type: "in",
      datetime: "01/04/2018"
    },
    {
      name: "Fernan",
      type: "out",
      datetime: "30/06/2018"
    },
    {
      name: "Luca Abbruzzese",
      type: "in",
      datetime: "01/04/2018"
    }
  ]
};

const Dashboard = () => {
  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <Card></Card>
          </Col>
        </Row>
        <Row>
          <Col className="p-2" xs={24} md={12} lg={8}>
            <div className="number-card-v1 mb-4">
              <div className="card-top">
                <span>
                  19<span className="h5">%</span>
                </span>
              </div>
              <div className="card-info">
                <span>Occupancy rate</span>
              </div>
              <div className="card-bottom">
                <Row className="w-100 mt-3">
                  <Col xs={8} className="d-flex justify-content-center">
                    <Icon type="line-chart" className="text-info" />
                  </Col>
                  <Col
                    xs={16}
                    style={{ fontSize: 15 }}
                    className="d-flex justify-content-center "
                  >
                    <div>
                      <p className="link-animated-hover link-hover-v4">
                        <Tag color="#2db7f5">16</Tag> Available properties
                      </p>
                      <p className="link-animated-hover link-hover-v4">
                        <Tag color="#2db7f5">3</Tag> Tenants
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>{" "}
          <Col className="p-2" xs={24} md={12} lg={8}>
            <div className="number-card-v1 mb-4">
              <div className="card-top">
                <Icon type="euro" className="text-primary" />
              </div>
              <div className="card-info">
                <span>Revenue this month</span>
              </div>
              <div className="card-bottom">
                <span>
                  {currencyFormatter.format(1200, {
                    style: "currency",
                    code: "EUR"
                  })}
                </span>
              </div>
            </div>
          </Col>{" "}
          <Col className="p-2" xs={24} md={12} lg={8}>
            <div className="number-card-v1 mb-4 ">
              <div className="box box-default">
                <div className="box-header">Next check in/on</div>
                <div
                  className="box-body"
                  style={{
                    padding: "0 1.25rem"
                  }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={list.checks}
                    renderItem={item => (
                      <List.Item
                        style={{
                          padding: "5px 0"
                        }}
                      >
                        <div className="list-style-v1">
                          <div className="list-item">
                            <div className="list-item__body">
                              <div className="list-item__title d-flex justify-content-between">
                                <SpanName>{item.name}</SpanName>
                                {item.type === "out" && (
                                  <Tag color="#f50">{item.type}</Tag>
                                )}
                                {item.type === "in" && (
                                  <Tag color="#87d068">{item.type}</Tag>
                                )}
                                <span>{item.datetime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </Col>{" "}
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboard;
