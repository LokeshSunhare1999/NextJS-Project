import React, { useEffect, useState } from 'react';
import { findKeyByValue, formatDate } from '../../utils/helper';
import IMAGES from '../../assets/images';
import { companyTypeMap } from '../../constants/employer';

const useParseBusinessVerificationData = (employerData, pageRoute) => {
  const [pageData, setPageData] = useState();
  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    populateDataByPage();
  }, [employerData]);

  const populateDataByPage = () => {
    if (!employerData) return;
    let verificationData = {};
    switch (pageRoute) {
      case 'gst':
        verificationData = {
          imgUrls: employerData?.GST?.url
            ? [
                {
                  image: employerData?.GST?.url,
                  title: 'GST',
                },
              ]
            : [],
          'GST Number': employerData?.GST?.number || '-----',
          submissionTime:
            formatDate(employerData?.GST?.submittedAt, 'DD-MMM-YYYY h:mm a') ||
            '-----',
          registrationType:
            findKeyByValue(companyTypeMap, employerData?.companyType) ||
            '-----',
          verificationStatus: employerData?.GST?.verificationStatus || '-----',
          lastUpdatedTime:
            formatDate(
              employerData?.GST?.lastUpdatedAt,
              'DD-MMM-YYYY h:mm a',
            ) || '-----',
          'Company Name': employerData?.GST?.thirdPartyCompanyName || '-----',
          possibleStates: employerData?.GST?.nextPossibleStates || [],
          matchingScore: `${employerData?.GST?.matchingScore}%` || '-----',
          hypervergeResponse: employerData?.GST?.vendorResponse || '-----',
          referenceId: employerData?.GST?.vendorTransactionId || '-----',
        };
        setRemarks(employerData?.GST?.remarks || []);
        break;
      case 'cin':
        verificationData = {
          imgUrls: employerData?.CIN?.url
            ? [
                {
                  image: employerData?.CIN?.url,
                  title: 'CIN',
                },
              ]
            : [],
          verificationStatus: employerData?.CIN?.verificationStatus || '-----',
          CIN: employerData?.CIN?.number || '-----',
          submissionTime:
            formatDate(employerData?.CIN?.submittedAt, 'DD-MMM-YYYY h:mm a') ||
            '-----',
          registrationType:
            findKeyByValue(companyTypeMap, employerData?.companyType) ||
            '-----',
          'Last Updated Time':
            formatDate(
              employerData?.CIN?.lastUpdatedAt,
              'DD-MMM-YYYY h:mm a',
            ) || '-----',
          'Company Name': employerData?.CIN?.thirdPartyCompanyName || '-----',
          possibleStates: employerData?.CIN?.nextPossibleStates || [],
          matchingScore: `${employerData?.CIN?.matchingScore}%` || '-----',
          hypervergeResponse: employerData?.CIN?.vendorResponse || '-----',
          referenceId: employerData?.CIN?.vendorTransactionId || '-----',
        };
        setRemarks(employerData?.CIN?.remarks || []);
        break;
      case 'pan':
        verificationData = {
          imgUrls: employerData?.PAN?.url
            ? [
                {
                  image: employerData?.PAN?.url,
                  title: 'PAN',
                },
              ]
            : [],
          verificationStatus: employerData?.PAN?.verificationStatus || '-----',
          registrationType:
            findKeyByValue(companyTypeMap, employerData?.companyType) ||
            '-----',
          'Date of Submission':
            formatDate(employerData?.PAN?.submittedAt, 'DD-MMM-YYYY h:mm a') ||
            '-----',
          'Company Name': employerData?.PAN?.thirdPartyCompanyName || '-----',
          'Last Updated Time':
            formatDate(
              employerData?.PAN?.lastUpdatedAt,
              'DD-MMM-YYYY h:mm a',
            ) || '-----',
          possibleStates: employerData?.PAN?.nextPossibleStates || [],
          matchingScore: `${employerData?.PAN?.matchingScore}%` || '-----',
          hypervergeResponse: employerData?.PAN?.vendorResponse || '-----',
          referenceId: employerData?.PAN?.vendorTransactionId || '-----',
        };
        setRemarks(employerData?.PAN?.remarks || []);
        break;
      case 'aadhaar':
        verificationData = {
          imgUrls: employerData?.AADHAAR?.url
            ? [
                {
                  image: employerData?.AADHAAR?.url,
                  title: 'AADHAAR',
                },
              ]
            : [],
          verificationStatus:
            employerData?.AADHAAR?.verificationStatus || '-----',
          registrationType:
            findKeyByValue(companyTypeMap, employerData?.companyType) ||
            '-----',
          'Date of Submission':
            formatDate(
              employerData?.AADHAAR?.submittedAt,
              'DD-MMM-YYYY h:mm a',
            ) || '-----',
          'Company Name':
            employerData?.AADHAAR?.thirdPartyCompanyName || '-----',
          'Last Updated Time':
            formatDate(
              employerData?.AADHAAR?.lastUpdatedAt,
              'DD-MMM-YYYY h:mm a',
            ) || '-----',
          possibleStates: employerData?.AADHAAR?.nextPossibleStates || [],
          matchingScore: `${employerData?.AADHAAR?.matchingScore}%` || '-----',
          hypervergeResponse: employerData?.AADHAAR?.vendorResponse || '-----',
          referenceId: employerData?.AADHAAR?.vendorTransactionId || '-----',
        };
        setRemarks(employerData?.AADHAAR?.remarks || []);
        break;
      case 'llpin':
        verificationData = {
          imgUrls: employerData?.LLPIN?.url
            ? [
                {
                  image: employerData?.LLPIN?.url,
                  title: 'LLPIN',
                },
              ]
            : [],
          verificationStatus:
            employerData?.LLPIN?.verificationStatus || '-----',
          LLPIN: employerData?.LLPIN?.number || '-----',
          submissionTime:
            formatDate(
              employerData?.LLPIN?.submittedAt,
              'DD-MMM-YYYY h:mm a',
            ) || '-----',
          registrationType:
            findKeyByValue(companyTypeMap, employerData?.companyType) ||
            '-----',
          'Last Updated Time':
            formatDate(
              employerData?.LLPIN?.lastUpdatedAt,
              'DD-MMM-YYYY h:mm a',
            ) || '-----',
          'Company Name': employerData?.LLPIN?.thirdPartyCompanyName || '-----',
          possibleStates: employerData?.LLPIN?.nextPossibleStates || '-----',
          matchingScore: `${employerData?.LLPIN?.matchingScore}%` || '-----',
          hypervergeResponse: employerData?.LLPIN?.vendorResponse || '-----',
          referenceId: employerData?.LLPIN?.vendorTransactionId || '-----',
        };
        setRemarks(employerData?.LLPIN?.remarks || []);
        break;
    }
    setPageData(verificationData);
  };

  return {
    pageData,
    remarks,
  };
};

export default useParseBusinessVerificationData;
