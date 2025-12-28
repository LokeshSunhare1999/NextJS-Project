import React from 'react';

const ErrorField = ({ errorText, className }) => {
  return <span className={`text-xs font-[300] text-[#ED2F2F] ${className}`}>{errorText}</span>;
};

export default ErrorField;
