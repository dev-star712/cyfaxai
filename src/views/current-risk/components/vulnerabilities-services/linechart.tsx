import React from 'react';  
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';  
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";  

interface CustomizedDotProps {  
  cx: number;  
  cy: number;  
  payload: {  
    name: string;  
    uv: number; // Add these to match your data structure  
    pv: number; // Add these to match your data structure  
  };  
}  

const renderCustomizedDot = (props: CustomizedDotProps): JSX.Element => {  
  const { cx, cy, payload } = props;  
  const svgUrl = payload.uv > payload.pv ? '/smiley.svg' : '/neutral.svg';   
  
  return (  
    <image href={svgUrl} x={cx - 10} y={cy - 10} width="20" height="20" />  
  );  
};  

const ChartLine = () => {  
  const { vuln_chart } = useDetailReport();  
  const chartData = vuln_chart ? Object.entries(vuln_chart).map(([name, data]) => ({  
    name,  
    uv: data ? data.total : 0,   // Total vulnerabilities  
    pv: data ? data.exploitable : 0,  // Exploitable vulnerabilities  
  })) : [];  

  return (  
    <ResponsiveContainer width="100%" height="100%">  
      <LineChart  
        width={500}  
        height={300}  
        data={chartData}  
        margin={{  
          top: 5,  
          right: 30,  
          left: 20,  
          bottom: 5,  
        }}  
      >  
        <CartesianGrid strokeDasharray="3 3" />  
        <XAxis dataKey="name" />  
        <YAxis />  
        <Tooltip />  
        <Legend />  
        <Line type="monotone" dataKey="uv" name="Total Vulnerabilities" stroke="#ab00ab" activeDot={{ r: 8 }} />  
        <Line   
          type="monotone"  
          dataKey="pv"  
          name="Exploitable Services"  
          stroke="#390039"  
          dot={renderCustomizedDot} // Adjusted to pass both uv and pv values.   
        />  
      </LineChart>  
    </ResponsiveContainer>  
  );  
};  

export default ChartLine;