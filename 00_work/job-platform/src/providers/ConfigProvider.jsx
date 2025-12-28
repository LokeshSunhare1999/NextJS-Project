"use client";

import { ConfigProvider } from "antd";

const AntdConfigProvider = ({ children, themes }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: themes.fontFamily,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
