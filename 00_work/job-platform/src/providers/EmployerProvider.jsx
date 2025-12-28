"use client";

import React, { createContext, useState } from "react";

// Create a context
export const EmployerContext = createContext();

// Create a provider component
export const EmployerProvider = ({ children }) => {
  const [employer, setEmployer] = useState({});

  return (
    <EmployerContext.Provider value={{ employer, setEmployer }}>
      {children}
    </EmployerContext.Provider>
  );
};
