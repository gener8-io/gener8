import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import { LineChart } from "react-chartkick";
import "chart.js";
import Constraints from "./Constraints";
import UnitPlan from "./UnitPlan";
import "./App.less";

const unitPlan = [
  {
    label: "Closet",
    coords: [
      { x: 0, y: 0 },
      { x: 0, y: 1000 },
      { x: 300, y: 1000 },
      { x: 300, y: 0 },
    ],
  },
  {
    label: "Bedroom",
    coords: [
      { x: 0, y: 1000 },
      { x: 1000, y: 1000 },
      { x: 1000, y: 2000 },
      { x: 0, y: 2000 },
    ],
  },
  {
    label: "Bath",
    coords: [
      { x: 300, y: 0 },
      { x: 300, y: 1000 },
      { x: 1000, y: 1000 },
      { x: 1000, y: 0 },
    ],
  },
  {
    label: "Living",
    coords: [
      { x: 1000, y: 1000 },
      { x: 1000, y: 2000 },
      { x: 2000, y: 2000 },
      { x: 2000, y: 1000 },
    ],
  },
  {
    label: "Kitchen",
    coords: [
      { x: 1000, y: 0 },
      { x: 1000, y: 1000 },
      { x: 2000, y: 1000 },
      { x: 2000, y: 0 },
    ],
  },
];

const App = () => {
  //const appleWorker = new Worker("./worker.js");

  const [generating, setGenerating] = useState(false);
  const [constraints, setConstraints] = useState({
    unitX: 240,
    unitY: 320,
    bedSize: 0.7,
    circulation: 0.5,
  });

  /*useEffect(() => {
    appleWorker.onmessage = ($event) => {
      if ($event && $event.data) {
        //setCountApple($event.data);
      }
    };
  }, [appleWorker]);*/

  useEffect(() => {
    console.log(constraints);
  }, [constraints]);

  //const computeUnitPlans = (bedSize)

  return (
    <Row style={{ padding: 30 }}>
      <Col span={6}>
        <Constraints
          setGenerating={setGenerating}
          constraints={constraints}
          setConstraints={setConstraints}
        />
        <br />
        {generating && (
          <Row style={{ marginTop: 80 }}>
            <LineChart data={{ 1: 0, 2: 3, 3: 12 }} />
          </Row>
        )}
      </Col>
      <Col span={15}>
        <UnitPlan unitPlan={unitPlan} />
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
