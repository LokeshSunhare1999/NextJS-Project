import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ isAuthenticated = true, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};
ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  children: PropTypes.node,
};

export default ProtectedRoute;
