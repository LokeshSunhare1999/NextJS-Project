import React from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';
import DocumentStatus from './DocumentStatus';
import DisplayTable from '../DisplayTable';
import CustomCTA from '../CustomCTA';
import useCustomerTestProgress from '../../hooks/customer/useCustomerTestProgress';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues?.VIEW_CUSTOMER_COURSE_DRAWER} !important;
`;

const DrawerWrapper = styled.div`
  width: 836px;
  min-height: 100%;
  height: auto;
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

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 15px;
`;

const ContentContainer = styled.div`
  width: 100%;
  border-bottom: ${(props) => props?.$borderBottom};
`;

const ContentSection = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 16px 20px;
`;

const StyledDiv = styled.div`
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => (props?.$width ? props?.$width : 'auto')};
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => (props.$gap ? props.$gap : '10px')};
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const ViewCustomerTestDrawer = ({ open, toggleDrawer, courseObj }) => {
  const {
    progressHeaderKeys,
    progressHeaders,
    progressHeaderTypes,
    progressRows,
    certificateLink,
    medalLink,
    rewardObj,
    handleCertificateClick,
    handleMedalClick,
  } = useCustomerTestProgress(courseObj);
  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };

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
    >
      <DrawerWrapper>
        <HeaderContainer>
          <HeaderBox>
            <HeaderText>
              <HeaderTitle>
                <StyledDiv
                  $fontSize={'24px'}
                  $lineHeight={'36px'}
                  $fontWeight={'600'}
                  $color={'#000'}
                  $justifyContent={'flex-start'}
                  $gap={'20px'}
                >
                  Test Progress
                </StyledDiv>
                <StyledDiv
                  $fontSize={'14px'}
                  $lineHeight={'21px'}
                  $fontWeight={'400'}
                  $color={'#000'}
                >
                  {courseObj?.trainingTitle}
                </StyledDiv>
              </HeaderTitle>
              <StyledDiv $margin={'5px 0 0 0'}>
                <DocumentStatus status={courseObj?.trainingProgressStatus} />
              </StyledDiv>
            </HeaderText>
            <StyledImg
              src={ICONS.CROSS_ICON}
              width={'22px'}
              height={'auto'}
              alt={'close-drawer'}
              onClick={handleCloseDrawer}
            />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer>
          <ContentSection>
            <StyledDiv
              $fontSize={'16px'}
              $lineHeight={'24px'}
              $fontWeight={'600'}
              $color={'#000'}
              $margin={'0 0 8px 0'}
              $justifyContent={'flex-start'}
            >
              Correct Answers :
              <StyledDiv
                $fontSize={'17px'}
                $lineHeight={'25.5px'}
                $fontWeight={'400'}
                $color={'#000'}
              >
                {courseObj?.correctAnswers}/{courseObj?.totalQuestions}
              </StyledDiv>
              {courseObj?.resultStatus !== 'NONE' ? (
                <DocumentStatus status={courseObj?.resultStatus} />
              ) : null}
            </StyledDiv>
          </ContentSection>
          <ContentSection>
            <StyledDiv
              $fontSize={'16px'}
              $lineHeight={'24px'}
              $fontWeight={'600'}
              $color={'#000'}
              $margin={'0 0 8px 0'}
            >
              Rewards
            </StyledDiv>
            <StyledDiv $justifyContent={'space-between'} $gap={'20px'}>
              <StyledDiv>
                {rewardObj?.map((reward, idx) => {
                  return (
                    <StyledDiv
                      key={idx}
                      $justifyContent={'flex-start'}
                      $gap={'5px'}
                      $fontSize={'14px'}
                      $lineHeight={'21px'}
                      $fontWeight={'400'}
                    >
                      {reward?.count} {reward?.title}{' '}
                      <StyledImg src={reward?.icon}></StyledImg>
                    </StyledDiv>
                  );
                })}
              </StyledDiv>
              <StyledDiv>
                <CustomCTA
                  onClick={handleMedalClick}
                  title={'Medal'}
                  color={'#141482'}
                  bgColor={'#FFF'}
                  border={'1px solid #141482'}
                  opacity={medalLink?.length > 0 ? 1 : 0.5}
                  disabled={medalLink?.length === 0}
                />
                <CustomCTA
                  onClick={handleCertificateClick}
                  title={'Certificate'}
                  color={'#141482'}
                  bgColor={'#FFF'}
                  border={'1px solid #141482'}
                  opacity={certificateLink?.length > 0 ? 1 : 0.5}
                  disabled={certificateLink?.length === 0}
                />
              </StyledDiv>
            </StyledDiv>
          </ContentSection>
          <ContentSection>
            <StyledDiv
              $fontSize={'16px'}
              $lineHeight={'24px'}
              $fontWeight={'600'}
              $color={'#000'}
              $margin={'0 0 8px 0'}
            >
              Test Details
            </StyledDiv>
            <DisplayTable
              tableId={'testProgressTable'}
              rows={progressRows}
              headers={progressHeaders}
              headerKeys={progressHeaderKeys}
              headersType={progressHeaderTypes}
              tableWidth={'98%'}
            />
          </ContentSection>
        </ContentContainer>
      </DrawerWrapper>
    </StyledDrawer>
  );
};

ViewCustomerTestDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  courseObj: PropTypes.object.isRequired,
};

export default ViewCustomerTestDrawer;
