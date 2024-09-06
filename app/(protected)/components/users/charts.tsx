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
