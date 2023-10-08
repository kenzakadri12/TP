import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';

function PairsChartD3() {
  const [chartData, setChartData] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRMR2lIm2aoTC9uqC6L8yMtazMa5vjCxUPR0ETQsXz52B63Hnu6LMGp-0irFcvuj2LGOQlOWiRVCEe/pub?output=csv',
      {
        download: true,
        header: true,
        complete: (result) => {
          const responses = result.data.map((row) => row['Combien de paires de baskets achetez-vous en moyenne par mois ?']);

          const responseCounts = {
            'Aucune': 0,
            '1 paire': 0,
            '2 paire': 0,
            '3 paire ou plus': 0,
          };

          responses.forEach((response) => {
            if (response === 'Aucune') {
              responseCounts['Aucune']++;
            } else if (response === '1 paire') {
              responseCounts['1 paire']++;
            } else if (response === '2 paire') {
              responseCounts['2 paire']++;
            } else if (response === '3 paire ou plus') {
              responseCounts['3 paire ou plus']++;
            }
          });

          setChartData(Object.entries(responseCounts));
        },
      }
    );
  }, []);

  useEffect(() => {
    if (chartData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(chartData.map((d) => d[0]))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, (d) => d[1])])
      .nice()
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.selectAll('*').remove();

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('rect')
      .data(chartData)
      .join('rect')
      .attr('x', (d) => x(d[0]))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d[1]))
      .attr('height', (d) => height - y(d[1]))
      .style('fill', 'rgba(173, 216, 230, 5)');

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top + height})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(yAxis);
  }, [chartData]);

  return (
    <div>
      <svg ref={svgRef} width={500} height={300}></svg>
    </div>
  );
}

export default PairsChartD3;
