import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { HourlyData } from '../types/weather';
import { getTimeFromTimestamp } from '../utils/weatherUtils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface ForecastChartProps {
  hourlyData: HourlyData[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ hourlyData }) => {
  const chartData = useMemo(() => {
    const labels = hourlyData.map(hour => getTimeFromTimestamp(hour.dt));
    const temperatures = hourlyData.map(hour => hour.temp);
    
    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 0.8)',
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
          tension: 0.4,
        },
      ],
    };
  }, [hourlyData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'system-ui, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          family: 'system-ui, sans-serif',
          size: 14,
        },
        bodyFont: {
          family: 'system-ui, sans-serif',
          size: 13,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: (value: number) => `${value}°C`,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg text-white h-80">
      <h3 className="text-lg font-semibold mb-4">24-Hour Forecast</h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ForecastChart;