import { useState, useEffect } from 'react';
import { generateSearchParams } from '../../utils/helper';

const useOrderFilter = (
  setTotalFiltersCount,
  setFilterKeys,
  toggleDrawer,
  navigate,
  searchParams,
  setCurrentPage,
) => {
  const [orderCheckboxes, setOrderCheckboxes] = useState([
    { key: 'DRAFT', value: 'Draft', checked: false },
    { key: 'INITIATED', value: 'Initiated', checked: false },
    { key: 'PENDING', value: 'Pending', checked: false },
    { key: 'FAILED', value: 'Failed', checked: false },
    { key: 'CANCELLED', value: 'Cancelled', checked: false },
    { key: 'COMPLETED', value: 'Completed', checked: false },
    { key: 'REFUNDED', value: 'Refunded', checked: false },
    { key: 'AUTO_REFUNDED', value: 'Auto Refunded', checked: false },
  ]);
  const [orderTypeCheckboxes, setOrderTypeCheckboxes] = useState([
    { key: 'PAYMENT', value: 'Payment', checked: false },
    { key: 'PAYOUT', value: 'Payout', checked: false },
  ]);
  useEffect(() => {
    let filterString = '';
    const orderFilterStatus = searchParams.get('orderFilterStatus');
    if (orderFilterStatus) {
      const orderFilterStatusArray = orderFilterStatus.split(',');
      setOrderCheckboxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return orderFilterStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&orderFilterStatus=${orderFilterStatus}`;
    }
    const orderType = searchParams.get('orderType');

    if (orderType) {
      const orderTypeArray = orderType.split(',');
      setOrderTypeCheckboxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return orderTypeArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&orderType=${orderType}`;
    }
    setFilterKeys(filterString);
  }, []);

  useEffect(() => {
    let totalFilters = 0;
    totalFilters += orderCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    setTotalFiltersCount(totalFilters);
  }, [orderCheckboxes]);

  const handleOrderCheckboxChange = (value) => {
    setOrderCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  useEffect(() => {
    let totalFilters = 0;
    totalFilters += orderCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += orderTypeCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    setTotalFiltersCount(totalFilters);
  }, [orderCheckboxes, orderTypeCheckboxes]);

  const handleOrderTypeCheckboxes = (value) => {
    setOrderTypeCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const clearFilters = () => {
    setOrderCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setOrderTypeCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys('');
    toggleDrawer();
    navigate(`/orders`, { replace: true });
  };
  const getCheckedKeysString = (checkBoxes) => {
    const checkedKeys = checkBoxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.key);
    return checkedKeys.join(',');
  };

  const handleApplyClick = () => {
    let filterString = '';
    if (getCheckedKeysString(orderCheckboxes)?.length > 0) {
      filterString += `&orderFilterStatus=${getCheckedKeysString(orderCheckboxes)}`;
      searchParams.set(
        'orderFilterStatus',
        getCheckedKeysString(orderCheckboxes),
      );
    }
    if (!getCheckedKeysString(orderCheckboxes)) {
      searchParams.delete('orderFilterStatus');
    }
    if (getCheckedKeysString(orderTypeCheckboxes)?.length > 0) {
      filterString += `&orderType=${getCheckedKeysString(orderTypeCheckboxes)}`;
      searchParams.set('orderType', getCheckedKeysString(orderTypeCheckboxes));
    }
    if (!getCheckedKeysString(orderTypeCheckboxes)) {
      searchParams.delete('orderType');
    }
    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys(filterString);
    toggleDrawer();

    const queryString = generateSearchParams(searchParams);

    navigate(`/orders?${queryString}`, { replace: true });
  };
  return {
    orderCheckboxes,
    handleOrderCheckboxChange,
    clearFilters,
    handleApplyClick,
    orderTypeCheckboxes,
    handleOrderTypeCheckboxes,
  };
};
export default useOrderFilter;
