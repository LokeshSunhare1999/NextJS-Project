import { useState, useEffect } from 'react';

const useCampaignDetails = (
  campaignData,
  campaignTableHeadersData,
) => {
  function createData(campaignDetails) {
    const headerKeys = Array.from(
      campaignTableHeadersData?.map((item) => item.key),
    );
    return headerKeys?.map((item) => campaignDetails[item] ?? '-----');
  }

  const tableHeaders = Array.from(
    campaignTableHeadersData.map((item) => item.value),
  );

  const headerTypes = campaignTableHeadersData?.map((item) => item.type) || [];

  const rows = Array.from(campaignData.map((item) => createData(item)));

  return {
    tableHeaders,
    headerTypes,
    rows,
  };
};
export default useCampaignDetails;
