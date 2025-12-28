import React, { lazy, Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import BoxLoader from '../common/BoxLoader';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateSearchParams } from '../../utils/helper';
import useEmployerPayment from '../../hooks/employer/useEmployerPayment';
const DisplayTable = lazy(() => import('../DisplayTable'));
const Pagination = lazy(
  () => import('../../components/atom/tableComponents/Pagination'),
);

const Wrapper = styled.div`
  margin: 0px;
  padding: 0px;
  font-family: Poppins;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80vh;
`;
const TableDiv = styled.div`
  position: relative;
`;

const PaginationDiv = styled.div`
  margin-top: 20px;
`;
const EmployerPaymentTab = ({ employerId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const {
    employerPayments,
    employerPaymentTableHeaders,
    employerPaymentData,
    employerPaymentsHeaders,
    employerPaymentKeys,
    employerPaymentRows,
    employerPaymentDataFetching,
  } = useEmployerPayment({
    employerId,
    currentPage,
    itemsPerPage,
  });

  const headerTypes =
    employerPaymentData?.headers?.map((item) => item.type) || [];

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);

      const queryString = generateSearchParams(searchParams);
      navigate(`/employers/${employerId}?${queryString}`, {
        replace: true,
      });
    }
  };
  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  useEffect(() => {
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, []);

  useEffect(() => {
    setTotalItems(employerPaymentData?.totalEntries || 0);
  }, [employerPaymentData]);

  return (
    <Wrapper>
      <Suspense fallback={<BoxLoader size={5} />}>
        <TableDiv>
          {!employerPaymentDataFetching ? (
            <DisplayTable
              showActionsPanel={false}
              tableId={'employerJobs'}
              rows={employerPaymentRows}
              headers={employerPaymentTableHeaders}
              headersType={headerTypes}
              tableWidth={'100%'}
              emptyDataMessage="No payment data available"
              navigate={navigate}
            />
          ) : (
            <BoxLoader size={5} />
          )}
        </TableDiv>

        <PaginationDiv>
          <Pagination
            onShowSizeChange={onShowSizeChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
            setTotalItems={setTotalItems}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            isBottom={true}
            setOpenDropdown={setOpenDropdown}
            openDropdown={openDropdown}
            handleDropdown={handleDropdown}
            searchParams={searchParams}
            navigate={navigate}
            pageType={`employers/${employerId}`}
          />
        </PaginationDiv>
      </Suspense>
    </Wrapper>
  );
};

export default EmployerPaymentTab;
