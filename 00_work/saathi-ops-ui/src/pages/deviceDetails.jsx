import { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import { useNavigate, useParams } from 'react-router-dom';
import BoxLoader from '../components/common/BoxLoader';
import DisplayTable from '../components/DisplayTable';
import Pagination from '../components/atom/tableComponents/Pagination';
import useCustomerLoggedInMobileInfo from '../hooks/customer/useCustomerLoggedInMobileInfo';
import IdContainer from '../components/atom/tableComponents/IdContainer';
import CustomCTA from '../components/CustomCTA';
import { CUSTOMER_PERMISSIONS } from '../constants/permissions';
import usePermission from '../hooks/usePermission';
import DocumentStatus from '../components/customerDetails/DocumentStatus';
import { usePutDeviceUnblockStatus } from '../apis/queryHooks';
import { useSnackbar } from 'notistack';

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
  font-family: Poppins;
`;

const LeftArrow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
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

const HeaderWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  gap: 20px;
`;

const Header = styled.div`
  width: auto;
  margin: 15px 0px 20px 0px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 600;
  font-family: Poppins;
  margin-bottom: 10px;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: row;
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  gap: 16px;
`;

const HeaderDesc = styled.span`
  width: auto;
  font-size: 16px;
  ont-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: ${(props) => (props.$width ? props.$width : 'fit-content')};
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => (props.$gap ? props.$gap : '8px')};
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const TableDiv = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const DeviceDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { deviceId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const {
    customerLoggedInMobiles,
    customerLoggedInMobileHeaders,
    customerLoggedInMobileHeadersType,
    customerLoggedInMobileTableHeaders,
    customerLoggedInMobileRows,
    isDeviceBlocked,
    customerLoggedInMobileRefetch,
  } = useCustomerLoggedInMobileInfo(deviceId);
  const totalItems = customerLoggedInMobiles?.length;
  const paginatedRows = customerLoggedInMobileRows?.slice(
    (currentPage - 1) * itemsPerPage,
    itemsPerPage * currentPage,
  );

  const {
    mutateAsync: updateCustomerUnblockDevice,
    status: updateCustomerUnblockDeviceStatus,
    error: updateCustomerUnblockDeviceErr,
  } = usePutDeviceUnblockStatus();

  useEffect(() => {
    if (updateCustomerUnblockDeviceErr) {
      enqueueSnackbar('Failed to unblock the device', {
        variant: 'error',
      });
    }
  }, [updateCustomerUnblockDeviceErr]);

  const handleLeftArrow = () => {
    navigate(-1);
  };
  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
    }
  };

  const handleDeviceUnblock = () => {
    const payload = {
      macAddress: deviceId,
      isIdentityBlocked: false,
    };
    updateCustomerUnblockDevice(payload).then(() =>
      customerLoggedInMobileRefetch(),
    );
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  return (
    <Wrapper>
      <LeftArrow>
        <Left onClick={() => handleLeftArrow()}>
          <Img
            src={ICONS.LEFT_ARROW_BLACK}
            alt="leftArrowBlack"
            width={'24px'}
            height={'24px'}
          />
        </Left>
      </LeftArrow>
      <Header>
        <FlexContainer
          $alignItems="center"
          $justifyContent="space-between"
          $width="100%"
        >
          <FlexContainer $flexDirection="column" $gap="0px">
            <HeaderWrap>
              <HeaderTitle>Device Identity</HeaderTitle>
            </HeaderWrap>
            <HeaderDesc>
              {`Device ID:`} <IdContainer item={deviceId} />{' '}
            </HeaderDesc>
          </FlexContainer>
        </FlexContainer>
      </Header>
      <HeaderWrap>
        <Header>Logged In Numbers: {customerLoggedInMobiles?.length}</Header>
        <CustomCTA
          title={'Unblock Device'}
          color={'#FFF'}
          bgColor={'#141482'}
          border={'1px solid #CDD4DF'}
          disabled={!isDeviceBlocked}
          isPermitted={hasPermission(
            CUSTOMER_PERMISSIONS?.UNBLOCK_CUSTOMER_DEVICE,
          )}
          onClick={handleDeviceUnblock}
        />
      </HeaderWrap>

      <TableDiv>
        <Suspense fallback={<BoxLoader size={5} />}>
          {customerLoggedInMobileHeaders?.length > 0 ? (
            <DisplayTable
              tableId={'customerDeviceDetails'}
              rows={paginatedRows}
              headers={customerLoggedInMobileTableHeaders}
              headersType={customerLoggedInMobileHeadersType}
              tableWidth={'100%'}
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

export default DeviceDetails;
