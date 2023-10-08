// Routes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GenreChartD3 from './GenreChartD3'; // Importez votre composant GenreChartD3 ici

function AppRoutes() {
  return (
    <Routes>
      {/* Ajoutez la route pour le composant GenreChartD3 */}
      <Route path="/GenreChartD3" element={<GenreChartD3 />} />
    </Routes>
  );
}

export default AppRoutes;
