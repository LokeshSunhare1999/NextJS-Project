import { useEffect } from 'react';
import { useGetCustomerCourses } from '../../apis/queryHooks';

const CustomerCoursesDetails = (
  customerId,
  setTotalPurchasedCourses,
  actionIndex,
  setActionOpen,
  setOpenCustomerCourseDrawer,
  setOpenCustomerTestDrawer,
  setCourseObj,
) => {
  const {
    data: customerCoursesData,
    isLoading: customerCoursesDataLoading,
    isFetching: customerCoursesDataFetching,
  } = useGetCustomerCourses(customerId);

  // setTotalPurchasedCourses(customerCoursesData?.totalPurchasedCourses || 0);

  const customerCourses = customerCoursesData?.customerTrainings || [];
  const customerCoursesHeaders = customerCoursesData?.headers || [];

  const customerCourseTableHeaders = Array.from(
    customerCoursesHeaders.map((item) => item?.value),
  );
  const customerCourseKeys = Array.from(
    customerCoursesHeaders.map((item) => item?.key),
  );

  const certificateLinks = Array.from(
    customerCourses?.map((item) => item?.certificateLink),
  );

  const trophyLinks = Array.from(
    customerCourses?.map((item) => item?.trophyLink),
  );

  const medalLinks = Array.from(
    customerCourses?.map((item) => item?.medalLink),
  );

  function createData(courseDetails) {
    return customerCourseKeys.map((item) => courseDetails[item]);
  }

  const customerCourseRows = Array.from(
    customerCourses.map((item) => createData(item)),
  );

  useEffect(() => {
    if (customerCoursesData) {
      setTotalPurchasedCourses(customerCoursesData.totalPurchasedCourses);
    }
  }, [customerCoursesData]);

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    setCourseObj(customerCourses[actionIndex]);
    setOpenCustomerCourseDrawer(true);
    setActionOpen(false);
  };

  const handleTrophyClick = (e) => {
    e.stopPropagation();
    window?.open(trophyLinks[actionIndex], '_blank');
    setActionOpen(false);
  };

  const handleMedalClick = (e) => {
    e.stopPropagation();
    window?.open(medalLinks[actionIndex], '_blank');
    setActionOpen(false);
  };

  const handleCertificateClick = (e) => {
    e.stopPropagation();
    window?.open(certificateLinks[actionIndex], '_blank');
    setActionOpen(false);
  };

  const toggleCustomerCourseDrawer = (newOpen) => {
    setOpenCustomerCourseDrawer(newOpen);
  };

  const toggleCustomerTestDrawer = (newOpen) => {
    setOpenCustomerTestDrawer(newOpen);
  };

  const handleRowClick = (index) => {
    setCourseObj(customerCourses[index]);
    if (customerCourses[index]?.trainingType === 'COURSE')
      setOpenCustomerCourseDrawer(true);
    else setOpenCustomerTestDrawer(true);
  };

  return {
    customerCourses,
    customerCoursesHeaders,
    customerCourseTableHeaders,
    customerCourseKeys,
    customerCourseRows,
    handleDetailsClick,
    handleTrophyClick,
    handleCertificateClick,
    certificateLinks,
    trophyLinks,
    medalLinks,
    handleMedalClick,
    toggleCustomerCourseDrawer,
    toggleCustomerTestDrawer,
    handleRowClick,
  };
};
export default CustomerCoursesDetails;
