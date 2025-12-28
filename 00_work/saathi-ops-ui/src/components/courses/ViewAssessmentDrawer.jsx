import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import { isEmpty, upperSnakeToKebabCase } from '../../utils/helper';
import AudioPlayer from '../common/AudioPlayer';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues?.ADD_ASSESSMENT_DRAWER} !important;
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

const ContentContainer = styled.div`
  width: 100%;
  border-bottom: ${(props) => props?.$borderBottom};
`;

const ContentSection = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 16px 20px;
`;

const StyledHeader = styled.p`
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => props?.$width};
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: 10px;
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const ImagePlaceholder = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 10px;
  background: #cdd4df;
  margin: ${(props) => props?.$margin};
  border: ${(props) => props?.$border};
`;

const OptionGrid = styled.div`
  width: auto;
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
`;

const ViewAssessmentDrawer = ({
  open,
  toggleDrawer,
  assessmentObj,
  courseData,
}) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [audioFile, setAudioFile] = useState('');

  const handleOpenAudioPlayer = (audio) => {
    setShowPlayer(true);
    setAudioFile(audio);
  };

  const handleCloseAudioPlayer = () => {
    setShowPlayer(false);
    setAudioFile('');
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setShowPlayer(false);
  };

  const convertToObj = (item) => {
    const subModuleList = courseData?.modules?.flatMap(
      (module) => module?.subModules,
    );
    const displayObj = subModuleList?.reduce((acc, item) => {
      acc[item?._id] = item?.subModuleTitle;
      return acc;
    }, {});
    return displayObj[item];
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
            <StyledHeader
              $fontSize={'24px'}
              $lineHeight={'36px'}
              $fontWeight={'600'}
              $color={'#000'}
            >
              Sub Module Assessment
            </StyledHeader>
            <StyledImg
              src={ICONS.CROSS_ICON}
              width={'22px'}
              height={'auto'}
              alt={'close-drawer'}
              onClick={handleCloseDrawer}
            />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer $borderBottom={'1px solid #cdd4df'}>
          <ContentSection>
            <StyledHeader
              $fontSize={'22px'}
              $lineHeight={'32px'}
              $fontWeight={'600'}
              $color={'#000'}
            >
              {assessmentObj?.assessmentTitle}
            </StyledHeader>
            <StyledHeader
              $fontSize={'16px'}
              $lineHeight={'24px'}
              $fontWeight={'400'}
              $color={'#000'}
              $margin={'0 0 10px 0'}
            >
              {upperSnakeToKebabCase(assessmentObj?.assessmentType)}
            </StyledHeader>
            <StyledHeader
              $fontSize={'14px'}
              $lineHeight={'21px'}
              $fontWeight={'400'}
              $color={'#000'}
              $margin={'0 0 10px 0'}
            >
              Passing Percent: {assessmentObj?.passingPercent}
            </StyledHeader>
            <StyledHeader
              $fontSize={'14px'}
              $lineHeight={'21px'}
              $fontWeight={'400'}
              $color={'#585858'}
            >
              {assessmentObj?.assessmentDescription}
            </StyledHeader>
          </ContentSection>
        </ContentContainer>
        {!isEmpty(assessmentObj)
          ? assessmentObj?.questions.map((ques, index) => {
              return (
                <ContentContainer key={index}>
                  <ContentSection>
                    <StyledHeader
                      $fontSize={'18px'}
                      $lineHeight={'27px'}
                      $fontWeight={'400'}
                      $color={'#000'}
                      $width={'672px'}
                    >
                      Question {index + 1}. <br />
                      {ques?.questionText}
                      {ques?.questionAudio.length > 0 ? (
                        <StyledImg
                          src={ICONS?.SPEAKER}
                          alt={'speaker'}
                          width={'20px'}
                          height={'20px'}
                          onClick={() =>
                            handleOpenAudioPlayer(ques?.questionAudio)
                          }
                        />
                      ) : null}
                    </StyledHeader>
                    <StyledHeader
                      $fontSize={'14px'}
                      $lineHeight={'21px'}
                      $fontWeight={'400'}
                      $color={'#586276'}
                      $margin={'10px 0'}
                      $justifyContent={'flex-start'}
                    >
                      Q-Type: {ques?.questionType}
                    </StyledHeader>
                    {ques?.questionType === 'PSYCHOMETRIC' ? (
                      <StyledHeader
                        $fontSize={'14px'}
                        $lineHeight={'21px'}
                        $fontWeight={'400'}
                        $color={'#586276'}
                        $margin={'10px 0'}
                        $justifyContent={'flex-start'}
                      >
                        Trait: {ques?.psychometricTrait}
                      </StyledHeader>
                    ) : null}
                    {ques?.questionSubModuleId?.length > 0 ? (
                      <StyledHeader
                        $fontSize={'14px'}
                        $lineHeight={'21px'}
                        $fontWeight={'400'}
                        $color={'#586276'}
                        $margin={'10px 0'}
                        $justifyContent={'flex-start'}
                      >
                        Linked Sub-Module:{' '}
                        {convertToObj(ques?.questionSubModuleId)}
                      </StyledHeader>
                    ) : null}
                    {ques?.questionImage.length > 0 ? (
                      <ImagePlaceholder
                        src={ques?.questionImage}
                        alt={'ques-img'}
                        $margin={'20px 0'}
                      />
                    ) : null}
                    <StyledHeader
                      $fontSize={'18px'}
                      $lineHeight={'27px'}
                      $fontWeight={'400'}
                      $color={'#000'}
                      $margin={'10px 0 10px 0'}
                    >
                      Answer
                    </StyledHeader>
                    <OptionGrid>
                      {ques?.options?.map((ans, idx) => {
                        return (
                          <div key={idx}>
                            <StyledHeader
                              $fontSize={'14px'}
                              $lineHeight={'21px'}
                              $fontWeight={'400'}
                              $color={'#000'}
                            >
                              {ans?.option}
                            </StyledHeader>
                            {ans?.imageLink ? (
                              <ImagePlaceholder
                                src={ans?.imageLink}
                                alt={`ans-${idx + 1}`}
                                $margin={'10px 0'}
                                $border={
                                  ans?.isCorrect ? '2px solid #4BAE4F' : null
                                }
                              />
                            ) : null}
                            <StyledHeader
                              $fontSize={'12px'}
                              $lineHeight={'18px'}
                              $fontWeight={'400'}
                              $color={ans?.isCorrect ? '#4BAE4F' : '#586276'}
                              $justifyContent={'flex-start'}
                            >
                              Option {idx + 1}
                              {ans?.audioLink.length > 0 ? (
                                <StyledImg
                                  src={ICONS?.SPEAKER}
                                  alt={'speaker'}
                                  width={'12px'}
                                  height={'12px'}
                                  onClick={() =>
                                    handleOpenAudioPlayer(ans?.audioLink)
                                  }
                                />
                              ) : null}
                            </StyledHeader>
                          </div>
                        );
                      })}
                    </OptionGrid>
                  </ContentSection>
                </ContentContainer>
              );
            })
          : null}
        {showPlayer ? (
          <AudioPlayer
            src={audioFile}
            closeAudioPlayer={handleCloseAudioPlayer}
          />
        ) : null}
      </DrawerWrapper>
    </StyledDrawer>
  );
};

ViewAssessmentDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  assessmentObj: PropTypes.shape({
    assessmentTitle: PropTypes.string,
    assessmentType: PropTypes.string,
    assessmentDescription: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        questionText: PropTypes.string,
        questionAudio: PropTypes.string,
        questionImage: PropTypes.string,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            option: PropTypes.string,
            imageLink: PropTypes.string,
            audioLink: PropTypes.string,
            isCorrect: PropTypes.bool,
          }),
        ),
      }),
    ),
  }),
};

export default ViewAssessmentDrawer;
