import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        <li>
          <Link to="/genre">Genre</Link>
        </li>
        {/* Ajoutez d'autres liens de navigation ici */}
      </ul>
    </div>
  );
}

export default Sidebar;
