import React, { useEffect, useState } from 'react';
import { formatDate, getValueBasedOnStatus } from '../utils/helper';

const useParseVerificationData = (customerData, pageRoute) => {
  const [pageData, setPageData] = useState();
  const [remarks, setRemarks] = useState([]);

  useEffect(() => {
    populateDataByPage();
  }, [customerData]);

  const populateDataByPage = () => {
    if (!customerData) return;
    let verificationData = {};
    const { trueId: trueIdData } = customerData;

    switch (pageRoute) {
      case 'live-photo':
        const livenessStatus = trueIdData?.liveness?.verificationStatus;
        verificationData = {
          imgUrls: getValueBasedOnStatus(
            [
              {
                image: trueIdData?.liveness?.photoUrl,
                title: 'Live Photo',
              },
            ],
            livenessStatus,
            [],
          ),
          livePhoto: getValueBasedOnStatus(
            trueIdData?.liveness?.livePhoto ? 'Yes' : 'No',
            livenessStatus,
          ),
          created: getValueBasedOnStatus(
            formatDate(trueIdData?.liveness?.createdAt, ' h:mm a, DD-MMM-YYYY'),
            livenessStatus,
          ),
          referenceId: getValueBasedOnStatus(
            trueIdData?.liveness?.vendorTransactionId,
            livenessStatus,
          ),
          verificationStatus: livenessStatus,
          hypervergeResponse: getValueBasedOnStatus(
            trueIdData?.liveness?.vendorResponse,
            livenessStatus,
          ),
          possibleStates: getValueBasedOnStatus(
            trueIdData?.liveness?.nextPossibleStates?.states || [],
            livenessStatus,
            [],
          ),
          showNotificationButton: getValueBasedOnStatus(
            trueIdData?.liveness?.nextPossibleStates
              ?.enableOpsNotificationButton,
            livenessStatus,
            false,
          ),
        };
        setRemarks(trueIdData?.liveness?.remarks || []);
        break;

      case 'aadhaar-verify':
        const aadhaarStatus = trueIdData?.aadhaar?.verificationStatus;

        verificationData = {
          name: getValueBasedOnStatus(trueIdData?.aadhaar?.name, aadhaarStatus),
          imgUrls: getValueBasedOnStatus(
            [
              {
                image: trueIdData?.aadhaar?.frontImageUrl,
                title: 'Aadhaar Front Image',
              },
              {
                image: trueIdData?.aadhaar?.backImageUrl,
                title: 'Aadhaar Back Image',
              },
            ],
            aadhaarStatus,
            [],
          ),
          verificationTime: getValueBasedOnStatus(
            formatDate(trueIdData?.aadhaar?.verifiedAt, ' DD-MMM-YYYY h:mm a'),
            aadhaarStatus,
          ),
          dateOfBirth: getValueBasedOnStatus(
            formatDate(trueIdData?.aadhaar?.dateOfBirth),
            aadhaarStatus,
          ),
          verificationType: getValueBasedOnStatus('OCR', aadhaarStatus),
          hypervergeResponse: getValueBasedOnStatus(
            trueIdData?.aadhaar?.vendorResponse,
            aadhaarStatus,
          ),
          gender: getValueBasedOnStatus(
            trueIdData?.aadhaar?.gender,
            aadhaarStatus,
          ),
          referenceId: getValueBasedOnStatus(
            trueIdData?.aadhaar?.vendorTransactionId,
            aadhaarStatus,
          ),
          aadhaarNumber: getValueBasedOnStatus(
            trueIdData?.aadhaar?.number,
            aadhaarStatus,
          ),
          possibleStates: getValueBasedOnStatus(
            trueIdData?.aadhaar?.nextPossibleStates?.states || [],
            aadhaarStatus,
            [],
          ),
          showNotificationButton: getValueBasedOnStatus(
            trueIdData?.aadhaar?.nextPossibleStates
              ?.enableOpsNotificationButton,
            aadhaarStatus,
            false,
          ),
          "Father's Name": getValueBasedOnStatus(
            trueIdData?.aadhaar?.fatherName,
            aadhaarStatus,
          ),
          address: getValueBasedOnStatus(
            trueIdData?.aadhaar?.address1,
            aadhaarStatus,
          ),
          verificationStatus: aadhaarStatus,
        };
        setRemarks(trueIdData?.aadhaar?.remarks || []);
        break;

      case 'dl-verify':
        const dlStatus = trueIdData?.drivingLicense?.verificationStatus;

        verificationData = {
          imgUrls: getValueBasedOnStatus(
            [
              {
                image: trueIdData?.faceMatchWithDrivingLicense?.idImageUrl,
                title: 'DL Photo',
              },
              {
                image: trueIdData?.faceMatchWithDrivingLicense?.imageUrl,
                title: 'Live Photo',
              },
            ],
            dlStatus,
            [],
          ),
          name: getValueBasedOnStatus(
            trueIdData?.drivingLicense?.name,
            dlStatus,
          ),
          'validity (TR)': getValueBasedOnStatus(
            formatDate(trueIdData?.drivingLicense?.validity?.transport),
            dlStatus,
          ),
          DLNumber: getValueBasedOnStatus(
            trueIdData?.drivingLicense?.number,
            dlStatus,
          ),
          'validity (NT)': getValueBasedOnStatus(
            formatDate(trueIdData?.drivingLicense?.validity?.nonTransport),
            dlStatus,
          ),
          "Father's Name": getValueBasedOnStatus(
            trueIdData?.drivingLicense?.fatherName,
            dlStatus,
          ),
          verificationTime: getValueBasedOnStatus(
            formatDate(
              trueIdData?.drivingLicense?.verificationTime,
              'DD-MMM-YYYY h:mm a',
            ),
            dlStatus,
          ),
          dateOfBirth: getValueBasedOnStatus(
            formatDate(trueIdData?.drivingLicense?.dob),
            dlStatus,
          ),
          verificationType: getValueBasedOnStatus('OCR', dlStatus),
          classOfVehicles: getValueBasedOnStatus(
            trueIdData?.drivingLicense?.covDetails?.reduce((acc, curr, idx) => {
              acc += curr?.cov;
              if (idx !== trueIdData?.drivingLicense?.covDetails.length - 1)
                acc += ', ';
              return acc;
            }, '') || '-----',
            dlStatus,
          ),
          referenceId: getValueBasedOnStatus(
            trueIdData?.drivingLicense?.vendorTransactionId,
            dlStatus,
          ),
          dateOfIssue: getValueBasedOnStatus(
            formatDate(
              trueIdData?.drivingLicense?.issueDate,
              'DD-MMM-YYYY, h:mm a',
            ),
            dlStatus,
          ),
          hypervergeResponse: getValueBasedOnStatus(
            trueIdData?.drivingLicense?.vendorResponse,
            dlStatus,
          ),
          address: getValueBasedOnStatus(
            trueIdData?.drivingLicense?.address,
            dlStatus,
          ),
          verificationStatus: dlStatus,
          possibleStates: getValueBasedOnStatus(
            trueIdData?.drivingLicense?.nextPossibleStates?.states || [],
            dlStatus,
            [],
          ),
          showNotificationButton: getValueBasedOnStatus(
            trueIdData?.drivingLicense?.nextPossibleStates
              ?.enableOpsNotificationButton,
            dlStatus,
            false,
          ),
        };
        setRemarks(trueIdData?.drivingLicense?.remarks || []);
        break;

      case 'aadhaar-live-photo':
        const aadhaarLiveStatus =
          trueIdData?.faceMatchWithAadhaar?.verificationStatus;
        verificationData = {
          matchingScore: getValueBasedOnStatus(
            `${trueIdData?.faceMatchWithAadhaar?.verificationData?.score?.toString()}% match`,
            aadhaarLiveStatus,
          ),
          lastUpdatedDate: getValueBasedOnStatus(
            formatDate(
              trueIdData?.faceMatchWithAadhaar?.updatedAt,
              'DD-MMM-YYYY, h:mm a',
            ),
            aadhaarLiveStatus,
          ),
          name: getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.name,
            aadhaarLiveStatus,
          ),
          "Father's Name": getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.fatherName,
            aadhaarLiveStatus,
          ),
          gender: getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.gender,
            aadhaarLiveStatus,
          ),
          referenceId: getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.vendorTransactionId,
            aadhaarLiveStatus,
          ),
          aadhaarNumber: getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.number,
            aadhaarLiveStatus,
          ),
          hypervergeResponse: getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.vendorResponse,
            aadhaarLiveStatus,
          ),
          address: getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.address1,
            aadhaarLiveStatus,
          ),
          imgUrls: getValueBasedOnStatus(
            [
              {
                image: trueIdData?.faceMatchWithAadhaar?.imageUrl,
                title: 'Live Photo',
              },
              {
                image: trueIdData?.faceMatchWithAadhaar?.idImageUrl,
                title: 'Aadhaar Image',
              },
            ],
            aadhaarLiveStatus,
            [],
          ),
          verificationStatus: aadhaarLiveStatus,
          possibleStates: getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.nextPossibleStates?.states || [],
            aadhaarLiveStatus,
            [],
          ),
          showNotificationButton: getValueBasedOnStatus(
            trueIdData?.faceMatchWithAadhaar?.nextPossibleStates
              ?.enableOpsNotificationButton,
            aadhaarLiveStatus,
            false,
          ),
        };
        setRemarks(trueIdData?.faceMatchWithAadhaar?.remarks || []);
        break;

      case 'dl-live-photo':
        const dlLivenessStatus =
          trueIdData?.faceMatchWithDrivingLicense?.verificationStatus;

        verificationData = {
          matchingScore: getValueBasedOnStatus(
            `${trueIdData?.faceMatchWithDrivingLicense?.verificationData?.score?.toString()}% match`,
            dlLivenessStatus,
          ),
          lastUpdatedDate: getValueBasedOnStatus(
            formatDate(
              trueIdData?.faceMatchWithDrivingLicense?.updatedAt,
              'DD-MMM-YYYY, h:mm a',
            ),
            dlLivenessStatus,
          ),
          name: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.name,
            dlLivenessStatus,
          ),
          dateOfIssue: getValueBasedOnStatus(
            formatDate(
              trueIdData?.faceMatchWithDrivingLicense?.issueDate,
              'DD-MMM-YYYY, h:mm a',
            ),
            dlLivenessStatus,
          ),
          DLNumber: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.number,
            dlLivenessStatus,
          ),
          'Validity (TR)': getValueBasedOnStatus(
            formatDate(
              trueIdData?.faceMatchWithDrivingLicense?.validity?.transport,
            ),
            dlLivenessStatus,
          ),
          gender: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.gender,
            dlLivenessStatus,
          ),
          'Validity (NT)': getValueBasedOnStatus(
            formatDate(
              trueIdData?.faceMatchWithDrivingLicense?.validity?.nonTransport,
            ),
            dlLivenessStatus,
          ),
          "Father's Name": getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.fatherName,
            dlLivenessStatus,
          ),
          referenceId: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.vendorTransactionId,
            dlLivenessStatus,
          ),
          dateOfBirth: getValueBasedOnStatus(
            formatDate(trueIdData?.faceMatchWithDrivingLicense?.dob),
            dlLivenessStatus,
          ),
          hypervergeResponse: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.vendorResponse,
            dlLivenessStatus,
          ),
          classOfVehicles: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.covDetails?.reduce(
              (acc, curr, idx) => {
                acc += curr?.cov;
                if (
                  idx !==
                  trueIdData?.faceMatchWithDrivingLicense?.covDetails.length - 1
                )
                  acc += ', ';
                return acc;
              },
              '',
            ) || '-----',
            dlLivenessStatus,
          ),
          address: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.address,
            dlLivenessStatus,
          ),
          imgUrls: getValueBasedOnStatus(
            [
              {
                image: trueIdData?.faceMatchWithDrivingLicense?.idImageUrl,
                title: 'DL Photo',
              },
              {
                image: trueIdData?.faceMatchWithDrivingLicense?.imageUrl,
                title: 'Live Photo',
              },
            ],
            dlLivenessStatus,
            [],
          ),
          verificationStatus: dlLivenessStatus,
          possibleStates: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.nextPossibleStates
              ?.states || [],
            dlLivenessStatus,
            [],
          ),
          showNotificationButton: getValueBasedOnStatus(
            trueIdData?.faceMatchWithDrivingLicense?.nextPossibleStates
              ?.enableOpsNotificationButton,
            dlLivenessStatus,
            false,
          ),
        };
        setRemarks(trueIdData?.faceMatchWithDrivingLicense?.remarks || []);
        break;

      case 'pan-verify':
        const panVerificationStatus = trueIdData?.pan?.verificationStatus;
        verificationData = {
          imgUrls: getValueBasedOnStatus(
            [
              {
                image: trueIdData?.pan?.imageUrl,
                title: 'Pan Card  Photo',
              },
            ],

            [],
          ),
          PAN: getValueBasedOnStatus(trueIdData?.pan?.number),
          verificationStatus: panVerificationStatus,
          Name: getValueBasedOnStatus(trueIdData?.pan?.name),
          submissionTime: getValueBasedOnStatus(
            formatDate(trueIdData?.pan?.createdAt, 'DD-MMM-YYYY, h:mm a'),
            panVerificationStatus,
          ),
          'Date of Birth': getValueBasedOnStatus(
            formatDate(trueIdData?.pan?.dateOfBirth),
            panVerificationStatus,
          ),
          lastUpdatedTime: getValueBasedOnStatus(
            formatDate(trueIdData?.pan?.updatedAt, 'DD-MMM-YYYY, h:mm a'),
            panVerificationStatus,
          ),
          hypervergeResponse: getValueBasedOnStatus(
            trueIdData?.pan?.vendorResponse,
            panVerificationStatus,
          ),
          referenceId: getValueBasedOnStatus(
            trueIdData?.pan?.vendorTransactionId,
            panVerificationStatus,
          ),
          possibleStates: getValueBasedOnStatus(
            trueIdData?.pan?.nextPossibleStates?.states || [],
            panVerificationStatus,
            [],
          ),
        };
        setRemarks(trueIdData?.pan?.remarks || []);
        break;
    }
    setPageData(verificationData);
  };

  return {
    pageData,
    remarks,
  };
};

export default useParseVerificationData;
