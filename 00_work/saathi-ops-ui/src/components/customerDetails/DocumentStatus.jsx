import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CustomTooltip from '../common/CustomTooltip';
import { STATUS_VALUES } from '../../constants';
import { VERIFICATION_FILTER_SECTIONS } from '../../constants/verification';

const StatusTag = styled.div`
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 4px;
  padding: ${(props) => (props.$noPadding ? '' : '3px 9px')};
  width: fit-content;
  color: ${(props) => (props?.$color ? props?.$color : '#000')};
  background: ${(props) =>
    props?.$background ? props?.$background : '#FFD75D'};
`;

const StyledImg = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;

const StyledDiv = styled.div`
  display: ${(props) => (props.$display ? props.$display : 'flex')};
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => (props.$gap ? props.$gap : '5px')};
  align-items: ${(props) => (props.$alignItems ? props.$alignItems : 'center')};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
`;

const StyledUl = styled.ul`
  list-style-type: ${(props) =>
    props.$listStyleType ? props.$listStyleType : 'none'};
`;

const StyledOl = styled.ol`
  padding: ${(props) => (props.$padding ? props.$padding : '0 0 0 20px')};
`;

const getStatusDetails = (status) => {
  switch (status?.toLowerCase()) {
    case 'auto_refunded':
      return {
        title: 'Auto Refunded',
        bgColor: '#03B4FF',
        textColor: '#FFF',
      };
    case 'refunded':
      return {
        title: 'Refunded',
        bgColor: '#03B4FF',
        textColor: '#FFF',
      };
    case 'failed':
      return {
        title: 'Failed',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };
    case 'denied':
      return {
        title: 'Denied',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };
    case 'success':
      return {
        title: 'Success',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'transferred':
      return {
        title: 'Transferred',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'approved':
      return {
        title: 'Approved',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'new':
      return {
        title: 'New',
        bgColor: '#009797',
        textColor: '#FFF',
      };
    case 'created':
      return {
        title: 'Created',
        bgColor: '#2F59ED',
        textColor: '#FFF',
      };
    case 'assigned':
      return {
        title: 'Assigned',
        bgColor: '#2F59ED',
        textColor: '#FFF',
      };
    case 'completed':
      return {
        title: 'Completed',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'cancelled':
      return {
        title: 'Cancelled',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };
    case 'processing':
      return {
        title: 'Processing',
        bgColor: '#F3BB06',
        textColor: '#FFF',
      };
    case 'not_initiated':
      return {
        title: 'Not Initiated',
        bgColor: '#797979',
        textColor: '#FFF',
      };
    case 'draft':
      return {
        title: 'Draft',
        bgColor: '#797979',
        textColor: '#FFF',
      };

    case 'manualreview':
      return {
        title: 'Manual Review',
        bgColor: '#F3BB06',
        textColor: '#FFF',
      };
    case 'pending':
      return {
        title: 'Pending',
        bgColor: '#F3BB06',
        textColor: '#FFF',
      };
    case 'under_evaluation':
      return {
        title: 'Under Evaluation',
        bgColor: '#F3BB06',
        textColor: '#FFF',
      };

    case 'in_progress':
      return {
        title: 'In Progress',
        bgColor: '#F3BB06',
        textColor: '#FFF',
      };

    case 'pass':
      return {
        title: 'Pass',
        bgColor: '#32B237',
        textColor: '#FFF',
      };

    case 'fail':
      return {
        title: 'Fail',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };

    case 'activated':
      return {
        title: 'Activated',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'ops_verified':
    case 'verified':
      return {
        title: 'Verified',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'shortlisted':
      return {
        title: 'Shortlisted',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'active':
      return {
        title: 'Active',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'ops_rejected':
    case 'rejected':
      return {
        title: 'Rejected',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };
    case 'screening_rejected':
      return {
        title: 'Screening Rejected',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };
    case 'inactive':
      return {
        title: 'Inactive',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };
    case 'lead':
      return {
        title: 'Lead',
        bgColor: '#F3BB06',
        textColor: '#FFF',
      };
    case 'free':
      return {
        title: 'Free',
        bgColor: '#797979',
        textColor: '#FFF',
      };

    case 'not_started':
      return {
        title: 'Yet To Start',
        bgColor: '#1A79FF',
        textColor: '#FFF',
      };
    case 'paid':
      return {
        title: 'Paid',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'in_review':
      return {
        title: 'In-Review',
        bgColor: '#327BB2',
        textColor: '#FFF',
      };
    case 'paused':
      return {
        title: 'Paused',
        bgColor: '#F0B400',
        textColor: '#FFF',
      };
    case 'expired':
      return {
        title: 'Expired',
        bgColor: '#888888',
        textColor: '#FFF',
      };
    case 'published':
      return {
        title: 'Published',
        bgColor: '#32B237',
        textColor: '#FFF',
      };

    case 'dropped':
      return {
        title: 'Dropped',
        bgColor: '#ED782F',
        textColor: '#FFF',
      };
    case 'onboarded':
      return {
        title: 'Onboarded',
        bgColor: '#3F7DFF',
        textColor: '#FFF',
      };
    case 'hired':
      return {
        title: 'Finalised',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'interview_completed':
      return {
        title: 'Completed',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'done':
      return {
        title: 'Done',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'interview_lapsed':
      return {
        title: 'Lapsed',
        bgColor: '#888888',
        textColor: '#FFF',
      };
    case 'interview_rejected':
      return {
        title: 'Rejected',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };
    case 'interview_started':
      return {
        title: 'Interview Started',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'applied':
      return {
        title: 'Applied',
        bgColor: '#32B237',
        textColor: '#FFF',
      };
    case 'saved':
      return {
        title: 'Saved',
        bgColor: '#32B237',
        textColor: '#FFF',
      };

    case 'blocked':
      return {
        title: 'Blocked',
        bgColor: '#ED2F2F',
        textColor: '#FFF',
      };

    case undefined:
    case null:
    case '-----':
      return {
        title: '-----',
        bgColor: '#FFF',
        textColor: '#000',
        noPadding: true,
      };
    default:
      return {
        title: status,
        bgColor: '#FFD75D',
        textColor: '#000',
      };
  }
};

const DocumentStatus = ({
  status,
  showTooltip = false,
  tooltipIcon = '',
  statusRemark = [],
}) => {
  const statusDetails = getStatusDetails(status);

  const createTooltipElement = (statusRemark) => {
    return (
      <StyledUl>
        {Object.entries(statusRemark).map(([statusType, statusKeys]) => (
          <React.Fragment key={statusType}>
            <li>{STATUS_VALUES?.[statusType]}</li>
            <StyledOl>
              {statusKeys.map((statusKey) => (
                <li key={statusKey}>
                  {VERIFICATION_FILTER_SECTIONS[statusKey]
                    .replace('Verification Status', '')
                    .trim()}
                </li>
              ))}
            </StyledOl>
          </React.Fragment>
        ))}
      </StyledUl>
    );
  };

  return (
    <StyledDiv>
      <StatusTag
        $color={statusDetails?.textColor}
        $background={statusDetails?.bgColor}
        $noPadding={statusDetails?.noPadding}
      >
        {statusDetails?.title}
      </StatusTag>
      {showTooltip ? (
        <CustomTooltip
          placement="right-end"
          title={createTooltipElement(statusRemark)}
        >
          <StyledImg
            src={tooltipIcon}
            alt="Tooltip"
            $width="16px"
            $height="16px"
          />
        </CustomTooltip>
      ) : null}
    </StyledDiv>
  );
};

DocumentStatus.propTypes = {
  status: PropTypes.string,
  showTooltip: PropTypes.bool,
  statusRemarks: PropTypes.array,
  tooltipIcon: PropTypes.string,
};

export default DocumentStatus;
