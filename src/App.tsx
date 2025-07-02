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
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="productos" element={<ProtectedRoute><Productos /></ProtectedRoute>}/>
                      <Route path="clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
                      <Route path="ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
                      <Route path="promociones" element={<ProtectedRoute><Promociones /></ProtectedRoute>} />
                      <Route path="reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
                      <Route path="usuarios" element={<ProtectedRoute><GestionUsuarios /></ProtectedRoute>} />
                      <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
                  </Route>
              </Routes>
          </AuthContextProvider>
      </BrowserRouter>
  );
}

export default App;