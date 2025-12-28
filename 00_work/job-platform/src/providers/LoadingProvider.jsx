"use client";

import { Spin } from "antd";
import { createContext, useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  useEffect(() => {
    hideLoading();
  }, [pathname]);
  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[10000] bg-white flex h-screen w-full items-center justify-center overflow-hidden">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      )}
    </LoadingContext.Provider>
  );
};
