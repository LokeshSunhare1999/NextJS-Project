import React, { useState, useRef, lazy, Suspense, useEffect } from 'react';
import DetailsContainer from '../atom/tableComponents/DetailsContainer';
import {
  AGREEMENT_HEADERS,
  AGREEMENT_HEADERS_TYPE,
  BANK_HEADERS,
  BANK_HEADERS_TYPE,
  BUSINESS_VERIFICATION_HEADERS,
  BUSINESS_VERIFICATION_HEADERS_TYPE,
  companyTypeMap,
} from '../../constants/employer';

import styled from 'styled-components';
import DisplayTable from '../DisplayTable';
import ICONS from '../../assets/icons';
import useEmployerDetails from '../../hooks/employer/useEmployerDetails';
import AgreementDrawer from './AgreementDrawer';
import { FILE_TYPES } from '../../constants';
import {
  usePostUploadToS3,
  usePutUpdateEmployerStatus,
  useUploadAndDeleteAgreement,
} from '../../apis/queryHooks';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';
import EditEmployerDetailsDrawer from './EditEmployerDetailsDrawer';
const GlobalPop = lazy(() => import('../../components/GlobalPop'));
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

const FlexContainer = styled.div`
  font-family: Poppins;
  width: ${(props) => (props.$width ? props.$width : '100@')};
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: 8px;
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const EmployerProfile = ({
  currentIndex,
  setShowBusinessVerificationPage,
  setPageRoute,
  refetchEmployerData,
}) => {
  const isMounted = useRef(false);
  const { hasPermission } = usePermission();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [actionOpen, setActionOpen] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [showActionsPanel, setShowActionsPanel] = useState(true);
  const [showAgreementActions, setShowAgreementActions] = useState(true);
  const [agreementActionOpen, setAgreementActionOpen] = useState(false);
  const [agreementActionIndex, setAgreementActionIndex] = useState('');
  const [openAgreementDrawer, setOpenAgreementDrawer] = useState(false);
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [openEditDetailsDrawer, setOpenEditDetailsDrawer] = useState(false);
  const [editAccObj, setEditAccObj] = useState({
    companyName: '',
    companySize: '',
    brandName: '',
    companyType: '',
  });
  const [editAccErr, setEditAccErr] = useState();
  const abortControllerRef = useRef(null);

  const {
    employeeBasicDetail,
    handleRowClick,
    businessVerificationRows,
    bankDetails,
    agreementDetails,
    agreementUrl,
  } = useEmployerDetails({
    currentIndex,
    setShowBusinessVerificationPage,
    setPageRoute,
    hasPermission,
  });

  const {
    mutateAsync: uploadAndDeleteAgreementMutation,
    status: uploadAndDeleteAgreementStatus,
    isError: isUploadAndDeleteAgreementErr,
    error: uploadAndDeleteAgreementErr,
  } = useUploadAndDeleteAgreement(id);

  const {
    mutateAsync: uploadToS3,
    status: uploadStatus,
    isError: isUploadError,
    error: uploadError,
    data: uploadData,
  } = usePostUploadToS3(
    `AGREEMENT_${currentIndex?._id}`,
    FILE_TYPES?.DOCUMENT?.toUpperCase(),
  );

  const {
    mutateAsync: updateEmployerStatusMutation,
    status: updateEmployerStatusStatus,
    isError: isUpdateEmployerStatusErr,
    error: updateEmployerStatusErr,
  } = usePutUpdateEmployerStatus(currentIndex?._id);

  useEffect(() => {
    if (
      uploadStatus === 'success' &&
      uploadAndDeleteAgreementStatus === 'success'
    ) {
      enqueueSnackbar('Agreement has been successfully uploaded.', {
        variant: 'success',
      });
    } else if (
      uploadStatus === 'error' ||
      uploadAndDeleteAgreementStatus === 'error'
    ) {
      enqueueSnackbar(`Failed to upload agreement. ${uploadError?.message}`, {
        variant: 'error',
      });
    }
  }, [uploadStatus, uploadAndDeleteAgreementStatus]);

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

  const handleOpenAgreementDrawer = () => {
    setAgreementActionIndex('');
    setOpenAgreementDrawer(true);
  };

  const handleDelete = () => {
    setOpenDeletePop(false);
    uploadAndDeleteAgreementMutation({
      id: id,
      agreementDetails: {
        url: '',
      },
    }).then(() => refetchEmployerData());
  };

  const handleDeleteClick = () => {
    setAgreementActionIndex('');
    setOpenDeletePop(true);
  };

  const handleDeleteBtn = (e) => {
    e.stopPropagation();
    // setActionOpen(false);
    handleDeleteClick(actionIndex);
  };

  const handleUploadAgreement = (uploadedFile) => {
    setAgreementActionIndex('');
    const formData = new FormData();
    formData.append('file', uploadedFile);
    abortControllerRef.current = new AbortController();

    uploadToS3({
      payload: formData,
      signal: abortControllerRef.current.signal,
    }).then((response) => {
      uploadAndDeleteAgreementMutation({
        id: id,
        agreementDetails: {
          url: response?.fileLink,
        },
      }).then(() => refetchEmployerData());
    });
  };
  const toggleEditDetailsDrawer = (isOpen) => {
    setOpenEditDetailsDrawer(isOpen);
  };

  const handleUpdateEmployerDetails = (potentialEarnings) => {
    const companyType = companyTypeMap[editAccObj.companyType];
    const payload = {
      brandName: editAccObj?.brandName,
      companyRegisteredName: editAccObj?.companyName,
      companySize: editAccObj?.companySize,
      companyType: companyType,
      potentialEarnings: potentialEarnings,
    };
    updateEmployerStatusMutation(payload)
      .then(() => {
        enqueueSnackbar('Employer details updated successfully.', {
          variant: 'success',
        });
        refetchEmployerData();
      })
      .catch(() => {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      })
      .finally(() => {
        setOpenEditDetailsDrawer(false);
        setEditAccObj({
          companyName: '',
          companySize: '',
          brandName: '',
          companyType: '',
        });
        setEditAccErr();
      });
  };

  const arrBtnAgreement = [
    {
      text: 'Upload Agreement',
      icon: ICONS.UPLOAD_GRAY,
      active: true,
      isVisible:
        agreementDetails?.[0]?.[0] !== 'VERIFIED' && !agreementUrl
          ? true
          : false,
      color: '#000',
      type: 'input',
      // onClick: handleUploadAgreement,
      handleFileUpload: (e) => handleUploadAgreement(e, FILE_TYPES?.DOCUMENT),
      permission: EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
    },
    {
      text: 'View Agreement',
      icon: ICONS.EYE,
      active: true,
      isVisible: agreementUrl ? true : false,
      color: '#000',
      onClick: handleOpenAgreementDrawer,
    },
    {
      text: 'Delete',
      icon: ICONS.DELETE_ICON,
      active: true,
      isVisible: agreementUrl ? true : false,
      color: '#DD4141',
      onClick: handleDeleteClick,
      permission: EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
    },
  ];

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

    if (arrBtnAgreement.length > 0) {
      const hasAnyPermission = arrBtnAgreement.some((btn) =>
        hasPermission(btn.permission),
      );
      setShowAgreementActions(hasAnyPermission);
    }
  }, [arrBtn, arrBtnAgreement, hasPermission]);

  return (
    <Wrapper>
      <DetailsContainer
        title={'Basic Details'}
        detailsData={employeeBasicDetail}
        showEdit={hasPermission(
          EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
        )}
        handleEditClick={() => toggleEditDetailsDrawer(true)}
      />
      <UpperBox>
        <UpperBoxHead>Business Details</UpperBoxHead>

        <TableDiv>
          <DisplayTable
            tableId={'businessVerification'}
            tableWidth="100%"
            rows={businessVerificationRows}
            headers={BUSINESS_VERIFICATION_HEADERS}
            headersType={BUSINESS_VERIFICATION_HEADERS_TYPE}
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
      <UpperBox>
        <UpperBoxHead>Bank Details</UpperBoxHead>
        <TableDiv>
          <DisplayTable
            tableId={'bankDetails'}
            tableWidth="100%"
            rows={bankDetails}
            headers={BANK_HEADERS}
            headersType={BANK_HEADERS_TYPE}
            customProps={{ cursor: 'default' }}
          />{' '}
        </TableDiv>
      </UpperBox>
      <UpperBox>
        <UpperBoxHead>Agreement</UpperBoxHead>

        <TableDiv>
          <DisplayTable
            tableId={'agreement'}
            tableWidth="100%"
            rows={agreementDetails}
            headers={AGREEMENT_HEADERS}
            headersType={AGREEMENT_HEADERS_TYPE}
            highlightRow={true}
            customProps={{ cursor: 'default' }}
            showActionsPanel={showAgreementActions}
            arrBtn={arrBtnAgreement}
            actionIndex={agreementActionIndex}
            setActionIndex={setAgreementActionIndex}
            actionOpen={agreementActionOpen}
            setActionOpen={setAgreementActionOpen}
            arrBtnRight={'80px'}
          />
        </TableDiv>
        <AgreementDrawer
          open={openAgreementDrawer}
          url={agreementUrl}
          handleCloseDrawer={() => setOpenAgreementDrawer(false)}
        />
        <EditEmployerDetailsDrawer
          open={openEditDetailsDrawer}
          toggleDrawer={toggleEditDetailsDrawer}
          handleUpdateEmployerDetails={handleUpdateEmployerDetails}
          employeeBasicDetail={employeeBasicDetail}
          updateEmployerStatusStatus={updateEmployerStatusStatus}
          editAccObj={editAccObj}
          setEditAccObj={setEditAccObj}
          editAccErr={editAccErr}
          setEditAccErr={setEditAccErr}
        />
        {openDeletePop && (
          <Suspense fallback={<div></div>}>
            <GlobalPop
              setOpenDeletePop={setOpenDeletePop}
              title={'Delete Agreement'}
              heading={'Do you really want to delete it?'}
              handleDelete={handleDelete}
            />
          </Suspense>
        )}
      </UpperBox>
    </Wrapper>
  );
};

export default EmployerProfile;
