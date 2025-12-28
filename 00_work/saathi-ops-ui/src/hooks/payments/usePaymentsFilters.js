import { useState, useEffect } from 'react';
import { generateSearchParams } from '../../utils/helper';
import {
  INCOMING_PAYMENT_FILTERS,
  REFUND_PAYMENT_FILTERS,
} from '../../constants';
const usePaymentFilter = (
  setTotalFiltersCount,
  setFilterKeys,
  toggleDrawer,
  navigate,
  searchParams,
  pageType,
  setCurrentPage,
) => {
  const [paymentCheckboxes, setPaymentCheckBoxes] = useState(
    pageType === 'refund' ? REFUND_PAYMENT_FILTERS : INCOMING_PAYMENT_FILTERS,
  );

  useEffect(() => {
    let filterString = '';
    const paymentFilterStatus = searchParams.get('paymentFilterStatus');
    if (paymentFilterStatus) {
      const paymentFilterStatusArray = paymentFilterStatus.split(',');
      setPaymentCheckBoxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return paymentFilterStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&paymentFilterStatus=${paymentFilterStatus}`;
    }
    setFilterKeys(filterString);
  }, []);

  useEffect(() => {
    let totalFilters = 0;
    totalFilters += paymentCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    setTotalFiltersCount(totalFilters);
  }, [paymentCheckboxes]);

  const clearFilters = () => {
    setPaymentCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    searchParams?.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys('');
    toggleDrawer();
    navigate(`/${pageType}`, { replace: true });
  };

  const handlePaymentCheckboxChange = (value) => {
    setPaymentCheckBoxes((prevCheckboxes) => {
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
    if (getCheckedKeysString(paymentCheckboxes)?.length > 0) {
      filterString += `&paymentFilterStatus=${getCheckedKeysString(paymentCheckboxes)}`;
      searchParams?.set(
        'paymentFilterStatus',
        getCheckedKeysString(paymentCheckboxes),
      );
    }

    if (!getCheckedKeysString(paymentCheckboxes)) {
      searchParams.delete('paymentFilterStatus');
    }
    searchParams?.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys(filterString);
    toggleDrawer();
    const queryString = generateSearchParams(searchParams);
    navigate(`/${pageType}?${queryString}`, { replace: true });
  };

  return {
    paymentCheckboxes,
    handlePaymentCheckboxChange,
    clearFilters,
    handleApplyClick,
  };
};
export default usePaymentFilter;
