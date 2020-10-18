import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Typography } from "antd";
import { LineChart } from "react-chartkick";
import "chart.js";
import Constraints from "./Constraints";
import UnitPlan from "./UnitPlan";
import "./App.less";

import worker from "workerize-loader!./worker"; // eslint-disable-line import/no-webpack-loader-syntax

const { Title } = Typography;

const App = () => {
  const workerInstance = worker();

  const [introOpen, setIntroOpen] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [constraints, setConstraints] = useState({
    unitX: 240,
    unitY: 320,
    bedSize: 0.7,
    circulation: 0.5,
  });

  const [unitPlan, setUnitPlan] = useState({
    geometries: [
      {
        label: "Unit",
        coords: [
          { x: 0, y: 0 },
          { x: 0, y: constraints.unitY },
          { x: constraints.unitX, y: constraints.unitY },
          { x: constraints.unitX, y: 0 },
        ],
      },
    ],
    images: [],
  });

  useEffect(() => console.log(unitPlan), [unitPlan]);

  useEffect(() => {
    workerInstance.addEventListener("message", (message) => {
      if (message.data.end) {
        setGenerated(true);
        setGenerating(false);
      } else {
        console.log(message.data);
        if (message.data.geometries) setUnitPlan(message.data);
      }
    });
  });

  return (
    <Row style={{ padding: 30 }} gutter={8}>
      <Modal
        title="gener8.io"
        visible={introOpen}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => setIntroOpen(false)}
      >
        <p>
          <Title>Welcome to gener8.io</Title>
        </p>
        <p>Happy generating!</p>
        <p>v1 (10/18/2020)</p>
      </Modal>
      <Col span={6}>
        <Constraints
          generating={generating}
          setGenerating={setGenerating}
          constraints={constraints}
          setConstraints={setConstraints}
        />
        <Button
          loading={generating}
          onClick={() => {
            setGenerating(true);
            workerInstance.calculatePrimes(500, 1000000000);
          }}
          block
          type="primary"
        >
          Generate
        </Button>
        <br />
        {generating || generated ? (
          <Row style={{ marginTop: 80 }}>
            <LineChart data={{ 1: 0, 2: 3, 3: 12 }} />
          </Row>
        ) : null}
      </Col>
      <Col span={15}>
        {generating || generated ? (
          <UnitPlan constraints={constraints} unitPlan={unitPlan.geometries} />
        ) : (
          <>Set some constraints, and click generate.</>
        )}
        {/*<img
            width="1000"
            height="1000"
            src={`./assets/Unit Parts_CalKing_A.svg`}
        />*/}
      </Col>
      <Col span={1}>
        <Row>
          <img
            width="100"
            height="100"
            src={process.env.PUBLIC_URL + "/assets/Logo.gif"}
            alt="logo"
          />
          <Typography.Title level={4}>gener8.io</Typography.Title>
        </Row>
      </Col>
    </Row>
  );
};

export default App;
