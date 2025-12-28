import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import BoxLoader from '../common/BoxLoader';
const DisplayTable = lazy(() => import('../DisplayTable'));
import { formatDate, getValueSuffix } from '../../utils/helper';
import { REFERRAL_HEADERS, REFERRAL_HEADERS_TYPE } from '../../constants/employer';
import { RUPEE_SYMBOL } from '../../constants/details';

const Wrapper = styled.div`
    background-color: #FFFFFF;
    padding:${(props) => props.$padding};
    border-radius: ${(props) => props.$borderRadius};
`;

const ContentSection = styled.div`
  display: flex;
  justify-content : space-between;
  flex-direction: ${(props) =>
        props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => props.$gap ?? null};
`;

const ReferralBreakup = ({ referralBreakupData }) => {
    return (
        <Wrapper $padding={`${referralBreakupData?.length ? "0px" : "16px"}`} $borderRadius={`${referralBreakupData?.length ? "16px" : "8px"}`}>
            <ContentSection>
                <Suspense fallback={<BoxLoader size={5} />}>
                    <DisplayTable
                        tableId={'employerReferralHistoryTable'}
                        rows={referralBreakupData}
                        headers={REFERRAL_HEADERS}
                        headersType={REFERRAL_HEADERS_TYPE}
                        tableWidth={'100%'}
                        emptyDataMessage="There is no referral breakup"
                        lastAlignRight={true}
                    />
                </Suspense>
            </ContentSection>
        </Wrapper>
    );
};

export default ReferralBreakup;
