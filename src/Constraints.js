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
        value={constraints.bedSize * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, bedSize: value / 100 };
          })
        }
      />
      <Text>Bedroom Circulation Area: </Text>
      <Slider
        value={constraints.bedroomCirculationArea * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, bedroomCirculationArea: value / 100 };
          })
        }
      />
      <Text>Vanity Size: </Text>
      <Slider
        value={constraints.vanityScore * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, vanityScore: value / 100 };
          })
        }
      />
      <Text>Bathroom Circulation Area: </Text>
      <Slider
        value={constraints.bathroomCirculationArea * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, bathroomCirculationArea: value / 100 };
          })
        }
      />
      <Text>Living Circulation Area: </Text>
      <Slider
        value={constraints.livingTargetArea * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, livingTargetArea: value / 100 };
          })
        }
      />
      <Text>Closet Circulation Area: </Text>
      <Slider
        value={constraints.closetTargetArea * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, closetTargetArea: value / 100 };
          })
        }
      />
      <Text>Kitchen Circulation Area: </Text>
      <Slider
        value={constraints.kitchenTargetArea * 100}
        onChange={(value) =>
          setConstraints((prevState) => {
            return { ...prevState, kitchenTargetArea: value / 100 };
          })
        }
      />
    </div>
  );
};

export default Constraints;
