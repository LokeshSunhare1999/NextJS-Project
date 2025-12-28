import { useEmpCandidateReferralEarnDetails } from '../../apis/queryHooks';
import { RUPEE_SYMBOL } from '../../constants/details';
import { getValueSuffix } from '../../utils/helper';

const useEmployerCandidateReferralHistory = (id, candidateId, type) => {
  const {
    data: employerCandidateReferralHistoryData,
    error: employerCandidateReferralHistoryError,
    isError: isEmployerCandidateReferralHistoryError,
  } = useEmpCandidateReferralEarnDetails(id, candidateId, type);

  const errorCode = employerCandidateReferralHistoryError?.response?.status;

  const employerCandidateReferralHistoryDetails =
    employerCandidateReferralHistoryData || [];

  function createData(item) {
    const { amountForLevel, level, totalAmountEarned, userCount } = item;
    // const total = amountForLevel * userCount;
    const suffix = getValueSuffix(parseInt(level));

    return [`${suffix}(${RUPEE_SYMBOL} ${amountForLevel})`, userCount, totalAmountEarned ];
  }

  const employerCandidateReferralHistoryRows =
    Array.from(
      employerCandidateReferralHistoryDetails?.map((item) => createData(item)),
    ) || [];
    
  return {
    employerCandidateReferralHistoryRows,
    errorCode,
    isEmployerCandidateReferralHistoryError,
  };
};

export default useEmployerCandidateReferralHistory;
