import React, { useState } from "react";
import { Row, Col } from "antd";
import AnalysisType from "./AnalysisTypes";
import Constraints from "./Constraints";

import UnitPlan from "./UnitPlan";

import "./App.less";

const colors = {
  Closet: "red",
  Bedroom: "blue",
  Bath: "green",
  Kitchen: "yellow",
  Living: "cyan",
};

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
  const [analysisTypes, setAnalysisTypes] = useState(["Bed Size"]);
  const [constraints, setConstraints] = useState({
    bedSize: 0.5,
    circulation: 0.5,
  });

  //const computeUnitPlans = (bedSize)

  return (
    <Row>
      <Col span={6}>
        <AnalysisType
          analysisTypes={analysisTypes}
          setAnalysisTypes={setAnalysisTypes}
        />
      </Col>
      <Col span={10}>
        <UnitPlan unitPlan={unitPlan} />
        
      </Col>
      <Col span={8}>
        <Constraints
          constraints={constraints}
          setConstraints={setConstraints}
        />
      </Col>
    </Row>
  );
};

export default App;
