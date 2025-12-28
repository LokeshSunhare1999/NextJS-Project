import React, { useEffect, useState } from 'react';
import DisplayDrawer from '../common/DisplayDrawer';
import { zIndexValues } from '../../style';
import CustomCTA from '../CustomCTA';
import detailsPageStyle from '../../style/detailsPageStyle';
import TestQuestionsBlock from './TestQuestionsBlock';

const { StyledSpan, ContentSection, StyledDiv } = detailsPageStyle();

const EditAssessmentsDrawer = ({
  open,
  toggleDrawer,
  assessmentObj,
  handleUpdateAssessment,
  updateAssessmentStatus,
}) => {
  const [quesArray, setQuesArray] = useState([]);

  useEffect(() => {
    setQuesArray(assessmentObj?.questions);
  }, [assessmentObj]);

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };

  const handleSaveClick = () => {
    handleUpdateAssessment({ ...assessmentObj, questions: quesArray });
  };

  const headerContent = () => {
    return (
      <StyledSpan
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        Edit Assessment
      </StyledSpan>
    );
  };

  const footerContent = () => {
    return (
      <CustomCTA
        onClick={handleSaveClick}
        title={'Save'}
        isLoading={updateAssessmentStatus === 'pending'}
        color={'#FFF'}
        bgColor={'#141482'}
        border={'1px solid #CDD4DF'}
      />
    );
  };
  return (
    <DisplayDrawer
      open={open}
      handleCloseDrawer={handleCloseDrawer}
      zIndex={zIndexValues.ADD_COURSE_DRAWER}
      headerContent={headerContent}
      footerContent={footerContent}
    >
      <ContentSection>
        <StyledSpan
          $fontSize={'22px'}
          $lineHeight={'32px'}
          $fontWeight={'600'}
          $color={'#000'}
        >
          {assessmentObj?.assessmentName}
        </StyledSpan>
      </ContentSection>
      <ContentSection>
        <StyledSpan
          $fontSize={'14px'}
          $lineHeight={'21px'}
          $fontWeight={'400'}
          $color={'#585858'}
        >
          {assessmentObj?.assessmentDescription}
        </StyledSpan>
      </ContentSection>
      <StyledDiv $height={'1px'} $background={'#CDD4DF'} />
      {quesArray?.map((question, quesIdx) => {
        return (
          <TestQuestionsBlock
            key={question?._id}
            question={question}
            quesIdx={quesIdx}
            assessmentId={assessmentObj?._id}
            quesArray={quesArray}
            setQuesArray={setQuesArray}
          />
        );
      })}
    </DisplayDrawer>
  );
};

export default EditAssessmentsDrawer;
