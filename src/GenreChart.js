// GenreChart.js

import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function GenreChart({ genreData }) { // Renommez "data" en "genreData"
  useEffect(() => {
    if (!genreData) return;

    const ctx = document.getElementById('genreChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Mme', 'Mr'],
        datasets: [
          {
            data: [genreData['Mme'] || 0, genreData['Mr'] || 0],
            backgroundColor: ['#ff9999', '#66b3ff'], // Couleurs des secteurs
          },
        ],
      },
    });
  }, [genreData]);

  return (
    <div>
      <canvas id="genreChart" width="400" height="400"></canvas>
    </div>
  );
}

export default GenreChart;
