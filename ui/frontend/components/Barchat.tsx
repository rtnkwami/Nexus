


import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';



const data = [
  {name: 'Monday', uv: 400, pv: 300, amt: 2400},
    {name: 'Tuesday', uv: 500, pv: 400, amt: 2400},
      {name: 'Wednesday', uv: 300, pv: 100, amt: 2400},
      {name: 'Thursday', uv: 2400, pv: 600, amt: 2400},
      {name: 'Friday', uv: 2000, pv: 400, amt: 2400},
      {name: 'Saturday', uv: 100, pv: 700, amt: 2400},
      {name: 'Sunday', uv: 300, pv: 300, amt: 2400},
      {name: 'Page H', uv: 2600, pv: 400, amt: 2400},


    ];

export default function TinyChart(){
  return(
  <div className='w-fit h-fit'>
     <LineChart width={700} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} >
    <Line type="monotone" dataKey="uv" stroke="#0008"  />
    <Line type='monotoneX' dataKey="pv" stroke="#05f6"/>
    <CartesianGrid stroke="#ccc"  vertical={false} />
    <XAxis dataKey="name"  axisLine={false}/>
    <YAxis />
    <Tooltip />
  </LineChart>
  </div>


)

}