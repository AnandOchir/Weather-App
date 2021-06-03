import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export const Charts = ({width, height, data}) => {
    return (
        <LineChart width={width} height={height} data={data}>
            <Line type="monotone" dataKey="activityScore" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis type={'number'} domain={[0, 10]}  />
            <Tooltip />
        </LineChart>
    )
};