"use client";
import React, { createContext, useState } from "react";
import CrossIcon from "@/assets/icons/common/crossIcon.svg";
import { ClickAwayListener } from "@mui/material";
import Svg from "@/components/Svg";

export const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalWidth, setModalWidth] = useState(null);
  const [showCloseIcon, setShowCloseIcon] = useState(true);

  const handleDisplayModal = (modal, customData = {}) => {
    setActiveModal(modal);
    setShowModal(true);

    if (customData?.modalWidth) setModalWidth(customData.modalWidth);
    setShowCloseIcon(
      customData?.showCloseIcon !== undefined ? customData.showCloseIcon : true
    );

    document.body.style.overflow = customData?.bodyOverflow
      ? customData?.bodyOverflow
      : "hidden";
  };

  const handleUpdateModal = (modal) => {
    setActiveModal(modal);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setModalWidth(null);
    setShowModal(false);
    setActiveModal(null);
    document.body.style.overflow = "auto";
  };

  return (
    <ModalContext.Provider
      value={{
        displayModal: handleDisplayModal,
        toggleModal,
        closeModal: handleCloseModal,
        updateModal: handleUpdateModal,
      }}
    >
      {children}
      {showModal && activeModal ? (
        <div className="fixed inset-0 z-[100] bg-[#606060d6] flex justify-center items-center overflow-y-auto">
          <ClickAwayListener onClickAway={handleCloseModal}>
            <div
              className={`relative md:m-2 bg-white border border-[#CDD4DF] md:rounded-lg w-full max-h-screen md:max-h-[95vh] overflow-y-auto ${
                modalWidth ? "" : "max-w-[500px]"
              }`}
              style={modalWidth ? { maxWidth: modalWidth } : {}}
            >
              {showCloseIcon && (
                <div className="absolute top-[10px] right-[10px] w-[20px] h-[20px] cursor-pointer z-[101]">
                  <Svg
                    icon={<CrossIcon />}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    onClick={handleCloseModal}
                  />
                </div>
              )}
              {activeModal}
            </div>
          </ClickAwayListener>
        </div>
      ) : null}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
