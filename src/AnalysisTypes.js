import React from "react";
import { Row, Select, Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

const AnalysisType = () => (
  <div>
    <Row>
    <Title level={3}>Analysis Type</Title>
    </Row>
    <Row>
      <Select defaultValue="circulation_area">
        <Option value="circulation_area">Circulation Area</Option>
        <Option value="bed_size">Bed Size</Option>
      </Select>
    </Row>
  </div>
);

export { AnalysisType };
