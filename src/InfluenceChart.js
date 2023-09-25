import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';

const InfluenceChart = () => {
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
          const responses = result.data.map((row) => row["Qu'est-ce qui influence le plus votre choix de marque de baskets ?"]);

          const responseCounts = {
            'Style et design': 0,
            'Confort': 0,
            'Prix': 0,
            'Réputation de la marque': 0,
            'Recommandations amis/famille': 0, // Utilisation de "amis/famille" au lieu de "amis ou de la famille"
            'Publicité': 0,
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
                label: 'Nombre de réponses',
                data: Object.values(responseCounts),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.7)',
                  'rgba(54, 162, 235, 0.7)',
                  'rgba(255, 206, 86, 0.7)',
                  'rgba(75, 192, 192, 0.7)',
                  'rgba(153, 102, 255, 0.7)',
                  'rgba(255, 159, 64, 0.7)',
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
      <h2>Répartition par Influence sur le choix de marque de baskets</h2>
      <div className="chart-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
        {chartData ? <Bar data={chartData} options={options} /> : 'Chargement en cours...'}
      </div>
    </div>
  );
};

export default InfluenceChart;
