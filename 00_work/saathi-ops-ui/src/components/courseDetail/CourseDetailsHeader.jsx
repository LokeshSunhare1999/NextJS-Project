import React from 'react';
import { styled } from 'styled-components';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: flex-start;
  margin-top: 20px;
`;

const P = styled.p`
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const ModuleDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
`;

const CourseDetailsHeader = ({ courseData, testDetailsData }) => {
  const location = useLocation();
  const courseInfo = [
    { label: 'Module', value: courseData?.modulesLength || 0 },
    { label: 'Sub Module', value: courseData?.subModulesLength || 0 },
    { label: 'Assessment', value: courseData?.assessmentsLength || 0 },
    {
      label: 'Video',
      value: courseData?.subModulesLength - courseData?.totalPendingVideos || 0,
    },
    { label: 'Thumbnail', value: courseData?.totalThumbnails || 0 },
  ];

  const testInfo = [
    {
      label: 'Assessment',
      value: testDetailsData?.totalAssessments || 0,
    },
    { label: 'Question', value: testDetailsData?.totalQuestions || 0 },
  ];

  const infoArray = location?.pathname?.includes('tests')
    ? testInfo
    : courseInfo;
  const infoHeading = location?.pathname?.includes('tests') ? 'Test' : 'Course';
  return (
    <Wrapper>
      <P
        $color="#000000"
        $fontSize={'22px'}
        $fontWeight={'600'}
        $lineHeight={'normal'}
      >
        {infoHeading} Details
      </P>
      <ModuleDiv>
        {infoArray?.map((info, idx) => (
          <P
            key={idx}
            $color="#000000"
            $fontSize="16px"
            $fontWeight="400"
            $lineHeight="normal"
          >
            {`${info?.value} ${info?.label}${info?.value === 1 ? '' : 's'}`}
          </P>
        ))}
      </ModuleDiv>
    </Wrapper>
  );
};

CourseDetailsHeader.propTypes = {
  courseData: PropTypes.shape({
    modulesLength: PropTypes.number,
    subModulesLength: PropTypes.number,
    assessmentsLength: PropTypes.number,
  }),
};

export default CourseDetailsHeader;
