import { useState, useEffect } from 'react';

const useCustomerReferralFilter = (
  customerReferrerDetails,
  setTotalFiltersCount,
  toggleDrawer,
  setCurrentPage,
  searchParams,
  customerId,
  navigate,
) => {
  const [referralLevelCheckboxes, setReferralLevelCheckboxes] = useState([
    { key: 'L-1', value: 'L-1', checked: false },
    { key: 'L-2', value: 'L-2', checked: false },
    { key: 'L-3', value: 'L-3', checked: false },
    { key: 'L-4', value: 'L-4', checked: false },
    { key: 'L-5', value: 'L-5', checked: false },
  ]);
  const [milestoneCheckboxes, setMilestoneCheckboxes] = useState([
    { key: 'True Id Purchased', value: 'True Id Purchased', checked: false },
    { key: 'User Signup', value: 'User Signup', checked: false },
  ]);

  const [referralLevelFilter, setReferralLevelFilter] = useState([]);
  const [milestoneFilter, setMilestoneFilter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const referralLevelArray =
      searchParams.get('referralLevel')?.split(',') || [];
    const milestoneArray = searchParams.get('milestone')?.split(',') || [];

    setReferralLevelCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) => ({
        ...checkbox,
        checked: referralLevelArray.includes(checkbox.key),
      })),
    );
    setReferralLevelFilter(referralLevelArray);

    setMilestoneCheckboxes((prevCheckboxes) =>
      prevCheckboxes.map((checkbox) => ({
        ...checkbox,
        checked: milestoneArray.includes(checkbox.key),
      })),
    );
    setMilestoneFilter(milestoneArray);

    const filteredData =
      customerReferrerDetails?.filter(
        (data) =>
          (!milestoneArray.length ||
            milestoneArray.includes(data?.milestone)) &&
          (!referralLevelArray.length ||
            referralLevelArray.includes(data?.level)),
      ) || [];
    setFilteredData(filteredData);
  }, [searchParams, customerReferrerDetails]);

  useEffect(() => {
    const selectedReferralLevels =
      referralLevelCheckboxes
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.key) || [];

    const selectedMilestones =
      milestoneCheckboxes
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.key) || [];

    setMilestoneFilter(selectedMilestones);
    setReferralLevelFilter(selectedReferralLevels);

    setTotalFiltersCount(
      selectedReferralLevels.length + selectedMilestones.length,
    );
  }, [
    referralLevelCheckboxes,
    milestoneCheckboxes,
    setMilestoneFilter,
    setReferralLevelFilter,
    setTotalFiltersCount,
  ]);

  const handleReferralLeveCheckboxChange = (key) => {
    setReferralLevelCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.key === key
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  useEffect(() => {
    let totalFilters = 0;
    totalFilters += referralLevelCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += milestoneCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    setTotalFiltersCount(totalFilters);
  }, [referralLevelCheckboxes, milestoneCheckboxes]);

  const handleMilestoneCheckboxes = (key) => {
    setMilestoneCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.key === key
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const clearFilters = () => {
    setReferralLevelCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setMilestoneCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setFilteredData(customerReferrerDetails || []);
    setCurrentPage(1);
    setMilestoneFilter([]);
    toggleDrawer();
    navigate(`/customers/${customerId}?tab=referral`, { replace: true });
  };

  const getCheckedKeysString = (checkBoxes) => {
    const checkedKeys = checkBoxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.key);

    return checkedKeys.join(',');
  };

  const handleApplyClick = () => {
    const searchParamsString = new URLSearchParams();

    const referralLevelString = getCheckedKeysString(referralLevelCheckboxes);
    if (referralLevelString?.length > 0) {
      searchParamsString.set('referralLevel', referralLevelString);
    }

    const milestoneString = getCheckedKeysString(milestoneCheckboxes);
    if (milestoneString?.length > 0) {
      searchParamsString.set('milestone', milestoneString);
    }

    const filteredData =
      customerReferrerDetails?.filter(
        (data) =>
          (!milestoneFilter.length ||
            milestoneFilter.includes(data?.milestone)) &&
          (!referralLevelFilter.length ||
            referralLevelFilter.includes(data?.level)),
      ) || [];
    setFilteredData(filteredData);

    const filterString = searchParamsString.toString();
    navigate(`/customers/${customerId}?tab=referral&${filterString}`, {
      replace: true,
    });
    setCurrentPage(1);
    toggleDrawer();
  };

  return {
    referralLevelCheckboxes,
    handleReferralLeveCheckboxChange,
    clearFilters,
    handleApplyClick,
    milestoneCheckboxes,
    handleMilestoneCheckboxes,
    filteredData,
  };
};
export default useCustomerReferralFilter;
