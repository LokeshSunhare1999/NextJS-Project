import React, { useEffect, useState } from 'react';
import useParseBusinessVerificationData from '../../hooks/employer/useParseBusinessVerification';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import Remarks from '../common/Remarks';
import { CUSTOMER_DETAILS_PERMISSIONS } from '../../constants/permissions';
import styleComponents from '../../style/pageStyle';
import BusinessVerificationPageHeader from './BusinessVerificationPageHeader';
import BusinessVerificationPageResults from './BusinessVerificationPageResults';
import { useSnackbar } from 'notistack';
import { useEmployerDocPostRemarks } from '../../apis/queryHooks';
import { useParams } from 'react-router-dom';
import { EMPLOYER_BUSINESS_VERIFICATION_WORKFLOW } from '../../constants/employer';
import { STATUS_KEYS } from '../../constants';
import usePermission from '../../hooks/usePermission';

const { Top } = styleComponents();

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
`;

const WhiteBox = styled.div`
  display: inline-flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: ${(props) => (props.$alignItems ? props.$alignItems : 'center')};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  height: calc(100vh - 3.2rem);
`;

const BusinessVerificationPage = ({
  employerData,
  refetchEmployerData,
  pageRoute,
  setPageRoute,
  setShowBusinessVerificationPage,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();
  const { id: staffingAgencyId } = useParams();
  const { pageData, remarks = [] } = useParseBusinessVerificationData(
    employerData,
    pageRoute,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    mutateAsync: employerDocPostRemarks,
    status: employerDocPostRemarksStatus,
    isError: isEmployerDocPostRemarksError,
    error: employerDocPostRemarksError,
  } = useEmployerDocPostRemarks();

  useEffect(() => {
    if (employerDocPostRemarksError?.message)
      enqueueSnackbar(
        `Failed to fetch details. error : ${employerDocPostRemarksError?.message}`,
        {
          variant: 'error',
        },
      );
  }, [employerDocPostRemarksError?.message]);

  const handleLeftArrow = () => {
    setShowBusinessVerificationPage(false);
    setPageRoute('');
  };

  const handlePostRemarks = async ({ message }) => {
    await employerDocPostRemarks({
      staffingAgencyId,
      remarks: {
        message,
        remarkType:
          EMPLOYER_BUSINESS_VERIFICATION_WORKFLOW[pageRoute]?.WORKFLOW,
      },
    });

    refetchEmployerData();
  };
  return (
    <Wrapper>
      <Top>
        <Header>
          <WhiteBox onClick={() => handleLeftArrow()}>
            <Img
              src={ICONS.LEFT_ARROW_BLACK}
              alt="leftArrowBlack"
              width={'24px'}
              height={'24px'}
            />
          </WhiteBox>
        </Header>
        <BusinessVerificationPageHeader
          pageRoute={pageRoute}
          employerId={staffingAgencyId}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          verificationStatus={pageData?.verificationStatus}
          possibleStates={pageData?.possibleStates || []}
          refetchEmployerData={refetchEmployerData}
          // showNotificationButton={pageData?.showNotificationButton && false}
        />

        <BusinessVerificationPageResults
          businessVerificationData={pageData}
          pageRoute={pageRoute}
        />
        {pageData?.verificationStatus !== STATUS_KEYS?.NOT_INITIATED &&
          hasPermission(
            CUSTOMER_DETAILS_PERMISSIONS?.EDIT_VERIFICATION_DETAILS,
          ) ? (
          <Remarks
            onSubmit={handlePostRemarks}
            postRemarksError={employerDocPostRemarksError}
            remarks={remarks}
            isError={isEmployerDocPostRemarksError}
            permission={CUSTOMER_DETAILS_PERMISSIONS?.ADD_VERIFICATION_REMARKS}
          />
        ) : null}
      </Top>
    </Wrapper>
  );
};

export default BusinessVerificationPage;
