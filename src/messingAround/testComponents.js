import React, {useState} from "react";
import { Card, Button, Row, Col, Select, Typography, Switch, Input } from "antd";

const { Option } = Select;
const { Title } = Typography;

const TestComponent = () => {
  
  return (
    <div style={{ padding: 40 }}>
      <Row>
        <Title level={3}>Constraints</Title>
      </Row>
      <Row>
        <Card style={ {width:400}}>
          <ul style={{padding:10}}>
          <Input style={{marginBottom:15}}placeholder="Item 1"></Input>
          <Input style={{marginBottom:15}}placeholder="Item 2"></Input>
          <Input style={{marginBottom:15}}placeholder="Item 3"></Input>
          Toggle Something?
          <Switch/>
          </ul>    

        </Card>
      </Row>
    </div>
  );
};

export { TestComponent };
