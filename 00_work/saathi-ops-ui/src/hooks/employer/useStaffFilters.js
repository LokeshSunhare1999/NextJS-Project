import { useState, useEffect } from 'react';
import { STAFF_CHECKBOXES } from '../../constants/employer';
import { generateSearchParams } from '../../utils/helper';

const useStaffFilter = (
  setTotalFiltersCount,
  setFilterKeys,
  toggleDrawer,
  searchParams,
  navigate,
  staffingAgencyId,
  setCurrentPage,
) => {
  const [staffCheckboxes, setStaffCheckBoxes] = useState(STAFF_CHECKBOXES);
  useEffect(() => {
    let filterString = '';
    const trueIdVerificationStatus = searchParams.get(
      'trueIdVerificationStatus',
    );
    if (trueIdVerificationStatus) {
      const trueIdVerificationStatusArray = trueIdVerificationStatus.split(',');
      setStaffCheckBoxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return trueIdVerificationStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&trueIdVerificationStatus=${trueIdVerificationStatus}`;
    }
    setFilterKeys(filterString);
  }, []);
  useEffect(() => {
    let filterString = '';
    const trueIdVerificationStatus = searchParams.get(
      'trueIdVerificationStatus',
    );
    if (trueIdVerificationStatus) {
      const trueIdVerificationStatusArray = trueIdVerificationStatus.split(',');
      setStaffCheckBoxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return trueIdVerificationStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&trueIdVerificationStatus=${trueIdVerificationStatus}`;
    }
    setFilterKeys(filterString);
  }, []);
  useEffect(() => {
    let totalFilters = 0;
    totalFilters += staffCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    setTotalFiltersCount(totalFilters);
  }, [staffCheckboxes]);
  const handleStaffCheckboxChange = (value) => {
    setStaffCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const getCheckedKeysString = (checkBoxes) => {
    const checkedKeys = checkBoxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.key);

    return checkedKeys.join(',');
  };
  const clearFilters = () => {
    setStaffCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys('');
    toggleDrawer();
    navigate(`/employers/${staffingAgencyId}?tab=staff`, {
      replace: true,
    });
  };
  const handleApplyClick = () => {
    let filterString = '';
    if (getCheckedKeysString(staffCheckboxes)?.length > 0) {
      filterString += `&trueIdVerificationStatus=${getCheckedKeysString(staffCheckboxes)}`;
      searchParams.set(
        'trueIdVerificationStatus',
        getCheckedKeysString(staffCheckboxes),
      );
    }
    if (!getCheckedKeysString(staffCheckboxes)) {
      searchParams.delete('trueIdVerificationStatus');
    }
    searchParams.set('currentPage', 1);
    setCurrentPage(1);

    setFilterKeys(filterString);
    toggleDrawer();
    const queryString = generateSearchParams(searchParams);
    navigate(`/employers/${staffingAgencyId}?${queryString}`, {
      replace: true,
    });
  };

  return {
    staffCheckboxes,
    handleStaffCheckboxChange,
    handleApplyClick,
    clearFilters,
  };
};
export default useStaffFilter;
