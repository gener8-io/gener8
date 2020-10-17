
import React, { useState } from "react";
import { Row, Col } from "antd";
import { AnalysisType } from "./AnalysisTypes";
import Constraints from "./Constraints";
import {Room} from './Room';
import "./App.less";

const App = () => {
  const [analysisTypes, setAnalysisTypes] = useState(["Bed Size"]);
  const [constraints, setConstraints] = useState({ bedSize: "Queen" });

  return (
    <Row style={{ padding: 40 }}>
      <Col>
        <AnalysisType
          analysisTypes={analysisTypes}
          setAnalysisTypes={setAnalysisTypes}
          span={8}
        />
      </Col>
      <Col span={8}>
        <div>Gallery</div>
      </Col>
      <Col span={8}>
        <Constraints
          constraints={constraints}
          setConstraints={setConstraints}
        />
      </Col>
      <Room posx={1} posy={1}/>
    </Row>
  );
};

export default App;