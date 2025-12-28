import { lazy } from 'react';
import React from 'react';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { useGetAllCustomerApplications } from '../../apis/queryHooks';
import { useParams, useNavigate } from 'react-router-dom';
import { getNestedProperty } from '../../utils/helper';
import styleComponents from '../../style/pageStyle';
import { Suspense } from 'react';
import BoxLoader from '../common/BoxLoader';
import ICONS from '../../assets/icons';
import styled from 'styled-components';
import usePermission from '../../hooks/usePermission';
const DisplayTable = lazy(() => import('../DisplayTable'));
const Pagination = lazy(() => import('../atom/tableComponents/Pagination'));
import ApplicantVideoDrawer from '../employers/ApplicantVideoDrawer';

const { Top, Bottom, TableDiv } = styleComponents();
const Wrapper = styled.div`
  margin: 0px;
  padding: 0px;
  font-family: Poppins;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80vh;
`;

const CustomerApplicationsTab = ({ userData }) => {
  const isMounted = useRef(false);
  const { hasPermission } = usePermission();
  const [totalItems, setTotalItems] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropDownBottom, setOpenDropDownBottom] = useState(false);
  const [showActionsPanel, setShowActionsPanel] = useState(true);

  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [biodataVideoDrawer, setBiodataVideoDrawer] = useState(false);
  const [interviewVideoDrawer, setInterviewVideoDrawer] = useState(false);
  const navigate = useNavigate();
  const handleLeftArrow = () => {
    navigate(-1);
  };
  const customerId = userData?._id;
  const customerName = userData?.name;
  const {
    data: allCustomerApplications,
    refetch: refetchCustomerApplicantData,
    isLoading: allCustomerApplicationsLoading,
    isFetching: allCustomerApplicationsFetching,
    error: allCustomerApplicationsError,
    isError: isCustomerApplicationsError,
  } = useGetAllCustomerApplications({
    customerId,
    itemsPerPage: itemsPerPage,
    currentPage: currentPage,
  });
  useEffect(() => {
    setTotalItems(allCustomerApplications?.noOfApplications);
  }, [allCustomerApplications]);

  const headerValues = allCustomerApplications?.headers?.map(
    (item) => item.value,
  );
  const headerTypes = allCustomerApplications?.headers?.map(
    (item) => item.type,
  );

  const applicantBiodataVideoLink =
    allCustomerApplications?.customerJobApplications?.[actionIndex]
      ?.customerBioDataVideo;
  const applicantInterviewVideoLink =
    allCustomerApplications?.customerJobApplications?.[actionIndex]
      ?.interviewVideoLink;

  function createData(applicationsDetails) {
    const headerKeys = Array.from(
      allCustomerApplications?.headers.map((item) => item.key),
    );
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(applicationsDetails, itemKey);
    });
  }
  const rows =
    allCustomerApplications?.customerJobApplications?.map((item) =>
      createData(item),
    ) || [];

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
    }
  };
  const handleDropDownBottom = () => {
    setOpenDropDownBottom(!openDropDownBottom);
  };
  const handleViewApplication = (e) => {
    e.stopPropagation();
    navigate(
      `/applications/${allCustomerApplications?.customerJobApplications?.[actionIndex]?._id}`,
    );
  };
  const handleViewBiodataVideo = (e) => {
    e.stopPropagation();
    setBiodataVideoDrawer(true);
  };
  const handleViewInterviewVideo = (e) => {
    e.stopPropagation();

    setInterviewVideoDrawer(true);
  };
  const arrBtn = [
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewApplication,
    },
    {
      text: 'View Biodata Video',
      icon: ICONS.VIDEO_THUMBNAIL_GRAY,
      active: true,
      isVisible: !!applicantBiodataVideoLink,
      color: '#000',
      onClick: handleViewBiodataVideo,
    },
    {
      text: 'View Interview Video',
      icon: ICONS.VIDEO_THUMBNAIL_GRAY,
      active: true,
      isVisible: !!applicantInterviewVideoLink,
      color: '#000',
      onClick: handleViewInterviewVideo,
    },
  ];

  return (
    <Wrapper>
      <Suspense fallback={<BoxLoader size={5} />}>
        <Top>
          <TableDiv>
            <DisplayTable
              tableId={'allCustomerApplicationTable'}
              headers={headerValues}
              headersType={headerTypes}
              rows={rows}
              showActionsPanel={showActionsPanel}
              actionIndex={actionIndex}
              setActionIndex={setActionIndex}
              actionOpen={actionOpen}
              setActionOpen={setActionOpen}
              arrBtn={arrBtn}
              arrBtnRight={'95px'}
              tableWidth={'100%'}
            />
          </TableDiv>
          {biodataVideoDrawer || interviewVideoDrawer ? (
            <ApplicantVideoDrawer
              open={biodataVideoDrawer || interviewVideoDrawer}
              toggleDrawer={() => {
                biodataVideoDrawer
                  ? setBiodataVideoDrawer(false)
                  : setInterviewVideoDrawer(false);
              }}
              headerTitle={
                biodataVideoDrawer
                  ? `${customerName}’s Biodata Video`
                  : `${customerName}’s Interview Video`
              }
              videoLink={
                biodataVideoDrawer
                  ? applicantBiodataVideoLink
                  : applicantInterviewVideoLink
              }
              showRemarksSection={false}
            />
          ) : null}
        </Top>
        <Bottom>
          <Suspense>
            <Pagination
              onShowSizeChange={onShowSizeChange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              setTotalItems={setTotalItems}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              arrowBg={'#fff'}
              isFlexColumn={false}
              isBottom={false}
              setOpenDropdown={setOpenDropDownBottom}
              openDropdown={openDropDownBottom}
              handleDropdown={handleDropDownBottom}
            />
          </Suspense>
        </Bottom>
      </Suspense>
    </Wrapper>
  );
};

export default CustomerApplicationsTab;
