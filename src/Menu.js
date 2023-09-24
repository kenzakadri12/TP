import React, { useState } from 'react';
import GenreChart from './GenreChart'; 
import { Navbar, Nav } from 'react-bootstrap';

function Menu() {
    const [showGenreChart, setShowGenreChart] = useState(false);

  const handleGenreClick = () => {
    console.log('Genre Clicked');
    setShowGenreChart(true);
  };
    return (
        <nav className="navbar navbar-light bg-light">
          <div className="btn-group" role="group" aria-label="Menu">
            <a className="btn btn-outline-success" href="#home">Home</a>
            <span className="mx-2"></span> {/* Ajoute de l'espace entre les boutons */}
            <a className="btn btn-outline-secondary" href="#genre">Genre</a>
            <span className="mx-2"></span> {/* Ajoute de l'espace entre les boutons */}
            <a className="btn btn-outline-secondary" href="#style">Style</a>
          </div>
        </nav>
      );
}

export default Menu;
