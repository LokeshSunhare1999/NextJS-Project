import React, { useState, useRef, lazy, Suspense, useEffect } from 'react';
import DetailsContainer from '../atom/tableComponents/DetailsContainer';
import {
  BUSINESS_VERIFICATION_HEADERS_TYPE_UPLOAD,
  BUSINESS_VERIFICATION_HEADERS_UPLOAD,
} from '../../constants/employer';

import styled from 'styled-components';
import DisplayTable from '../DisplayTable';
import ICONS from '../../assets/icons';
import useEmployerDetails from '../../hooks/employer/useEmployerDetails';

import { useNavigate } from 'react-router-dom';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';
import { salutationMap } from '../../constants/details';
const Wrapper = styled.div`
  font-family: 'Poppins';
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
  gap: 20px;
`;

const UpperBox = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const TableDiv = styled.div`
  position: relative;
`;

const UpperBoxHead = styled.div`
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const DEandRAProfile = ({
  currentIndex,
  setShowBusinessVerificationPage,
  setPageRoute,
  refetchEmployerData,
}) => {
  const isMounted = useRef(false);
  const { hasPermission } = usePermission();
  const [actionOpen, setActionOpen] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [showActionsPanel, setShowActionsPanel] = useState(true);

  const navigate = useNavigate();

  const { employeeBasicDetail, handleRowClick, businessVerificationRows } =
    useEmployerDetails({
      currentIndex,
      setShowBusinessVerificationPage,
      setPageRoute,
      hasPermission,
    });
  salutationMap;

  let fullName = '';

  if (
    employeeBasicDetail?.firstName &&
    employeeBasicDetail.firstName !== '-----'
  ) {
    fullName += employeeBasicDetail.firstName;
  }

  if (
    employeeBasicDetail?.lastName &&
    employeeBasicDetail.lastName !== '-----'
  ) {
    fullName += (fullName ? ' ' : '') + employeeBasicDetail.lastName;
  }

  if (fullName.trim()) {
    fullName =
      `${salutationMap[employeeBasicDetail?.nameTitle] || ''} ${fullName}`.trim();
  }

  const transformedDetails = {
    companyName: employeeBasicDetail?.companyName || '-----',
    registrationType: employeeBasicDetail?.companyType || '-----',
    website: employeeBasicDetail?.companyWebsiteUrl || '-----',
    signupPhoneNo: employeeBasicDetail['Phone No.'] || '-----',
    recruiterName: fullName || '-----',
    brandName: employeeBasicDetail?.brandName || '-----',
    emailID: employeeBasicDetail?.emailId || '-----',
    communicationPhoneNo: employeeBasicDetail?.communicationPhoneNo || '-----',
    workEmail: employeeBasicDetail?.workEmail || '-----',
    companySize: employeeBasicDetail?.companySize || '-----',
    businessCategory: employeeBasicDetail?.businessCategory || '-----',
    createdOn: employeeBasicDetail?.createdOn || '-----',
    address: employeeBasicDetail?.address || '-----',
    autoshortlistEnabled: !!employeeBasicDetail?.isAutoShortList ? 'Yes' : 'No',
  };

  const arrBtn = [
    {
      text: 'View',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      // onClick: handleDeleteBtn,
      permission: EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
    },
  ];

  function handleEditDetails() {
    navigate(`/employers/add-employer?id=${currentIndex?._id}`);
  }

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (arrBtn.length > 0) {
      const hasAnyPermission = arrBtn.some((btn) =>
        hasPermission(btn.permission),
      );
      setShowActionsPanel(hasAnyPermission);
    }
  }, [arrBtn, hasPermission]);

  return (
    <Wrapper>
      <DetailsContainer
        title={'Basic Details'}
        detailsData={transformedDetails}
        showEdit={hasPermission(
          EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
        )}
        handleEditClick={handleEditDetails}
      />
      <UpperBox>
        <UpperBoxHead>Business Details</UpperBoxHead>

        <TableDiv>
          <DisplayTable
            tableId={'businessVerification'}
            tableWidth="100%"
            rows={businessVerificationRows}
            headers={BUSINESS_VERIFICATION_HEADERS_UPLOAD}
            headersType={BUSINESS_VERIFICATION_HEADERS_TYPE_UPLOAD}
            showActionsPanel={showActionsPanel}
            onClickFn={handleRowClick}
            arrBtn={arrBtn}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            actionOpen={actionOpen}
            setActionOpen={setActionOpen}
            // toolTipArray={createTooltipArray(verificationData)}
            tooltipIcon={ICONS?.INFO_TOOLTIP}
            highlightRow={true}
            arrBtnRight={'80px'}
          />
        </TableDiv>
      </UpperBox>
    </Wrapper>
  );
};

export default DEandRAProfile;
