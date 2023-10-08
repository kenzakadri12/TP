import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import Papa from 'papaparse';

function BrandChartD3() {
  const [favoriteBrandsData, setFavoriteBrandsData] = useState({});
  const svgRef = useRef(null);

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRMR2lIm2aoTC9uqC6L8yMtazMa5vjCxUPR0ETQsXz52B63Hnu6LMGp-0irFcvuj2LGOQlOWiRVCEe/pub?output=csv',
      {
        download: true,
        header: true,
        complete: (result) => {
          const data = result.data.map((row) => row['Quelle est votre marque de baskets préférée ?']);
          const choices = [
            'ADIDAS', 'NIKE', 'PUMA', 'VANS', 'REEBOK', 'CONVERSE', 'NB',
            'JORDAN', 'BALENCIAGA',
          ];

          const brandCounts = {};
          choices.forEach((choice) => {
            brandCounts[choice] = 0;
          });

          data.forEach((choices) => {
            const selectedBrands = choices.split(', ');
            selectedBrands.forEach((brand) => {
              if (brandCounts.hasOwnProperty(brand)) {
                brandCounts[brand] += 1;
              }
            });
          });

          setFavoriteBrandsData(brandCounts);
        },
      }
    );
  }, []);

  useEffect(() => {
    if (Object.keys(favoriteBrandsData).length === 0) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const brandLabels = Object.keys(favoriteBrandsData);
    const responseCounts = Object.values(favoriteBrandsData);

    const x = d3
      .scaleBand()
      .domain(brandLabels)
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(responseCounts)])
      .nice()
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.selectAll('*').remove();

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('rect')
      .data(brandLabels)
      .join('rect')
      .attr('x', (brand) => x(brand))
      .attr('width', x.bandwidth())
      .attr('y', (brand) => y(favoriteBrandsData[brand]))
      .attr('height', (brand) => height - y(favoriteBrandsData[brand]))
      .style('fill', 'rgba(75, 192, 192, 1)');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top + height})`)
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(yAxis);
  }, [favoriteBrandsData]);

  return (
    <div>
      <svg ref={svgRef} width={500} height={300}></svg>
    </div>
  );
}

export default BrandChartD3;
