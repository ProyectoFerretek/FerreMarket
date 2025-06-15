import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';

const ProtectedRoute = ({ component, ...args }) => {
  const Component = withAuthenticationRequired(component, args);
  return <Component />;
};

const Auth0ProviderWithRedirectCallback = ({ children, ...props }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };
  return (
    <Auth0Provider onRedirectCallback={onRedirectCallback} {...props}>
      {children}
    </Auth0Provider>
  );
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

function App() {
  return (
    <BrowserRouter>
      <Auth0ProviderWithRedirectCallback
          domain={import.meta.env.VITE_AUTH0_DOMAIN_NAME}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute component={Layout} />}>
          <Route index element={<ProtectedRoute component={Dashboard} />} />
          <Route path="productos" element={<ProtectedRoute component={Productos} />} />
          <Route path="clientes" element={<ProtectedRoute component={Clientes} />} />
          <Route path="ventas" element={<ProtectedRoute component={Ventas} />} />
          <Route path="promociones" element={<ProtectedRoute component={Promociones} />} />
          <Route path="reportes" element={<ProtectedRoute component={Reportes} />} />
          <Route path="usuarios" element={<ProtectedRoute component={GestionUsuarios} />} />
          <Route path="*" element={<ProtectedRoute component={NotFound} />} />
        </Route>
      </Routes>
      </Auth0ProviderWithRedirectCallback>
    </BrowserRouter>
  );
}

export default App;