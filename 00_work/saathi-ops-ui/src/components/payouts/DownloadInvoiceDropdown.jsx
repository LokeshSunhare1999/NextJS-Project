import React, { useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import PDFViewer from '../PDFViewer';

const Wrapper = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ViewLeft = styled.p`
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
`;
const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
const ViewRight = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  padding: 0px 20px;
  cursor: pointer;
  border-radius: ${(props) => (props.actionOpen ? '8px 8px 0 0' : '8px')};
`;

const PDFContainer = styled.div`
  top: 70px;
  height: 395px;
  background: #ffffff;
  border-radius: 0 0 8px 8px;
  overflow: auto;
  padding: 30px
`;

const Header = ({invoiceUrl}) => {
  const [actionOpen, setActionOpen] = useState(false);

  const handleActionClick = () => {
    setActionOpen(!actionOpen);
  };

  return (
    <Wrapper>
      <ViewRight actionOpen={actionOpen} onClick={() => handleActionClick()}>
        <ViewLeft>
          View Invoice
        </ViewLeft>
        <Img
          src={actionOpen ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}
          alt="arrowDown"
          width="14px"
          height="14px"
        />
      </ViewRight>
      {actionOpen ? (
        <PDFContainer>
          <PDFViewer pdfUrl={invoiceUrl} />
        </PDFContainer>
      ) : null}
    </Wrapper >
  );
};

export default Header;
