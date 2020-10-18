import React from "react";
import { Slider, Typography, Row, Col, InputNumber } from "antd";

const { Title, Text } = Typography;

const Constraints = ({
  constraints,
  setConstraints
}) => {
  return (
    <div>
      <Title level={3}>Constraints</Title>
      <Row gutter={6}>
        <Col>
          <Text>Unit X (in): </Text>
        </Col>
        <Col>
          <InputNumber
            defaultValue={240}
            value={constraints.unitX}
            onChange={(value) =>
              setConstraints((prevState) => {
                return { ...prevState, unitX: value };
              })
            }
          />
        </Col>
      </Row>
      <br />
      <Row gutter={8}>
        <Col>
          <Text>Unit Y (in): </Text>
        </Col>
        <Col>
          <InputNumber
            defaultValue={240}
            value={constraints.unitY}
            onChange={(value) =>
              setConstraints((prevState) => {
                return { ...prevState, unitY: value };
              })
            }
          />
        </Col>
      </Row>
      <Text>Bed Size: </Text>
      <Slider
        defaultValue={50}
        value={constraints.bedSize * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, bedSize: value / 100 };
          })
        }
      />
      <Text>Bedroom Circulation Area: </Text>
      <Slider
        defaultValue={50}
        value={constraints.circulation * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, circulation: value / 100 };
          })
        }
      />
    </div>
  );
};

export default Constraints;
