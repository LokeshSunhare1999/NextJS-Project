import React, { createContext, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import { ClickAwayListener } from '@mui/material';

export const ModalContext = createContext();

const BaseModal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalContainer = styled.div`
  position: relative;
  background-color: #fff;
  max-width: ${(props) => (props?.$width ? props.$width : '500px')};
  width: 100%;
  border: 1px solid #cdd4df;
  border-radius: 8px;
  font-family: Poppins;
`;
const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
  z-index: 101;
`;

const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalWidth, setModalWidth] = useState(null);
  const [showCloseIcon, setShowCloseIcon] = useState(true);

  const handleDisplayModal = (modal, customData = {}) => {
    setActiveModal(modal);
    setShowModal(true);
    if (customData?.modalWidth) setModalWidth(customData.modalWidth);

    if (customData?.showCloseIcon !== undefined) {
      setShowCloseIcon(customData.showCloseIcon);
    } else {
      setShowCloseIcon(true);
    }
    document.body.style = 'overflow:hidden';
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
    document.body.style = 'overflow:auto';
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
        <BaseModal>
          <ClickAwayListener onClickAway={handleCloseModal}>
            <ModalContainer $width={modalWidth}>
              {showCloseIcon ? (
                <CloseButton onClick={() => handleCloseModal()}>
                  <StyledImg
                    src={ICONS?.CROSS_ICON}
                    width="20px"
                    height="20px"
                    alt={'close'}
                  />
                </CloseButton>
              ) : null}
              {activeModal}
            </ModalContainer>
          </ClickAwayListener>
        </BaseModal>
      ) : null}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
