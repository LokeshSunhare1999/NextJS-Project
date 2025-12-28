import { useEffect, useState } from 'react';
import { generateSearchParams } from '../../utils/helper';
import { VERIFICATION_CHECKBOXES } from '../../constants/employer';

const usePayoutFilter = (
  setTotalFiltersCount,
  setFilterKeys,
  toggleDrawer,
  navigate,
  searchParams,
  setCurrentPage,
  setItemsPerPage,
) => {
  const [payoutCheckboxes, setPayoutCheckBoxes] = useState(
    VERIFICATION_CHECKBOXES,
  );

  useEffect(() => {
    let filterString = '';
    const paymentStatus = searchParams.get('paymentStatus');
    if (paymentStatus) {
      const paymentStatusArray = paymentStatus.split(',');
      setPayoutCheckBoxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return paymentStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&paymentStatus=${paymentStatus}`;
    }
    setFilterKeys(filterString);
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, []);

  useEffect(() => {
    let totalFilters = 0;
    totalFilters += payoutCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    setTotalFiltersCount(totalFilters);
  }, [payoutCheckboxes]);

  const handlePayoutCheckboxChange = (value) => {
    setPayoutCheckBoxes((prevCheckboxes) => {
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

  const handleApplyClick = () => {
    let filterString = '';
    if (getCheckedKeysString(payoutCheckboxes)?.length > 0) {
      filterString += `&paymentStatus=${getCheckedKeysString(payoutCheckboxes)}`;
      searchParams?.set(
        'paymentStatus',
        getCheckedKeysString(payoutCheckboxes),
      );
    }
    if (!getCheckedKeysString(payoutCheckboxes)) {
      searchParams.delete('paymentStatus');
    }
    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys(filterString);
    toggleDrawer();
    const queryString = generateSearchParams(searchParams);
    navigate(`/payouts?${queryString}`, { replace: true });
  };

  const clearFilters = () => {
    setPayoutCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys('');
    toggleDrawer();
    navigate(`/payouts`, { replace: true });
  };

  return {
    payoutCheckboxes,
    handleApplyClick,
    handlePayoutCheckboxChange,
    clearFilters,
  };
};
export default usePayoutFilter;
