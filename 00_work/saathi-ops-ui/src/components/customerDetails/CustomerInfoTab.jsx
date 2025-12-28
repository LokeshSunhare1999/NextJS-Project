import React, {
  useState,
  lazy,
  Suspense,
  useEffect,
  useContext,
  useRef,
} from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import usePermission from '../../hooks/usePermission';
import { CUSTOMER_DETAILS_PERMISSIONS } from '../../constants/permissions';
import useCustomerDetails from '../../hooks/customer/useCustomerDetails';
import {
  VERIFICATION_HEADERS,
  VERIFICATION_HEADERS_TYPE,
} from '../../constants/verification';
import { JOB_REEL_HEADERS, JOB_REEL_HEADERS_TYPE } from '../../constants/jobs';
import CustomCTA from '../CustomCTA';
import { ModalContext } from '../../context/ModalProvider';
import VerificationModal from '../workexp/VerificationModal';
import { usePutUpdateCustomer } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import DeleteModal from '../workexp/DeleteModel';
import { capitalizeFirstLetter, scrollToTop } from '../../utils/helper';
const DisplayTable = lazy(() => import('../DisplayTable'));

import EditDetailsDrawer from './EditDetailsDrawer';
const DetailsContainer = lazy(
  () => import('../atom/tableComponents/DetailsContainer'),
);
const AddWorkExpDrawer = lazy(() => import('../workexp/AddWorkExpDrawer'));
const EditTrueIDDrawer = lazy(() => import('./EditTrueIDDrawer'));

const TableDiv = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  font-family: 'Poppins';
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UpperBox = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
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

