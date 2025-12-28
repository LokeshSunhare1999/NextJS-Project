import React from 'react';
import styled from 'styled-components';
import ImageContainer from '../common/ImageContainer';
import DetailsContainer from '../atom/tableComponents/DetailsContainer';
import { VERIFICATION_LINKS } from '../../constants/verification';
import { convertToKebabCase } from '../../utils/helper';

const Wrapper = styled.div`
  background-color: #ffffff;
  width: 100%;
  font-family: Poppins;
  padding: 8px 20px;
  margin-top: 20px;
`;
const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const BusinessVerificationPageResults = ({
  businessVerificationData,
  pageRoute,
}) => {
  const keysToPick = ['imgUrls'];
  const keysToDelete = [
    'imgUrls',
    'possibleStates',
    'showNotificationButton',
    'verificationStatus',
  ];
  const detailsData = { ...businessVerificationData };

  let imageDetails = keysToPick.reduce((arr, key) => {
    if (key in detailsData) {
      arr.push(detailsData[key]);
    }
    return arr;
  }, []);
  imageDetails = imageDetails.flat();

  /* Delete useless keys from detailsData */
  keysToDelete.forEach((key) => delete detailsData[key]);

  return (
    <Wrapper>
      <P $fontSize={'14px'} $fontWeight={'600'} $lineHeight={'normal'}>
        Hyperverge Verification Results
      </P>
      <ImageContainer images={imageDetails} detailsData={detailsData} />
      <DetailsContainer
        customProps={{ textWidth: '240px' }}
        showTitle={false}
        detailsData={detailsData}
      />
    </Wrapper>
  );
};

export default BusinessVerificationPageResults;
