import { useEmpReferralEarnDetails } from '../../apis/queryHooks';
import { RUPEE_SYMBOL } from '../../constants/details';
import { getValueSuffix } from '../../utils/helper';

const useEmployerReferralHistory = (id, type) => {
  const {
    data: employerReferralHistoryData,
    error: employerReferralHistoryError,
    isError: isEmployerReferralHistoryError,
  } = useEmpReferralEarnDetails(id, type);

  const errorCode = employerReferralHistoryError?.response?.status;

  const employerReferralHistoryDetails =
    employerReferralHistoryData || [];

  function createData(item) {
    const { amountForLevel, level, totalAmountEarned, userCount } = item;
    const suffix = getValueSuffix(parseInt(level));

    return [`${suffix}(${RUPEE_SYMBOL} ${amountForLevel})`, userCount, totalAmountEarned];
  }

  const employerReferralHistoryRows =
    Array.from(
      employerReferralHistoryDetails?.map((item) => createData(item)),
    ) || [];
  return {
    employerReferralHistoryRows,
    errorCode,
    isEmployerReferralHistoryError,
  };
};

export default useEmployerReferralHistory;
