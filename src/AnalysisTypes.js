import React, { useState } from "react";
import { Card, Button, Row, Col, Select, Typography, Switch } from "antd";

const { Option } = Select;
const { Title } = Typography;

const AnalysisType = ({ analysisTypes, setAnalysisTypes }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  return (
    <div style={{ padding: 40 }}>
      <Row>
        <Title level={3}>Analysis Type</Title>
      </Row>
      <Row>
        <Col>
          <Select
            defaultValue="circulation_area"
            onChange={(value) => setCurrentAnalysis(value)}
          >
            <Option value="circulation_area">Circulation Area</Option>
            <Option value="bed_size">Bed Size</Option>
          </Select>
        </Col>
        <Col>
          <Button
            onClick={() => setAnalysisTypes([...analysisTypes, currentAnalysis])}
          >
            Add
          </Button>
        </Col>
      </Row>
      {analysisTypes.map((at) => (
        <Card>
          {at.label} <Switch></Switch>
        </Card>
      ))}
    </div>
  );
};

export { AnalysisType };
