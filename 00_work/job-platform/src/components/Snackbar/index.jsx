"use client";
import { SnackbarProvider } from "notistack";
const SnackbarWrapper = ({ children, ...props }) => {
  return <SnackbarProvider {...props}>{children}</SnackbarProvider>;
};

export default SnackbarWrapper;
