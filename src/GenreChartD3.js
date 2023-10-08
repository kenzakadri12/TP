import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';


const GenreChartD3 = ({ personnes }) => {
    const chartRef = useRef(null);
  
    useEffect(() => {
      // Comptez le nombre de "Mme" et "Mr"
      const countMme = personnes.filter((personne) => personne.genre === 'Mme').length;
      const countMr = personnes.filter((personne) => personne.genre === 'Mr').length;
  
      // Données pour le graphique à secteurs (Doughnut)
      const data = [
        { genre: 'Mme', count: countMme },
        { genre: 'Mr', count: countMr },
      ];
  
      // Sélectionnez le conteneur du graphique
      const svg = d3.select(chartRef.current);
  
      // Définissez les dimensions du graphique
      const width = 300;
      const height = 300;
      const radius = Math.min(width, height) / 2;
  
      // Créez un générateur de secteur
      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius);
  
      // Créez un générateur de chemin pour le secteur
      const pie = d3.pie().value((d) => d.count);
  
      // Ajoutez un groupe SVG au conteneur
      const g = svg
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);
  
      // Créez les secteurs
      const arcs = g
        .selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');
  
      // Remplissez les secteurs avec des couleurs
      const color = d3.scaleOrdinal().domain(data.map((d) => d.genre)).range(['#FF6384', '#36A2EB']);
  
      arcs
        .append('path')
        .attr('d', arc)
        .attr('fill', (d) => color(d.data.genre));
    }, [personnes]);
  
    return (
      <div>
        <div className="chart-container" style={{ maxWidth: '15px', margin: '0 auto' }}>
          <svg ref={chartRef} width={300} height={300}></svg>
        </div>
      </div>
    );
  };
  
  export default GenreChartD3;
  