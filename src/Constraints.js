import React from "react";
import { Slider, Typography, Row, Col, Select } from "antd";

const { Title } = Typography;
const { Option } = Select;

const bedSizes = ["Twin", "Twin XL", "Queen", "King", "California King"];

const Constraints = ({constraints, setConstaints}) => (
  <div>
    <Row>
      <Title level={3}>Constraints</Title>
    </Row>
    <Row>
      <Col span={3}>Bed Size: </Col>
      <Col>
        <Select defaultValue={constraints?.bedSize} >
          {bedSizes.map((bz) => (
            <Option>{bz}</Option>
          ))}
        </Select>
      </Col>
    </Row>
  </div>
);

export default Constraints;
