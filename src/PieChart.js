import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';

const StackedBarChart = () => {
  const [chartData, setChartData] = useState(null);
  const [legendColors, setLegendColors] = useState({});

  useEffect(() => {
    // Fetch and parse the CSV data
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRMR2lIm2aoTC9uqC6L8yMtazMa5vjCxUPR0ETQsXz52B63Hnu6LMGp-0irFcvuj2LGOQlOWiRVCEe/pub?output=csv',
      {
        download: true,
        header: true,
        complete: (result) => {
          // Extract the data you want to analyze
          const data = result.data;

          // Questions
          const question1 = 'Quel est généralement votre budget pour l\'achat d\'une paire de baskets ?';
          const question2 = 'Qu\'est-ce qui influence le plus votre choix de marque de baskets ?';

          // Prétraitement des données pour regrouper les réponses par intervalle de budget et de facteurs d'influence
          const groupedData = {};
          const personCounts = {}; // Stocke le nombre de personnes par intervalle de budget
          data.forEach((row) => {
            const budget = row[question1];
            const influenceFactor = row[question2];
            if (!groupedData[budget]) {
              groupedData[budget] = {};
              personCounts[budget] = 0;
            }
            if (!groupedData[budget][influenceFactor]) {
              groupedData[budget][influenceFactor] = 0;
            }
            groupedData[budget][influenceFactor]++;
            personCounts[budget]++;
          });

          // Créer un tableau d'objets pour le graphique en barres empilées
          const budgets = Object.keys(groupedData);
          const influenceFactors = [...new Set(data.map((row) => row[question2]))];
          const dataForChart = {
            labels: budgets,
            datasets: influenceFactors.map((factor) => {
              const color = getRandomColor(); // Générer une couleur aléatoire pour chaque facteur d'influence
              setLegendColors((prevColors) => ({ ...prevColors, [factor]: color })); // Stocker la couleur dans le state
              return {
                label: factor,
                data: budgets.map((budget) => groupedData[budget][factor] || 0),
                backgroundColor: color, // Utiliser la couleur générée pour chaque facteur d'influence
              };
            }),
          };

          // Ajouter une série de données pour le nombre de personnes dans chaque intervalle
          dataForChart.datasets.push({
            label: 'Nombre de personnes',
            data: budgets.map((budget) => personCounts[budget] || 0),
            backgroundColor: 'rgba(128, 128, 128, 0.7)',
          });

          setChartData(dataForChart);
        },
      }
    );
  }, []);

  // Générer une couleur aléatoire au format rgba
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  // Légende personnalisée avec les couleurs correspondant aux facteurs d'influence
  const legend = {
    display: true,
    position: 'top',
    labels: {
      generateLabels: (chart) => {
        const datasets = chart.data.datasets;
        const legendItems = [];

        datasets.forEach((dataset, datasetIndex) => {
          const item = {
            text: dataset.label,
            fillStyle: legendColors[dataset.label] || dataset.backgroundColor,
          };
          legendItems.push(item);
        });

        return legendItems;
      },
    },
  };

  return (
    <div>
      <h2>Répartition par Budget et Facteur d'Influence</h2>
      <div className="chart-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
        {chartData ? <Bar data={chartData} options={options} legend={legend} /> : 'Chargement en cours...'}
      </div>
    </div>
  );
};

export default StackedBarChart;
