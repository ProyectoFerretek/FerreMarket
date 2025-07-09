import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import supabase from './lib/supabase/Supabase'; // Asegúrate de tener tu cliente de supabase configurado


const ProtectedRoute = ({ children }) => {
  const { session } = UserAuth(); // Asegúrate de que UserAuth esté correctamente importado desde tu contexto

  if (session) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Layouts
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Promociones from './pages/Promociones';
import Reportes from './pages/Reportes';
import GestionUsuarios from './pages/Usuarios';
import { AuthContextProvider, UserAuth } from './context/AuthContext';

function App() {
  const {} = UserAuth(); // Asegúrate de que UserAuth esté correctamente importado desde tu contexto

  return (
      <BrowserRouter>
          <AuthContextProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="productos" element={<Productos />} />
                  <Route path="clientes" element={<Clientes />} />
                  <Route path="ventas" element={<Ventas />} />
                  <Route path="promociones" element={<Promociones />} />
                  <Route path="reportes" element={<Reportes />} />
                  <Route path="usuarios" element={<GestionUsuarios />} />
                  <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthContextProvider>
      </BrowserRouter>
  );
}

export default App;