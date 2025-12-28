import React, { useState, useEffect, lazy, Suspense } from 'react';
import styled from 'styled-components';
import useCustomerCourseDetails from '../../hooks/customer/useCustomerCourseDetails';
import ICONS from '../../assets/icons';
const DisplayTable = lazy(() => import('../DisplayTable'));

import BoxLoader from '../common/BoxLoader';
import ViewCustomerCourseDrawer from './ViewCustomerCourseDrawer';
import PropTypes from 'prop-types';
import ViewCustomerTestDrawer from './ViewCustomerTestDrawer';

const TableDiv = styled.div`
  position: relative;
`;
const CustomerCoursesDetailsTab = ({
  customerId,
  setTotalPurchasedCourses,
}) => {
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [openCustomerCourseDrawer, setOpenCustomerCourseDrawer] =
    useState(false);
  const [openCustomerTestDrawer, setOpenCustomerTestDrawer] = useState(false);
  const [courseObj, setCourseObj] = useState({});
  const {
    customerCoursesHeaders,
    customerCourseTableHeaders,
    customerCourseRows,
    handleDetailsClick,
    handleTrophyClick,
    handleCertificateClick,
    certificateLinks,
    trophyLinks,
    medalLinks,
    handleMedalClick,
    toggleCustomerCourseDrawer,
    toggleCustomerTestDrawer,
    handleRowClick,
  } = useCustomerCourseDetails(
    customerId,
    setTotalPurchasedCourses,
    actionIndex,
    setActionOpen,
    setOpenCustomerCourseDrawer,
    setOpenCustomerTestDrawer,
    setCourseObj,
  );

  const arrBtn = [
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleDetailsClick,
    },
    {
      text: 'View Trophy',
      icon: ICONS.EYE,
      active: true,
      isVisible: trophyLinks[actionIndex]?.length > 0,
      color: '#000',
      onClick: handleTrophyClick,
    },
    {
      text: 'View Certificate',
      icon: ICONS.EYE,
      active: true,
      isVisible: certificateLinks[actionIndex]?.length > 0,
      color: '#000',
      onClick: handleCertificateClick,
    },
    {
      text: 'View Medal',
      icon: ICONS.EYE,
      active: true,
      isVisible: medalLinks[actionIndex]?.length > 0,
      color: '#000',
      onClick: handleMedalClick,
    },
  ];

  return (
    <Suspense fallback={<BoxLoader size={5} />}>
      {customerCourseTableHeaders?.length > 0 ? (
        <TableDiv>
          <DisplayTable
            tableId={'customerCourses'}
            rows={customerCourseRows}
            headers={customerCourseTableHeaders}
            headersType={Array.from(
              customerCoursesHeaders?.map((item) => item.type),
            )}
            tableWidth={'100%'}
            showActionsPanel={true}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            actionOpen={actionOpen}
            setActionOpen={setActionOpen}
            arrBtn={arrBtn}
            onClickFn={handleRowClick}
            highlightRow={true}
          />
        </TableDiv>
      ) : (
        <BoxLoader size={5} />
      )}
      <ViewCustomerCourseDrawer
        open={openCustomerCourseDrawer}
        toggleDrawer={toggleCustomerCourseDrawer}
        courseObj={courseObj}
      />
      <ViewCustomerTestDrawer
        open={openCustomerTestDrawer}
        toggleDrawer={toggleCustomerTestDrawer}
        courseObj={courseObj}
      />
    </Suspense>
  );
};

CustomerCoursesDetailsTab.propTypes = {
  customerId: PropTypes.string.isRequired,
  setTotalPurchasedCourses: PropTypes.func.isRequired,
};

export default CustomerCoursesDetailsTab;
