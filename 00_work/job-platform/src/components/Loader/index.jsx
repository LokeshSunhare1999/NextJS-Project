import React from "react";

const Loader = () => {
  return (
    <div className="flex h-[200px] w-full flex-col items-center justify-center gap-5">
      <div className="w-12 h-12 border-4 border-transparent border-t-[#1777ff] rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
