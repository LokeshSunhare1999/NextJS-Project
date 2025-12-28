import React from 'react';

const DocumentStatus = ({ item }) => {
  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'purchased':
        return {
          title: 'Purchased',
          textColor: '#3B2B8C',
        };
      case 'refunded':
        return {
          title: 'Refunded',
          textColor: '#03B4FF',
        };
      case 'failed':
        return {
          title: 'Failed',
          textColor: '#ED2F2F',
        };
      case 'success':
        return {
          title: 'Success',
          textColor: '#32B237',
        };
      case 'transferred':
        return {
          title: 'Transferred',
          textColor: '#32B237',
        };
      case 'new':
        return {
          title: 'New',
          textColor: '#009797',
        };
      case 'created':
        return {
          title: 'Created',
          textColor: '#2F59ED',
        };
      case 'assigned':
        return {
          title: 'Assigned',
          textColor: '#2F59ED',
        };
      case 'completed':
        return {
          title: 'Completed',
          textColor: '#32B237',
        };
      case 'cancelled':
        return {
          title: 'Cancelled',
          textColor: '#ED2F2F',
        };
      case 'processing':
        return {
          title: 'Processing',
          textColor: '#F3BB06',
        };
      case 'not_initiated':
        return {
          title: 'Not Initiated',
          textColor: '#797979',
        };
      case 'draft':
        return {
          title: 'Draft',
          textColor: '#797979',
        };

      case 'manualreview':
        return {
          title: 'Manual Review',
          textColor: '#F3BB06',
        };
      case 'pending':
        return {
          title: 'Pending',
          textColor: '#F3BB06',
        };

      case 'in_progress':
        return {
          title: 'In Progress',
          textColor: '#F3BB06',
        };

      case 'pass':
        return {
          title: 'Pass',
          textColor: '#32B237',
        };

      case 'fail':
        return {
          title: 'Fail',
          textColor: '#ED2F2F',
        };

      case 'activated':
      case 'ops_verified':
      case 'verified':
        return {
          title: 'Verified',
          textColor: '#32B237',
        };

      case 'ops_rejected':
      case 'rejected':
        return {
          title: 'Rejected',
          textColor: '#ED2F2F',
        };
      case 'lead':
        return {
          title: 'Lead',
          textColor: '#F3BB06',
        };
      case 'free':
        return {
          title: 'Free',
          textColor: '#797979',
        };

      case 'not_started':
        return {
          title: 'Yet To Start',
          textColor: '#1A79FF',
        };
      case 'paid':
        return {
          title: 'Paid',
          textColor: '#32B237',
        };
      case undefined:
      case null:
      case '-----':
        return {
          title: '-----',
          textColor: '#FFF',
          noPadding: true,
        };
      default:
        return {
          title: status,
          textColor: '#FFD75D',
        };
    }
  };
  const statusDetails = getStatusDetails(item);

  return (
    <span
      className="font-medium"
      style={{
        color: statusDetails?.textColor,
      }}
    >
      {statusDetails?.title}
    </span>
  );
};

export default DocumentStatus;
