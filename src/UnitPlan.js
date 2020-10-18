import React, { Fragment } from "react";
import { Typography } from "antd";
import Room from "./Room";

const { Title } = Typography;

const UnitPlan = ({ unitPlan, constraints }) => {
  const scale = constraints.unitY / window.innerHeight;

  return (
    <div>
      <Title level={3}>Unit Plan</Title>
      <svg
        viewBox={`-10 -10 ${constraints.unitX / scale} ${constraints.unitY / scale}`}
      >
        {unitPlan.images.map((i) => (
          <img src={`./Unit Parts_${i.id}.svg`} />
        ))}
        {unitPlan.geometries.map((r) => (
          <Fragment key={r.label}>
            <Room key={r.label} {...r} />
          </Fragment>
        ))}
      </svg>
    </div>
  );
};

export default UnitPlan;
