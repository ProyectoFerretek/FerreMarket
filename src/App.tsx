import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;