import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import CustomCTA from '../CustomCTA';
import { zIndexValues } from '../../style';
import { usePostEditPsychWeightage } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues.EDIT_MODULE_DRAWER} !important;
`;

const DrawerWrapper = styled.div`
  width: 836px;
  height: 100%;
  background: #f4f6fa;
  padding-top: 3.5rem;
  font-family: Poppins;
`;

const HeaderContainer = styled.section`
  height: 60px;
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

const Header = styled.p`
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
`;

const HeaderClose = styled.img`
  width: 22px;
  height: auto;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 0 20px;
`;

const ContentSection = styled.div`
  margin-bottom: 12px;
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const FieldHeader = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #000;
`;

const TitleInput = styled.input`
  width: 100px;
  height: 20px;
  border-radius: 8px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
`;

const FooterContainer = styled.div`
  width: 100%;
  margin-top: 40px;
  padding-bottom: 20px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const PsychAssessmentDrawer = ({ open, toggleDrawer, courseData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [psychAnalysisArray, setPsychAnalysisArray] = useState([]);
  const [isError, setIsError] = useState(false);

  const {
    mutate: editPsychWeightageMutation,
    status: editPsychWeightageStatus,
    isError: editPsychWeightageErr,
    error: editPsychWeightageError,
  } = usePostEditPsychWeightage();

  useEffect(() => {
    setPsychAnalysisArray(courseData?.psychometricTraitWeightage);
  }, [courseData]);

  useEffect(() => {
    if (editPsychWeightageStatus === 'success') {
      handleCloseDrawer();
      enqueueSnackbar('Psychometric Weightage Updated !', {
        variant: 'success',
      });
    } else if (editPsychWeightageStatus === 'error') {
      enqueueSnackbar(
        `Failed to edit psychometric weights.${editPsychWeightageError?.response?.data?.error?.message ? editPsychWeightageError?.response?.data?.error?.message : 'Something went wrong'}`,
        {
          variant: 'error',
        },
      );
    }
  }, [editPsychWeightageStatus]);

  const handlePsychAnalysisChange = (e, item, index) => {
    setIsError(false);
    const re = /^[0-9\b]+$/;
    const val = e.target.value;
    const updatedArray = [...psychAnalysisArray];
    if (val === '' || re.test(val)) {
      updatedArray[index].weightage = val === '' ? 0 : parseInt(val);
      setPsychAnalysisArray(updatedArray);
    }
  };

  const handleCloseDrawer = () => {
    setIsError(false);
    toggleDrawer(false);
  };

  const handleSaveClick = () => {
    const total = psychAnalysisArray.reduce(
      (total, item) => total + item.weightage,
      0,
    );
    if (total !== 100) {
      setIsError(true);
      return;
    } else {
      setIsError(false);
      editPsychWeightageMutation({
        courseId: courseData?._id,
        psychometricTraitWeightage: psychAnalysisArray,
      });
    }
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={handleCloseDrawer}>
      <DrawerWrapper>
        <HeaderContainer>
          <HeaderBox>
            <Header
              $fontSize={'24px'}
              $lineHeight={'36px'}
              $fontWeight={'600'}
              $color={'#000'}
            >
              Psychometric Assessment
            </Header>
            <HeaderClose src={ICONS.CROSS_ICON} onClick={handleCloseDrawer} />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer>
          <Header
            $fontSize={'14px'}
            $lineHeight={'21px'}
            $fontWeight={'400'}
            $color={'#585858'}
          >
            {`Add weightage for each field in percentage. Total should add up to 100.`}
          </Header>
        </ContentContainer>
        <ContentContainer>
          {psychAnalysisArray?.map((item, index) => {
            return (
              <ContentSection key={item?.trait}>
                <FieldHeader>
                  {item?.trait}
                  {` %`}
                </FieldHeader>
                <TitleInput
                  placeholder="Enter Weight"
                  type="text"
                  value={psychAnalysisArray?.[index]?.weightage}
                  onChange={(e) => handlePsychAnalysisChange(e, item, index)}
                />
              </ContentSection>
            );
          })}
          {isError ? (
            <ContentContainer>
              <Header
                $fontSize={'14px'}
                $lineHeight={'21px'}
                $fontWeight={'400'}
                $color={'red'}
              >
                {`* Total should add up to 100.`}
              </Header>
            </ContentContainer>
          ) : null}
          <FooterContainer>
            <CustomCTA
              onClick={handleCloseDrawer}
              title={'Cancel'}
              color={'#586275'}
              bgColor={'#FFF'}
              border={'1px solid #CDD4DF'}
            />
            <CustomCTA
              onClick={handleSaveClick}
              title={'Save'}
              isLoading={editPsychWeightageStatus === 'pending'}
              color={'#FFF'}
              bgColor={'#141482'}
              border={'1px solid #CDD4DF'}
            />
          </FooterContainer>
        </ContentContainer>
      </DrawerWrapper>
    </StyledDrawer>
  );
};

PsychAssessmentDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  courseData: PropTypes.shape({
    _id: PropTypes.string,
    psychometricTraitWeightage: PropTypes.arrayOf(
      PropTypes.shape({
        trait: PropTypes.string,
        weightage: PropTypes.number,
      }),
    ),
  }),
};

export default PsychAssessmentDrawer;
