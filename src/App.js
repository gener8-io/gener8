import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import { LineChart } from "react-chartkick";
import "chart.js";
import Constraints from "./Constraints";
import UnitPlan from "./UnitPlan";
import "./App.less";

const App = () => {
  const unitPlanWorker = new Worker("./worker.js");

  const [counter, setCounter] = useState(1);
  const [generate, setGenerate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
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

    //setInterval(() => setUnitPlan(), 6000);
  }, [generating]);

  useEffect(() => {
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 6000);
  }, [generated]); */

  useEffect(() => {
    unitPlanWorker.onmessage = ($event) => {
      if ($event && $event.data) {
        setUnitPlan($event.data);
      }
    };
  }, [unitPlanWorker]);

  //const computeUnitPlans = (bedSize)

  return (
    <Row style={{ padding: 30 }} gutter={8}>
      <Col span={6}>
        <Constraints
          generating={generating}
          setGenerating={setGenerating}
          constraints={constraints}
          setConstraints={setConstraints}
        />
        <br />
        Count: {counter}
        {generating || generated ? (
          <Row style={{ marginTop: 80 }}>
            <LineChart data={{ 1: 0, 2: 3, 3: 12 }} />
          </Row>
        ) : null}
      </Col>
      <Col span={15}>
        {generating || generated ? (
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
