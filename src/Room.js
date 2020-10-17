import React from 'react'
import {ReactSVG} from 'react-svg'

const Room = ({img, posx, posy}) => {
  console.log(posx)
  return (
    <div>
      <svg>

        <rec x={posx} y={posy} rx="20" ry="20" width="150" height="150"/>

      </svg>


      
    </div>
  )
}

export  {Room}