const CustomerInfoTab = ({
  userInfo,
  setPageRoute,
  setWorkExpIndex,
  setShowVerificationPage,
  setShowWorkExperiencePage,
  setShowJobReelPage,
  refetchCustomerData,
  setJobReelsIndex,
  navigate,
}) => {
  const {
    employeeData,
    trueIdData,
    verificationRows,
    jobReelsDataRows,
    verificationData,
    workExpHeaders,
    workExpRows,
    workExpData,
    userEnteredBasicDetails,
    createTooltipArray,
    handleRowClick,
    handleWorkExpRowClick,
    handleJobReelsRowClick,
  } = useCustomerDetails(
    userInfo,
    setPageRoute,
    setWorkExpIndex,
    setJobReelsIndex,
    setShowVerificationPage,
    setShowWorkExperiencePage,
    setShowJobReelPage,
    navigate,
  );

  const { displayModal, updateModal, closeModal } = useContext(ModalContext);
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();
  const [actionOpen, setActionOpen] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [workExpActionOpen, setWorkExpActionOpen] = useState(false);
  const [jobReelsActionOpen, setJobReelsActionOpen] = useState(false);
  const [workExpActionIndex, setWorkExpActionIndex] = useState('');
  const [jobReelsActionIndex, setJobReelsActionIndex] = useState('');
  const [openAddWorkExpDrawer, setOpenAddWorkExpDrawer] = useState(false);
  const [isEditWorkExp, setIsEditWorkExp] = useState(false);
  const [openEditDetailsDrawer, setOpenEditDetailsDrawer] = useState(false);
  const [openTrueIDDetailsDrawer, setOpenTrueIDDetailsDrawer] = useState(false);
  const expIndexRef = useRef(null);
  const {
    mutateAsync: updateCustomerMutation,
    status: updateCustomerStatus,
    isError: isUpdateCustomerIdErr,
    error: updateCustomerErr,
  } = usePutUpdateCustomer();

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (isUpdateCustomerIdErr) {
      enqueueSnackbar('Failed to update customer data', {
        variant: 'error',
      });
      closeModal();
    }
  }, [isUpdateCustomerIdErr]);

  const handleEditWorkExpDrawerOpen = (e) => {
    e.stopPropagation();
    expIndexRef.current = workExpActionIndex;
    setOpenAddWorkExpDrawer(true);
    setIsEditWorkExp(true);

    setWorkExpActionIndex('');
  };

  const toggleAddWorkExpDrawer = (newOpen) => {
    setOpenAddWorkExpDrawer(newOpen);
  };

  const handleAddWorkExperience = () => {
    setIsEditWorkExp(false);
    setOpenAddWorkExpDrawer(true);
  };

  const handleSubmit = async (
    { empRemarks, rating, opsRemarks, verificationStatus },
    customProps = {},
  ) => {
    const currExp = workExpData[workExpActionIndex];
    const filteredEmployments = workExpData?.filter(
      (emp) => emp._id !== currExp._id,
    );
    const updatedExp = {
      ...currExp,
      remark: opsRemarks,
      employerRemark: empRemarks,
      rating,
      verificationStatus,
    };
    updateModal(
      <VerificationModal
        isLoading
        onSubmit={handleSubmit}
        text="Change Verification Status"
        customProps={{
          currentStatus: currExp?.verificationStatus,
        }}
      />,
      { modalWidth: '860px' },
    );
    await updateCustomerMutation({
      _id: userInfo._id,
      employments: [...filteredEmployments, updatedExp],
    });
    enqueueSnackbar(
      `You successfully changed the status from '${capitalizeFirstLetter(currExp?.verificationStatus)}' to '${capitalizeFirstLetter(verificationStatus)}'.`,
      {
        variant: 'success',
      },
    );
    refetchCustomerData();
  };

  const handleOpenChangeVerificationStatusModal = (e) => {
    e.stopPropagation();
    setWorkExpActionOpen(false);
    setWorkExpActionIndex('');
    displayModal(
      <VerificationModal
        onSubmit={handleSubmit}
        text="Change Verification Status"
        customProps={{
          currentStatus: workExpData[workExpActionIndex]?.verificationStatus,
        }}
      />,
      { modalWidth: '860px' },
    );
  };

  const handleViewWorkExpDetails = (e) => {
    e.stopPropagation();
    setWorkExpIndex(workExpActionIndex);
    setShowWorkExperiencePage(true);
  };

  const handleDeleteWorkExp = async () => {
    const currExp = workExpData[workExpActionIndex];
    const filteredEmployments = workExpData?.filter(
      (emp) => emp._id !== currExp._id,
    );
    updateModal(
      <DeleteModal
        isLoading
        onSubmit={handleDeleteWorkExp}
        text="Delete Work Experience"
      />,
    );
    await updateCustomerMutation({
      _id: userInfo._id,
      employments: [...filteredEmployments],
    });

    enqueueSnackbar(
      `You successfully deleted the customer’s work experience.`,
      {
        variant: 'success',
      },
    );
    refetchCustomerData();
    setWorkExpActionIndex('');
  };

  const handleViewDeleteModal = (e) => {
    e.stopPropagation();
    displayModal(
      <DeleteModal
        onSubmit={handleDeleteWorkExp}
        text="Delete Work Experience"
      />,
    );
  };

  const toggleEditDetailsDrawer = (isOpen) => {
    setOpenEditDetailsDrawer(isOpen);
  };

  const toggleTrueIDDetailsDrawer = (isOpen) => {
    setOpenTrueIDDetailsDrawer(isOpen);
  };

  const viewWorkEx = (index) => {
    hasPermission(CUSTOMER_DETAILS_PERMISSIONS?.VIEW_WORKEX_DETAILS)
      ? handleWorkExpRowClick(index)
      : () => {};
  };
  const viewVerificationData = (index) => {
    hasPermission(CUSTOMER_DETAILS_PERMISSIONS?.VIEW_VERIFICATION_DETAILS)
      ? handleRowClick(index)
      : () => {};
  };
  const viewJobReel = (index) => {
    handleJobReelsRowClick(index);
  };
  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    handleRowClick(actionIndex);
  };
  const handleViewReelPageClick = (e) => {
    e.stopPropagation();
    handleJobReelsRowClick(jobReelsActionIndex);
  };

  const arrBtn = [
    {
      text: 'View',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewDetailsClick,
      permission: CUSTOMER_DETAILS_PERMISSIONS?.VIEW_VERIFICATION_DETAILS,
    },
  ];
  const jobReelsArrBtn = [
    {
      text: 'View',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewReelPageClick,
    },
  ];

  const workExpArrBtn = [
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleEditWorkExpDrawerOpen,
      permission: CUSTOMER_DETAILS_PERMISSIONS?.EDIT_WORKEX_DETAILS,
    },
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewWorkExpDetails,
      permission: CUSTOMER_DETAILS_PERMISSIONS?.VIEW_WORKEX_DETAILS,
    },
    {
      text: 'Change Verification Status',
      icon: ICONS.CHECKLIST,
      active: true,
      isVisible:
        workExpData?.[workExpActionIndex]?.verificationStatus !== undefined,
      color: '#000',
      onClick: handleOpenChangeVerificationStatusModal,
      permission:
        CUSTOMER_DETAILS_PERMISSIONS?.CHANGE_WORKEX_VERIFICATION_STATUS,
    },
    {
      text: 'Delete',
      icon: ICONS.DELETE_ICON,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewDeleteModal,
      permission: CUSTOMER_DETAILS_PERMISSIONS?.DELETE_WORKEX_DETAILS,
    },
  ];
  return (
    <Wrapper>
      <Suspense fallback={<div></div>}>
        <DetailsContainer
          title={'Basic Details'}
          detailsData={employeeData}
          showEdit={hasPermission(
            CUSTOMER_DETAILS_PERMISSIONS?.EDIT_BASIC_DETAILS,
          )}
          handleEditClick={() => toggleEditDetailsDrawer(true)}
          setShowJobReelPage={setShowJobReelPage}
          navigate={navigate}
        />
        <UpperBox>
          <UpperBoxHead>Job Reel</UpperBoxHead>

          <TableDiv>
            <DisplayTable
              tableId={'jobReelData'}
              tableWidth="100%"
              rows={jobReelsDataRows}
              headers={JOB_REEL_HEADERS}
              headersType={JOB_REEL_HEADERS_TYPE}
              showActionsPanel={true}
              onClickFn={viewJobReel}
              arrBtn={jobReelsArrBtn}
              actionIndex={jobReelsActionIndex}
              setActionIndex={setJobReelsActionIndex}
              actionOpen={jobReelsActionOpen}
              setActionOpen={setJobReelsActionOpen}
              highlightRow={true}
              arrBtnRight={'80px'}
            />
          </TableDiv>
        </UpperBox>
        {hasPermission(CUSTOMER_DETAILS_PERMISSIONS?.VIEW_TRUE_ID_DETAILS) ? (
          <DetailsContainer
            title={'TrueID Details'}
            detailsData={trueIdData}
            showEdit={hasPermission(
              CUSTOMER_DETAILS_PERMISSIONS?.EDIT_TRUE_ID_DETAILS,
            )}
            handleEditClick={() => toggleTrueIDDetailsDrawer(true)}
          />
        ) : null}
        <DetailsContainer
          title={'User Entered Details'}
          detailsData={userEnteredBasicDetails}
        />
        {hasPermission(
          CUSTOMER_DETAILS_PERMISSIONS?.VIEW_VERIFICATION_DETAILS,
        ) ? (
          <UpperBox>
            <UpperBoxHead>Verification Data</UpperBoxHead>

            <TableDiv>
              <DisplayTable
                tableId={'verificationData'}
                tableWidth="100%"
                rows={verificationRows}
                headers={VERIFICATION_HEADERS}
                headersType={VERIFICATION_HEADERS_TYPE}
                showActionsPanel={true}
                onClickFn={viewVerificationData}
                arrBtn={arrBtn}
                actionIndex={actionIndex}
                setActionIndex={setActionIndex}
                actionOpen={actionOpen}
                setActionOpen={setActionOpen}
                toolTipArray={createTooltipArray(verificationData)}
                tooltipIcon={ICONS?.INFO_TOOLTIP}
                highlightRow={true}
                arrBtnRight={'80px'}
              />
            </TableDiv>
          </UpperBox>
        ) : null}

        {hasPermission(CUSTOMER_DETAILS_PERMISSIONS?.VIEW_WORKEX_DETAILS) ? (
          <UpperBox>
            <FlexContainer $alignItems="center" $justifyContent="space-between">
              <UpperBoxHead>Work Experience</UpperBoxHead>
              <CustomCTA
                onClick={() => handleAddWorkExperience()}
                showIcon
                title="Add Experience"
                showSecondary={true}
                color="#ffffff"
                bgColor="#677995"
                border="1px solid #CDD4DF"
                isPermitted={hasPermission(
                  CUSTOMER_DETAILS_PERMISSIONS?.ADD_WORKEX,
                )}
              />
            </FlexContainer>

            <TableDiv>
              <DisplayTable
                tableId={'workExp'}
                tableWidth="100%"
                rows={workExpRows}
                headers={workExpHeaders?.map((item) => item?.value)}
                headersType={workExpHeaders?.map((item) => item?.type)}
                showActionsPanel={true}
                onClickFn={viewWorkEx}
                arrBtn={workExpArrBtn}
                toolTipArray={createTooltipArray(workExpData)}
                actionIndex={workExpActionIndex}
                setActionIndex={setWorkExpActionIndex}
                actionOpen={workExpActionOpen}
                setActionOpen={setWorkExpActionOpen}
                tooltipIcon={ICONS?.INFO_TOOLTIP}
                highlightRow={true}
                isActionBottom={true}
              />
            </TableDiv>
          </UpperBox>
        ) : null}

        <EditDetailsDrawer
          open={openEditDetailsDrawer}
          toggleDrawer={toggleEditDetailsDrawer}
          customerId={userInfo?._id}
          detailsData={userInfo}
          refetchCustomerData={refetchCustomerData}
        />
      </Suspense>
      <Suspense fallback={<div></div>}>
        <AddWorkExpDrawer
          customerId={userInfo?._id}
          customerName={userInfo?.name}
          isEditWorkExp={isEditWorkExp}
          open={openAddWorkExpDrawer}
          workExpIndex={expIndexRef?.current}
          employments={workExpData}
          toggleDrawer={toggleAddWorkExpDrawer}
          refetchCustomerData={refetchCustomerData}
        />
        <EditTrueIDDrawer
          open={openTrueIDDetailsDrawer}
          toggleDrawer={toggleTrueIDDetailsDrawer}
          customerId={userInfo?._id}
          detailsData={userInfo}
          refetchCustomerData={refetchCustomerData}
        />
      </Suspense>
    </Wrapper>
  );
};

export default CustomerInfoTab;
