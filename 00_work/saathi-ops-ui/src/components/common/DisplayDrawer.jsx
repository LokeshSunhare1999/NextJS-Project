import React from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import CustomCTA from '../CustomCTA';
import PropTypes from 'prop-types';

const StyledDrawer = styled(Drawer)`
  z-index: ${(props) => props?.$zIndex ?? 10} !important;
`;

const DrawerWrapper = styled.div`
  width: ${(props) => props.$width ?? '836px'};
  height: 100vw;
  background: #f4f6fa;
  padding-top: 3.5rem;
  font-family: Poppins;
  position: relative;
`;

const HeaderContainer = styled.section`
  height: auto;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #cdd4df;
`;

const HeaderBox = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  width: 100%;
  border-bottom: ${(props) => props?.$borderBottom};
`;

const FooterContainer = styled.div`
  width: calc(100% - 40px);
  margin: 40px 20px 0 20px;
  padding-bottom: 20px;
  height: 40px;
  display: flex;
  justify-content: space-between;
`;

const FooterDiv = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => props.$justifyContent ?? 'flex-end'};
  gap: ${(props) => props.$gap ?? '20px'};
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const DisplayDrawer = ({
  open,
  handleCloseDrawer,
  headerContent,
  footerContent,
  extraFooterContent = () => {},
  zIndex,
  showFooter = true,
  width = '836px',
  children,
  showCancelCta = true,
}) => {
  return (
    <StyledDrawer
      PaperProps={{
        sx: {
          backgroundColor: '#f4f6fa',
        },
      }}
      anchor="right"
      open={open}
      onClose={handleCloseDrawer}
      $zIndex={zIndex}
      disableEnforceFocus
    >
      <DrawerWrapper $width={width}>
        <HeaderContainer>
          <HeaderBox>
            {headerContent ? headerContent() : null}
            <StyledImg
              src={ICONS.CROSS_ICON}
              width={'22px'}
              height={'auto'}
              alt={'close-drawer'}
              onClick={handleCloseDrawer}
            />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer>{children}</ContentContainer>
        {showFooter ? (
          <FooterContainer>
            <FooterDiv $justifyContent={'flex-start'}>
              {extraFooterContent()}
            </FooterDiv>
            <FooterDiv>
              {showCancelCta ? (
                <CustomCTA
                  onClick={handleCloseDrawer}
                  title={'Cancel'}
                  color={'#586275'}
                  bgColor={'#FFF'}
                  border={'1px solid #CDD4DF'}
                />
              ) : null}
              {footerContent ? footerContent() : null}
            </FooterDiv>
          </FooterContainer>
        ) : null}
      </DrawerWrapper>
    </StyledDrawer>
  );
};

DisplayDrawer.propTypes = {
  open: PropTypes.bool,
  handleCloseDrawer: PropTypes.func,
  headerContent: PropTypes.func,
  footerContent: PropTypes.func,
  extraFooterContent: PropTypes.func,
  zIndex: PropTypes.number,
  children: PropTypes.node,
};

export default DisplayDrawer;
