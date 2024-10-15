import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'USD to PKR',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 10,
      },
    ],
  });

  useEffect(() => {
    // Use CORS proxy to bypass CORS issues
    const apiKey = 'cur_live_O1IRgs6Kqe6dRRpyqsemlmjBI8unTmT8mMKg88bN';
    const apiUrl = `https://thingproxy.freeboard.io/fetch/https://freecurrencyapi.net/api/v2/latest?apikey=${apiKey}`;

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const pkrRate = response.data.data.PKR;

        // Update chart data
        setChartData(prevData => {
          const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
          const newData = [...prevData.datasets[0].data, pkrRate];

          return {
            labels: newLabels,
            datasets: [
              {
                ...prevData.datasets[0],
                data: newData,
              },
            ],
          };
        });
      } catch (error) {
        console.error('Error fetching currency data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Fetch every 35 seconds
    const intervalId = setInterval(fetchData, 35000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-700 mb-4">USD to PKR Exchange Rate</h2>
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default App;
