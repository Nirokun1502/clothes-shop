import { useState } from "react";
import { Button, Select, MenuItem, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import axios from "axios";

// Define the CustomTooltip component
const CustomTooltip = ({ payload, label }) => {
  if (payload && payload.length) {
    const { totalRevenue } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <p>{`Tháng: ${label}`}</p>
        <p>{`Doanh thu: ${totalRevenue.toLocaleString()} Đ`}</p>
      </div>
    );
  }
  return null;
};

const MonthlyRevenueChart = () => {
  const [year, setYear] = useState(2024);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://localhost:7121/api/Order/MonthlyRevenue?year=${year}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllMonths = () => {
    return Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalRevenue: data.find((d) => d.month === index + 1)?.totalRevenue || 0,
    }));
  };

  const chartData = getAllMonths();

  return (
    <Box>
      <Select value={year} onChange={handleYearChange}>
        {/* Populate this menu with years as needed */}
        <MenuItem value={2024}>2024</MenuItem>
        <MenuItem value={2023}>2023</MenuItem>
        <MenuItem value={2022}>2022</MenuItem>
        <MenuItem value={2021}>2021</MenuItem>

        {/* Add more years if needed */}
      </Select>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : "Load Data"}
      </Button>

      <BarChart
        width={600}
        height={300}
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickFormatter={(month) => `${month}`} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="totalRevenue" fill="#8884d8" />
      </BarChart>
    </Box>
  );
};

export default MonthlyRevenueChart;
