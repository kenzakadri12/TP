// AgeChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const AgeChart = ({ personnes }) => {
  // Convertissez les âges en nombres entiers et comptez leur répartition
  const ageCounts = {};
  personnes.forEach((personne) => {
    const age = parseInt(personne["Âge"], 10); // Convertir en nombre entier
    if (!isNaN(age)) {
      if (ageCounts[age]) {
        ageCounts[age]++;
      } else {
        ageCounts[age] = 1;
      }
    }
  });

  const ages = Object.keys(ageCounts).map((age) => parseInt(age, 10));
  const counts = Object.values(ageCounts);

  // Données pour le graphique à barres
  const data = {
    labels: ages,
    datasets: [
      {
        label: 'Répartition par Âge',
        data: counts,
        backgroundColor: '#36A2EB', // Couleur des barres
      },
    ],
  };

  // Options du graphique
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Répartition par Âge</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AgeChart;
