import React, { useState } from "react";
import { Row, Col } from "antd";
import { AnalysisType } from "./AnalysisTypes";
import "./App.less";

const App = () => {
  const [analysisTypes, setAnalysisTypes] = useState([
    { key: "circulation_area", label: "Circulation Area" },
  ]);
  return (
    <Row>
      <Col>
        <AnalysisType analysisTypes={analysisTypes} setAnalysisTypes={setAnalysisTypes} span={8} />
      </Col>
      <Col span={10}>
        <div>Gallery</div>
      </Col>
      <Col span={8}>Constaints</Col>
    </Row>
  );
};

export default App;
