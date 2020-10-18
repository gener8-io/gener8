import React, { Fragment } from "react";
import { Typography } from "antd";
import Room from "./Room";

const { Title } = Typography;

const UnitPlan = ({ unitPlan, constraints }) => (
  <div>
    <Title level={3}>Unit Plan</Title>
    <svg
      viewBox={`-10 -10 ${constraints.unitX + 50} ${constraints.unitY + 50}`}
    >
      {unitPlan.map((r) => (
        <Fragment key={r.label}>
          <Room key={r.label} {...r} />
        </Fragment>
      ))}
    </svg>
  </div>
);

export default UnitPlan;
