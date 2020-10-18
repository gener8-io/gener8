import React, { Fragment } from "react";
import { Typography } from "antd";
import Room from "./Room";

const { Title } = Typography;

const UnitPlan = ({ unitPlan }) => (
  <div>
    <Title level={3}>Unit Plan</Title>
    <svg viewBox="-100 -100 2500 2500">
      {unitPlan.map((r) => (
        <Fragment key={r.label}>
          <line x1="0" y1="-40" x2="2000" y2="-40" stroke="black" />
          <line x1="0" y1="-20" x2="0" y2="-60" stroke="black" />
          <line x1="2000" y1="-20" x2="2000" y2="-60" stroke="black" />
          <Room key={r.label} {...r} />
        </Fragment>
      ))}
    </svg>
  </div>
);

export default UnitPlan;
