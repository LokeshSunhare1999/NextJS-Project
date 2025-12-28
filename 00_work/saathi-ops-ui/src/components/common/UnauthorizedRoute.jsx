import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const UnauthorizedRoute = ({ isAuthorized, children }) => {
  if (!isAuthorized) return <Navigate to="/unauthorized" replace />;

  return children;
};
UnauthorizedRoute.propTypes = {
  isAuthorized: PropTypes.bool,
  children: PropTypes.node,
};

export default UnauthorizedRoute;
