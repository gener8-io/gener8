import React, { Fragment } from "react";
import { Typography } from "antd";
import Room from "./Room";

const { Title } = Typography;

const UnitPlan = ({ unitPlan, constraints }) => {
  const scale = (window.innerHeight - 200.) / constraints.unitY;
	const offset_x = 90;
	const offset_y = 90;

  return (
    <div>
      <Title level={3}>Unit Plan</Title>
	  <div style={{
		  position:"relative",
		  width:Math.round(scale * constraints.unitX)+"px",
		  height:Math.round(scale * constraints.unitY)+"px"
	  }}>
	  <svg 
		  viewBox={`0 0 ${constraints.unitX} ${constraints.unitY}`}
		  width = {Math.round(scale * constraints.unitX)}
		  height = {Math.round(scale * constraints.unitY)}
		  style={
			  {
				  position:"absolute",
				  left:offset_x+"px",
				  top:offset_y+"px",
			  }
	  }
      >
        
        {unitPlan.geometries.map((r) => (
          <Fragment key={r.label}>
            <Room key={r.label} {...r} />
          </Fragment>
        ))}
      </svg>
      {unitPlan.images.map((i) => (
          <div
		  style={
			  {
				  position:"absolute",
				  "background-color":"rgba(0, 1, 0, 0.4)",
				  left:offset_x + Math.round(scale * i.rect.x)+"px",
				  top:offset_y + Math.round(scale * i.rect.y)+"px",
				  width:Math.round(scale * i.rect.w)+"px",
				  height:Math.round(scale * i.rect.h)+"px"
			  }
		  } ></div>
        ))}
    </div>
    </div>
  );
};
      // {unitPlan.images.map((i) => (
      //     <img
		  // viewBox={`0 0 ${i.rect.w} ${i.rect.h}`}
		  // width = {Math.round(scale * i.rect.w)}
		  // height = {Math.round(scale * i.rect.h)}
		  // style={
			  // {
				  // position:"absolute",
				  // left:offset_x + Math.round(scale * i.rect.x)+"px",
				  // top:offset_y + Math.round(scale * i.rect.y)+"px"
			  // }
		  // } src={`./assets/Unit Parts_${i.id}.svg`} />
      //   ))}

export default UnitPlan;
