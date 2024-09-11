'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Rectangle,
} from 'recharts';
import { PieChart, Pie, Sector, Cell } from 'recharts';

export const DailyCompaniesChart = ({
  dailyActiveCompanies,
}: {
  dailyActiveCompanies: any;
}) => {
  console.log(
    '🚀 ~ file: dailyCompaniesChart.tsx:18 ~ dailyActiveCompanies:',
    dailyActiveCompanies,
  );
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={dailyActiveCompanies}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="companies"
            fill="#103a7c"
            activeBar={<Rectangle fill="black" stroke="lightGray" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export const DailyUsersChart = ({ dailyActiveUsers }: { dailyActiveUsers: any }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dailyActiveUsers}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#103a7c" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export const PieChartComponent = ({ data }: { data: any }) => {
  const COLORS = ['#FF6347', '#4682B4', '#3CB371', '#FFD700', '#FF1493', '#8A2BE2'];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          formatter={(value: any, entry: any) => `${value} (${entry.payload.value})`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
