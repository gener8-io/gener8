import React, { Fragment } from "react";
import Room from "./Room";

const UnitPlan = ({ unitPlan }) => (
  <div>
    <svg viewBox="-100 -100 2500 2500" shape-rendering="geometricPrecision">
      {unitPlan.map((r) => (
        <Fragment>
          <img width="1000" height="1000" src={`./assets/Unit Parts_CalKing_A.svg`} />
          <Room key={r.label} {...r} />
        </Fragment>
      ))}
    </svg>
  </div>
);

export default UnitPlan;
