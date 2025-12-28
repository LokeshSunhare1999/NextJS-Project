import React, { lazy, useState, Suspense, useEffect } from 'react';
import styled from 'styled-components';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BoxLoader from '../common/BoxLoader';
import { useParams } from 'react-router-dom';
import usePermission from '../../hooks/usePermission';
import { PAYOUT_PERMISSIONS } from '../../constants/permissions';
import { PAYOUT_REQUEST_TAB_HEADERS } from '../../constants/employer';

const AmountBreakup = lazy(() => import('./AmountBreakup'));
const ReferralBreakup = lazy(() => import('./ReferralBreakup'));

const Wrapper = styled.div`
  margin: 0px;
  padding: 0px;
`;

const StyledP = styled.p`
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize || '18px'};
  line-height: ${(props) => props.$lineHeight || '27px'};
  font-weight: ${(props) => props.$fontWeight || '600'};
  color: ${(props) => props.$color || '#000'};
`;

const PayoutRequestDetailsTabs = ({
  amountBreakupData,
  referralBreakupData,
}) => {
  const { hasPermission } = usePermission();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    setSelectedTab(0);
  }, [id]);

  const getFilteredTabHeaders = (hasPermission) => {
    return PAYOUT_REQUEST_TAB_HEADERS.filter((_, index) => {
      switch (index) {
        case 0:
          return hasPermission(
            PAYOUT_PERMISSIONS.VIEW_PAYOUT_DETAILS,
          );
        case 1:
          return hasPermission(
            PAYOUT_PERMISSIONS.VIEW_PAYOUT_DETAILS,
          );
        default:
          return false;
      }
    });
  };

  const tabHeaders = getFilteredTabHeaders(hasPermission);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabComponents = [
    hasPermission(PAYOUT_PERMISSIONS.VIEW_PAYOUT_DETAILS) && (
      <AmountBreakup amountBreakupData={amountBreakupData} />
    ),
    hasPermission(PAYOUT_PERMISSIONS.VIEW_PAYOUT_DETAILS) && (
      <ReferralBreakup referralBreakupData={referralBreakupData} />
    ),
  ].filter(Boolean);

  return (
    <Wrapper>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        textColor="inherit"
        TabIndicatorProps={{
          style: {
            backgroundColor: '#141482',
          },
        }}
        sx={{
          borderBottom: 1,
          borderBottomColor: '#CDD4DF',
        }}
      >
        {tabHeaders.map((item, idx) => {
          return (
            <Tab
              key={item}
              label={item}
              value={idx}
              sx={{
                textTransform: 'none',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: '500',
                padding: '0px',
                marginRight: '50px',
                color: selectedTab === idx ? '#141482' : '#677995',
              }}
            />
          );
        })}
      </Tabs>
      <div
        style={{
          paddingTop: '20px',
        }}
      >
        <Suspense fallback={<BoxLoader size={5} data-testid="box-loader"/>}>
          {tabComponents[selectedTab]}
        </Suspense>
      </div>
    </Wrapper>
  );
};

export default PayoutRequestDetailsTabs;
