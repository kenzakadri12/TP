import React, { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const PairsChart = ({ personnes }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (personnes && personnes.length > 0) {
      // Initialisation d'un objet pour compter le nombre de réponses
      const responseCounts = {
        '1 paire': 0,
        '2 paires': 0,
        '3 paires ou plus': 0,
        'Aucune': 0,
      };

      // Comptage des réponses
      personnes.forEach((personne) => {
        const choice = personne["Combien de paires de baskets achetez-vous en moyenne par mois ?"];
        if (responseCounts.hasOwnProperty(choice)) {
          responseCounts[choice]++;
        }
      });

      // Données pour le graphique à barres empilées
      const data = {
        labels: Object.keys(responseCounts),
        datasets: [
          {
            label: 'Nombre de personnes',
            data: Object.values(responseCounts),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
            ],
          },
        ],
      };

      setChartData(data);
    }
  }, [personnes]);

  // Options du graphique
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
        {chartData ? <Bar ref={chartRef} data={chartData} options={options} /> : 'Chargement en cours...'}
      </div>
    </div>
  );
};

export default PairsChart;
