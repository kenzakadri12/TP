import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import Papa from 'papaparse';

function AgeChart() {
  const [chart, setChart] = useState(null);
  const [histogramData, setHistogramData] = useState([]);

  useEffect(() => {
    // Fetch and parse the CSV data
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRMR2lIm2aoTC9uqC6L8yMtazMa5vjCxUPR0ETQsXz52B63Hnu6LMGp-0irFcvuj2LGOQlOWiRVCEe/pub?output=csv',
      {
        download: true,
        header: true,
        complete: (result) => {
          // Extract the data you want to create a histogram for
          const ages = result.data.map((row) => parseInt(row['Âge'], 10)).filter((age) => !isNaN(age));
          setHistogramData(ages);
        },
      }
    );
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('histogram-chart');

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    // Create age ranges and count participants in each range
    const ageRanges = {
      '10-20': 0,
      '20-30': 0,
      '30-40': 0,
      '40-50': 0,
      '50+': 0, // Combinez les tranches supérieures à 50
    };

    histogramData.forEach((age) => {
      if (age >= 10 && age < 20) {
        ageRanges['10-20'] += 1;
      } else if (age >= 20 && age < 30) {
        ageRanges['20-30'] += 1;
      } else if (age >= 30 && age < 40) {
        ageRanges['30-40'] += 1;
      } else if (age >= 40 && age < 50) {
        ageRanges['40-50'] += 1;
      } else {
        ageRanges['50+'] += 1;
      }
    });

    const ageRangeLabels = Object.keys(ageRanges);
    const participantCounts = Object.values(ageRanges);

    const data = {
      labels: ageRangeLabels,
      datasets: [
        {
          label: 'Âge',
          data: participantCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    if (chart) {
      chart.destroy();
    }

    const newChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            type: 'category',
            position: 'bottom',
          },
          y: {
            type: 'linear',
            position: 'left',
          },
        },
      },
    });

    setChart(newChart);

    return () => {
      <h2>Répartition par Genre</h2>
      if (newChart) {
        newChart.destroy();
      }
    };
  }, [histogramData]);

  return <canvas id="histogram-chart" />;
}

export default AgeChart;
