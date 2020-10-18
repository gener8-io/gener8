import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import { LineChart } from "react-chartkick";
import "chart.js";
import Constraints from "./Constraints";
import UnitPlan from "./UnitPlan";
import "./App.less";

const App = () => {
  //const appleWorker = new Worker("./worker.js");

  const [generating, setGenerating] = useState(false);
  const [constraints, setConstraints] = useState({
    unitX: 240,
    unitY: 320,
    bedSize: 0.7,
    circulation: 0.5,
  });

  const [unitPlan, setUnitPlan] = useState([
    {
      label: "Closet",
      coords: [
        { x: 0, y: 0 },
        { x: 0, y: 100 },
        { x: 30, y: 100 },
        { x: 30, y: 0 },
      ],
    },
    {
      label: "Bedroom",
      coords: [
        { x: 0, y: 100 },
        { x: 100, y: 100 },
        { x: 100, y: 200 },
        { x: 0, y: 200 },
      ],
    },
    {
      label: "Bath",
      coords: [
        { x: 30, y: 0 },
        { x: 30, y: 100 },
        { x: 100, y: 100 },
        { x: 100, y: 0 },
      ],
    },
    {
      label: "Living",
      coords: [
        { x: 100, y: 100 },
        { x: 100, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 100 },
      ],
    },
    {
      label: "Kitchen",
      coords: [
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 0 },
      ],
    },
  ]);

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
        {generating ? (
          <UnitPlan constraints={constraints} unitPlan={unitPlan} />
        ) : (
          <>Start gener8</>
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
