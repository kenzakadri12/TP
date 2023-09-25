import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';

const PairsChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch and parse the CSV data
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRMR2lIm2aoTC9uqC6L8yMtazMa5vjCxUPR0ETQsXz52B63Hnu6LMGp-0irFcvuj2LGOQlOWiRVCEe/pub?output=csv',
      {
        download: true,
        header: true,
        complete: (result) => {
          // Extract the data you want to analyze
          const responses = result.data.map((row) => row['Combien de paires de baskets achetez-vous en moyenne par mois ?']);

          // Initialize an object to count response frequencies
          const responseCounts = {
            'Aucune': 0,
            '1 paire': 0,
            '2 paires': 0,
            '3 paires ou plus': 0,
          };

          // Count responses
          responses.forEach((response) => {
            if (responseCounts.hasOwnProperty(response)) {
              responseCounts[response]++;
            }
          });

          // Data for the bar chart
          const data = {
            labels: Object.keys(responseCounts),
            datasets: [
              {
                label: 'Nombre de personnes',
                data: Object.values(responseCounts),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                ],
              },
            ],
          };

          setChartData(data);
        },
      }
    );
  }, []);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        beginAtZero: true,
        stacked: true,
      },
    },
  };

  return (
    <div>
      <h2>Répartition par Nombre de Paires</h2>
      <div className="chart-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
        {chartData ? <Bar data={chartData} options={options} /> : 'Chargement en cours...'}
      </div>
    </div>
  );
};

export default PairsChart;
