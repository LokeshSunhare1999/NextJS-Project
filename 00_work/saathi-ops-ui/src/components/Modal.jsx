import React from 'react';
import './../App.css';
import styled from 'styled-components';
import { zIndexValues } from '../style';
import PropTypes from 'prop-types';

const Overlay = styled.section`
  position: fixed;
  top: 0px;
  right: 0;
  height: calc(100vh);
  width: calc(100vw);
  z-index: ${zIndexValues.MODAL};
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: ${(props) => props.$width};
  height: auto;
  background-color: #fff;
  border-radius: 16px;
`;

const Modal = ({ isOpen, setIsOpen, width = '50vw', children }) => {
  const handleOutsideClick = () => {
    setIsOpen(false);
  };

  const handleInsideClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleOutsideClick}>
      <Container $width={width} onClick={handleInsideClick}>
        {children}
      </Container>
    </Overlay>
  );
};
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
