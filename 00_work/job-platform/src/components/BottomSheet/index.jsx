import React, { useEffect, useState } from "react";

const Bottomsheet = ({ isOpen, children, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="w-full flex justify-center">
      <div
        className={`fixed inset-0 z-[1] bg-black/50 bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? "block" : "hidden pointer-events-none "
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed max-w-full w-full bottom-0 z-10 transition-transform duration-500 linear transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } block`}
      >
        <div className="h-full overflow-y-auto container-gradient rounded-tl-3xl rounded-tr-3xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Bottomsheet;
