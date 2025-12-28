import { useEffect, useState } from 'react';
import { generateSearchParams } from '../../utils/helper';
import {
  TYPE_CHECKBOXES,
  VERIFICATION_CHECKBOXES,
  ACTIVATION_CHECKBOXES,
} from '../../constants/employer';

const useEmployerFilter = (
  setTotalFiltersCount,
  setFilterKeys,
  toggleDrawer,
  navigate,
  searchParams,
  setCurrentPage,
) => {
  const [employerTypeCheckboxes, setEmployerTypeCheckboxes] =
    useState(TYPE_CHECKBOXES);
  const [employerVerificationCheckboxes, setEmployerVerificationCheckboxes] =
    useState(VERIFICATION_CHECKBOXES);
  const [employerActivationCheckBoxes, setEmployerActivationCheckBoxes] =
    useState(ACTIVATION_CHECKBOXES);

  useEffect(() => {
    let filterString = '';
    const filterAgencyType = searchParams.get('filterAgencyType');

    if (filterAgencyType) {
      const filterAgencyTypeArray = filterAgencyType.split(',');
      setEmployerTypeCheckboxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return filterAgencyTypeArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&filterAgencyType=${filterAgencyType}`;
    }
    const filterVerificationStatus = searchParams.get(
      'filterVerificationStatus',
    );
    if (filterVerificationStatus) {
      const filterVerificationStatusArray = filterVerificationStatus.split(',');
      setEmployerVerificationCheckboxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return filterVerificationStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&filterVerificationStatus=${filterVerificationStatus}`;
    }
    const filterActivationStatus = searchParams.get('filterActivationStatus');
    if (filterActivationStatus) {
      const filterActivationStatusArray = filterActivationStatus.split(',');
      setEmployerActivationCheckBoxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return filterActivationStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&filterActivationStatus=${filterActivationStatus}`;
    }

    setFilterKeys(filterString);
  }, []);

  useEffect(() => {
    let totalFilters = 0;
    totalFilters += employerTypeCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += employerActivationCheckBoxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += employerVerificationCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;

    setTotalFiltersCount(totalFilters);
  }, [
    employerTypeCheckboxes,
    employerActivationCheckBoxes,
    employerVerificationCheckboxes,
  ]);

  const clearFilters = () => {
    setEmployerTypeCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setEmployerVerificationCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setEmployerActivationCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });

    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys('');
    toggleDrawer();
    navigate(`/employers`, { replace: true });
  };

  const handleEmployerTypeCheckboxeChange = (value) => {
    setEmployerTypeCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };
  const handleEmployerVerificationCheckboxChange = (value) => {
    setEmployerVerificationCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };
  const handleEmployerActivationCheckboxChange = (value) => {
    setEmployerActivationCheckBoxes((prevCheckboxes) => {
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
    if (getCheckedKeysString(employerTypeCheckboxes)?.length > 0) {
      filterString += `&filterAgencyType=${getCheckedKeysString(employerTypeCheckboxes)}`;
      searchParams.set(
        'filterAgencyType',
        getCheckedKeysString(employerTypeCheckboxes),
      );
    }
    if (!getCheckedKeysString(employerTypeCheckboxes)) {
      searchParams.delete('filterAgencyType');
    }
    if (getCheckedKeysString(employerActivationCheckBoxes)?.length > 0) {
      filterString += `&filterActivationStatus=${getCheckedKeysString(employerActivationCheckBoxes)}`;
      searchParams.set(
        'filterActivationStatus',
        getCheckedKeysString(employerActivationCheckBoxes),
      );
    }
    if (!getCheckedKeysString(employerActivationCheckBoxes)) {
      searchParams.delete('filterActivationStatus');
    }
    if (getCheckedKeysString(employerVerificationCheckboxes)?.length > 0) {
      filterString += `&filterVerificationStatus=${getCheckedKeysString(employerVerificationCheckboxes)}`;
      searchParams.set(
        'filterVerificationStatus',
        getCheckedKeysString(employerVerificationCheckboxes),
      );
    }
    if (!getCheckedKeysString(employerVerificationCheckboxes)) {
      searchParams.delete('filterVerificationStatus');
    }

    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys(filterString);
    toggleDrawer();

    const queryString = generateSearchParams(searchParams);
    navigate(`/employers?${queryString}`, { replace: true });
  };
  return {
    employerTypeCheckboxes,
    employerVerificationCheckboxes,
    employerActivationCheckBoxes,
    handleEmployerTypeCheckboxeChange,
    handleEmployerActivationCheckboxChange,
    handleEmployerVerificationCheckboxChange,
    handleApplyClick,
    clearFilters,
  };
};
export default useEmployerFilter;
