import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';

function AgeChart() {
  const [histogramData, setHistogramData] = useState([]);
  const svgRef = useRef(null);

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
    if (histogramData.length === 0) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, 100]) // Adjust the domain based on your age data
      .range([0, width]);

    const bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(10))(histogramData);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .nice()
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.selectAll('*').remove();

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('rect')
      .data(bins)
      .join('rect')
      .attr('x', (d) => x(d.x0) + 1)
      .attr('width', (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr('y', (d) => y(d.length))
      .attr('height', (d) => y(0) - y(d.length))
      .style('fill', 'rgba(255, 99, 132, 1)');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top + height})`)
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(yAxis);
  }, [histogramData]);

  return (
    <div>
      <svg ref={svgRef} width={500} height={300}></svg>
    </div>
  );
}

export default AgeChart;
