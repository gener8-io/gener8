import React, { useState } from "react";
import { Button, Col, Card, Switch, Row, Select, Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

const AnalysisType = ({ analysisTypes, setAnalysisTypes }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  return (
    <div>
      <Row>
        <Title level={3}>Analysis Type</Title>
      </Row>
      <Row>
        <Col>
          <Select
            defaultValue="Bed Size"
            onChange={(value) => setCurrentAnalysis(value)}
          >
            <Option value="Bed Size">Bed Size</Option>
          </Select>
        </Col>
        <Col>
          <Button
            onClick={() =>
              setAnalysisTypes([...analysisTypes, currentAnalysis])
            }
          >
            Add
          </Button>
        </Col>
      </Row>
      {analysisTypes.map((at) => (
        <Card>{at}</Card>
      ))}
    </div>
  );
};

export default AnalysisType;
