import React from 'react';
import { zIndexValues } from '../../style';
import userTabStyles from '../../style/usersTabStyle';
import DisplayDrawer from '../common/DisplayDrawer';
import CustomCTA from '../CustomCTA';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import PDFViewer from '../PDFViewer';

const { StyledHeader } = userTabStyles();
const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: 8px;
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
  margin-left: ${(props) => (props.$marginLeft ? props.$marginLeft : '0px')};

  margin-right: ${(props) => (props.$marginRight ? props.$marginRight : '0px')};
  margin-bottom: ${(props) =>
    props.$marginBottom ? props.$marginBottom : '0px'};
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  color: ${(props) => (props.color ? props.color : '#000000')};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const AgreementDrawer = ({ open, handleCloseDrawer, url }) => {
  const headerContent = (url) => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        <FlexContainer
          $justifyContent="space-between"
          $alignItems="center"
          $marginBottom="8px"
          $marginTop="10px"
        >
          Agreement
          <div style={{ marginRight: '16px' }}>
            <CustomCTA
              showIcon
              url={ICONS?.DOWNLOAD}
              onClick={() => window.open(url, '_blank')}
              title={'Download'}
              color={'#3B2B8C'}
              bgColor={'#FFF'}
              border={'1px solid #3B2B8C'}
            />
          </div>
        </FlexContainer>
      </StyledHeader>
    );
  };

  return (
    <DisplayDrawer
      open={open}
      handleCloseDrawer={handleCloseDrawer}
      headerContent={() => headerContent(url)}
      zIndex={zIndexValues?.CUSTOMER_FILTER_DRAWER}
      showCancelCta={false}
      showFooter={false}
    >
      <div
        style={{
          margin: '20px',
          padding: '18px 20px',
          borderRadius: '10px',
          background: 'white',
          height: '77vh',
          overflowY: 'auto',
        }}
      >
        <P $fontSize={'16px'} $fontWeight={'600'} $lineHeight={'normal'}>
          Agreement Preview
        </P>
        <div style={{ marginTop: '16px' }}>
          <PDFViewer pdfUrl={url} />
        </div>
      </div>
    </DisplayDrawer>
  );
};

export default AgreementDrawer;
