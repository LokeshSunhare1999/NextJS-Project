import ICONS from '../../assets/icons';
import { capitalizeFirstLetter } from '../../utils/helper';

const useCustomerTestProgress = (courseObj) => {
  const progressHeaders = Array.from(
    (courseObj?.testContent?.headers || [])?.map((item) => item?.value),
  );

  const progressHeaderKeys = Array.from(
    (courseObj?.testContent?.headers || [])?.map((item) => item?.key),
  );

  const progressHeaderTypes = Array.from(
    (courseObj?.testContent?.headers || [])?.map((item) => item?.type),
  );

  const createData = (courseDetails) => {
    return progressHeaderKeys.map((item) => courseDetails[item]);
  };

  const progressRows = Array.from(
    (courseObj?.testContent?.testContent || []).map((item) => createData(item)),
  );

  const certificateLink = courseObj?.certificateLink || '';
  const medalLink = courseObj?.medalLink || '';

  const medalCount = courseObj?.achievements?.medalCount || 0;
  const medalType = courseObj?.achievements?.medalType || '';
  const certificateCount = courseObj?.achievements?.certificateCount || 0;

  const handleMedalClick = () => {
    window.open(medalLink, '_blank');
  };

  const handleCertificateClick = () => {
    window.open(certificateLink, '_blank');
  };

  const rewardObj = [
    {
      count: null,
      title:
        medalType !== 'NONE'
          ? `${capitalizeFirstLetter(medalType)} Medal`
          : null,
      icon: medalType !== 'NONE' ? ICONS?.[`${medalType}_MEDAL`] : null,
    },
    {
      count: certificateCount,
      title: 'Certificate',
      icon: ICONS.CERTIFICATE,
    },
  ];

  return {
    progressHeaders,
    progressHeaderKeys,
    progressHeaderTypes,
    progressRows,
    certificateLink,
    medalLink,
    rewardObj,
    handleCertificateClick,
    handleMedalClick,
  };
};

export default useCustomerTestProgress;
