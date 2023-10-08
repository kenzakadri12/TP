// GenreChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const GenreChart = ({ personnes }) => {
  // Comptez le nombre de "Mme" et "Mr"
  const countMme = personnes.filter((personne) => personne.genre === 'Mme').length;
  const countMr = personnes.filter((personne) => personne.genre === 'Mr').length;

  // Données pour le graphique à secteurs (Doughnut)
  const chartData = {
    labels: ['Mme', 'Mr'],
    datasets: [
      {
        data: [countMme, countMr],
        backgroundColor: ['#FF6384','#36A2EB'], // Couleurs des secteurs
      },
    ],
  };

  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <div className="chart-container" style={{ maxWidth: '300px', margin: '0 auto' }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GenreChart;
