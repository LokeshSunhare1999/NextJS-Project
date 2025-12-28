import ICONS from '../../assets/icons';

const useCustomerCourseProgress = (courseObj) => {
  const progressHeaders = Array.from(
    (courseObj?.courseContent?.headers || [])?.map((item) => item?.value),
  );

  const progressHeaderKeys = Array.from(
    (courseObj?.courseContent?.headers || [])?.map((item) => item?.key),
  );

  const progressHeaderTypes = Array.from(
    (courseObj?.courseContent?.headers || [])?.map((item) => item?.type),
  );

  const createData = (courseDetails) => {
    return progressHeaderKeys.map((item) => courseDetails[item]);
  };

  const progressRows = Array.from(
    (courseObj?.courseContent?.courseContent || []).map((item) =>
      createData(item),
    ),
  );

  const certificateLink = courseObj?.certificateLink || '';
  const trophyLink = courseObj?.trophyLink || '';

  const badgeCount = courseObj?.achievements?.badgeCount || 0;
  const trophyCount = courseObj?.achievements?.trophyCount || 0;
  const certificateCount = courseObj?.achievements?.certificateCount || 0;

  const handleTrophyClick = () => {
    window.open(trophyLink, '_blank');
  };

  const handleCertificateClick = () => {
    window.open(certificateLink, '_blank');
  };

  const rewardObj = [
    {
      count: badgeCount,
      title: 'Badges',
      icon: ICONS.BADGE,
    },
    {
      count: trophyCount,
      title: 'Trophy',
      icon: ICONS.TROPHY,
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
    trophyLink,
    rewardObj,
    handleCertificateClick,
    handleTrophyClick,
  };
};

export default useCustomerCourseProgress;
