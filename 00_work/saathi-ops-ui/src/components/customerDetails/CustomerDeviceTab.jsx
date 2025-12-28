import React, { lazy, Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
const DisplayTable = lazy(() => import('../DisplayTable'));
import BoxLoader from '../common/BoxLoader';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Pagination from '../atom/tableComponents/Pagination';
import useCustomerDeviceInfo from '../../hooks/customer/useCustomerDeviceInfo';
import CustomCTA from '../CustomCTA';
import { CUSTOMER_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';
import { usePutCustomerUnblockStatus } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import DocumentStatus from './DocumentStatus';

const Wrapper = styled.div`
  margin: 0px;
  padding: 0px;
  font-family: Poppins;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  //   min-height: auto;
`;
const CustomWrap = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
`;

const HeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Header = styled.div`
  font-size: 16px;
  font-weight: 600;
  font-family: Poppins;
  margin-bottom: 10px;
`;

const TableDiv = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const CustomerDeviceTab = ({ userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { enqueueSnackbar } = useSnackbar();

  const {
    mutateAsync: updateCustomerUnblock,
    status: updateCustomerUnblockStatus,
    error: updateCustomerUnblockErr,
  } = usePutCustomerUnblockStatus();

  const {
    customerDevices,
    customerDeviceHeaders,
    customerDeviceHeadersType,
    customerDeviceTableHeaders,
    customerDeviceRows,
    isCustomerBlocked,
    customerPhoneNo,
    customerDeviceRefetch,
  } = useCustomerDeviceInfo(userId);

  const totalItems = customerDevices?.length;
  const paginatedRows = customerDeviceRows?.slice(
    (currentPage - 1) * itemsPerPage,
    itemsPerPage * currentPage,
  );

  useEffect(() => {
    if (updateCustomerUnblockErr) {
      enqueueSnackbar('Failed to unblock customer mobile number', {
        variant: 'error',
      });
    }
  }, [updateCustomerUnblockErr]);

  const handleRowClick = (index) => {
    navigate(`/devices/${customerDevices[index]?.macAddress}`);
  };
  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
    }
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleUnblockCustomerNo = () => {
    const payload = {
      phoneNo: customerPhoneNo,
      isUserBlocked: false,
    };
    updateCustomerUnblock(payload).then(() => customerDeviceRefetch());
  };

  return (
    <Wrapper>
      <TableDiv>
        <HeaderWrap>
          <CustomWrap>
            <Header>Logged In Devices: {customerDevices?.length}</Header>
          </CustomWrap>

          <Header>
            <CustomCTA
              title={'Unblock Number'}
              color={'#FFF'}
              bgColor={'#141482'}
              border={'1px solid #CDD4DF'}
              disabled={!isCustomerBlocked}
              isPermitted={hasPermission(
                CUSTOMER_PERMISSIONS?.UNBLOCK_CUSTOMER_NUMBER,
              )}
              onClick={handleUnblockCustomerNo}
            />
          </Header>
        </HeaderWrap>

        <Suspense fallback={<BoxLoader size={5} />}>
          {customerDeviceHeaders?.length > 0 ? (
            <DisplayTable
              tableId={'customerDeviceDetails'}
              rows={paginatedRows}
              headers={customerDeviceTableHeaders}
              headersType={customerDeviceHeadersType}
              tableWidth={'100%'}
              onClickFn={handleRowClick}
            />
          ) : (
            <BoxLoader size={5} />
          )}
        </Suspense>
      </TableDiv>
      <Pagination
        onShowSizeChange={onShowSizeChange}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        arrowBg={'#ebeff6'}
        isFlexColumn={false}
        isBottom={true}
        setOpenDropdown={setOpenDropdown}
        openDropdown={openDropdown}
        handleDropdown={handleDropdown}
      />
    </Wrapper>
  );
};
CustomerDeviceTab.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default CustomerDeviceTab;
