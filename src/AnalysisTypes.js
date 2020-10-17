import React from "react";
import { Row, Select } from "antd";

const { Option } = Select;

const AnalysisType = () => (
  <div>
    <Row>
      <Select default="circulation_study" style={{ width: 120 }}>
        <Option value="sun_study">Sun Study</Option>
        <Option value="circulation_study">Ciculation Study</Option>
      </Select>
    </Row>
  </div>
);

export { AnalysisType };
