import { useState, useEffect } from 'react';
import { findKeyByValue, generateSearchParams } from '../../utils/helper';
import { VERIFICATION_FILTER_SECTIONS } from '../../constants/verification';

const useCustomerFilter = (
  setTotalFiltersCount,
  setFilterKeys,
  toggleDrawer,
  navigate,
  searchParams,
  setCurrentPage,
) => {
  const [verificationCheckboxes, setVerificationCheckboxes] = useState(
    Object.values(VERIFICATION_FILTER_SECTIONS)?.map((typeValue) => [
      {
        type: findKeyByValue(VERIFICATION_FILTER_SECTIONS, typeValue),
        key: 'VERIFIED',
        value: 'Verified',
        checked: false,
      },
      {
        type: findKeyByValue(VERIFICATION_FILTER_SECTIONS, typeValue),
        key: 'PENDING',
        value: 'Pending',
        checked: false,
      },
      {
        type: findKeyByValue(VERIFICATION_FILTER_SECTIONS, typeValue),
        key: 'REJECTED',
        value: 'Rejected',
        checked: false,
      },
      {
        type: findKeyByValue(VERIFICATION_FILTER_SECTIONS, typeValue),
        key: 'NOT_INITIATED',
        value: 'Yet to Start',
        checked: false,
      },
    ]),
  );
  const [workExCheckboxes, setWorkExCheckboxes] = useState([
    { key: 'VERIFIED', value: 'Verified', checked: false },
    { key: 'PENDING', value: 'Pending', checked: false },
    { key: 'REJECTED', value: 'Rejected', checked: false },
    { key: 'NO_WORK_EXPERIENCE', value: 'No Work-ex', checked: false },
  ]);
  const [trueIdCheckboxes, setTrueIdCheckboxes] = useState([
    { key: 'COMPLETED', value: 'Verified', checked: false },
    { key: 'PENDING', value: 'Pending', checked: false },
  ]);
  const [customerTypeCheckboxes, setCustomerTypeCheckboxes] = useState([
    { key: 'FREE', value: 'Free', checked: false },
    { key: 'PAID', value: 'Paid', checked: false },
  ]);
  const [jobReelStatusCheckboxes, setJobReelStatusCheckboxes] = useState([
    { key: 'VERIFIED', value: 'Verified', checked: false },
    {
      key: 'VERIFICATION_PENDING',
      value: 'Verification Pending',
      checked: false,
    },
    { key: 'REJECTED', value: 'Rejected', checked: false },
  ]);
  const [jobApplicationCheckboxes, setJobApplicationCheckboxes] = useState([
    { key: 'APPLIED', value: 'Applied', checked: false },
    { key: 'NOT_APPLIED', value: 'Not Applied', checked: false },
  ]);
  useEffect(() => {
    let filterString = '';
    const verificationParams = [
      {
        param: 'livePhotoVerificationStatus',
        type: 'livePhotoVerificationStatus',
      },
      { param: 'aadhaarVerificationStatus', type: 'aadhaarVerificationStatus' },
      {
        param: 'faceMatchWithAadhaarVerificationStatus',
        type: 'faceMatchWithAadhaarVerificationStatus',
      },
      {
        param: 'drivingLicenseVerificationStatus',
        type: 'drivingLicenseVerificationStatus',
      },
      {
        param: 'faceMatchWithDrivingLicenseVerificationStatus',
        type: 'faceMatchWithDrivingLicenseVerificationStatus',
      },
    ];

    verificationParams.forEach(({ param, type }) => {
      const status = searchParams?.get(param);
      if (status) {
        const statusCheckboxes = status.split(',');
        setVerificationCheckboxes((prevCheckboxes) =>
          prevCheckboxes.map((checkbox) =>
            checkbox[0].type === type
              ? checkbox.map((innerCheckbox) =>
                  statusCheckboxes.includes(innerCheckbox.key)
                    ? { ...innerCheckbox, checked: true }
                    : innerCheckbox,
                )
              : checkbox,
          ),
        );
        filterString += `&${param}=${status}`;
      }
    });

    const filterParams = [
      { param: 'customerType', setter: setCustomerTypeCheckboxes },
      {
        param: 'workExperienceVerificationStatus',
        setter: setWorkExCheckboxes,
      },
      { param: 'trueIdVerificationStatus', setter: setTrueIdCheckboxes },
      { param: 'jobReelsStatus', setter: setJobReelStatusCheckboxes },
      {
        param: 'jobApplicationStatus',
        setter: setJobApplicationCheckboxes,
      },
    ];

    filterParams.forEach(({ param, setter }) => {
      const status = searchParams?.get(param);
      if (status) {
        const statusCheckboxes = status.split(',');
        setter((prevCheckboxes) =>
          prevCheckboxes.map((checkbox) =>
            statusCheckboxes.includes(checkbox.key)
              ? { ...checkbox, checked: true }
              : checkbox,
          ),
        );
        filterString += `&${param}=${status}`;
      }
    });
    setFilterKeys(filterString);
  }, []);

  useEffect(() => {
    let totalFilters = 0;
    totalFilters += verificationCheckboxes.reduce(
      (acc, curr) => acc + curr.filter((checkbox) => checkbox.checked).length,
      0,
    );
    totalFilters += workExCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += trueIdCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += customerTypeCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += jobReelStatusCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += jobApplicationCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    setTotalFiltersCount(totalFilters);
  }, [
    verificationCheckboxes,
    workExCheckboxes,
    trueIdCheckboxes,
    customerTypeCheckboxes,
    jobReelStatusCheckboxes,
    jobApplicationCheckboxes,
  ]);

  const handleWorkExCheckboxChange = (value) => {
    setWorkExCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const handleTrueIdCheckboxChange = (value) => {
    setTrueIdCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };
  const handleCustomerTypeCheckboxChange = (value) => {
    setCustomerTypeCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const handleVerificationCheckboxChange = (value, typeIndex) => {
    const updatedCheckboxes = verificationCheckboxes[typeIndex];
    updatedCheckboxes?.map((checkbox) => {
      if (checkbox.value === value) {
        checkbox.checked = !checkbox.checked;
      }
    });
    setVerificationCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox, index) => {
        return index === typeIndex ? updatedCheckboxes : checkbox;
      });
    });
  };
  const handleJobReelStatusCheckboxChange = (value) => {
    setJobReelStatusCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };
  const handleJobApplicationStatusCheckboxChange = (value) => {
    setJobApplicationCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const clearFilters = () => {
    setWorkExCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setTrueIdCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setVerificationCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.map((innerCheckbox) => {
          return { ...innerCheckbox, checked: false };
        });
      });
    });
    setCustomerTypeCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setJobReelStatusCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setJobApplicationCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });

    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys('');
    toggleDrawer();
    navigate(`/customers`, { replace: true });
  };

  const getCheckedKeysString = (checkBoxes) => {
    const checkedKeys = checkBoxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.key);

    return checkedKeys.join(',');
  };

  const handleApplyClick = () => {
    let filterString = '';
    if (getCheckedKeysString(workExCheckboxes)?.length > 0) {
      filterString += `&workExperienceVerificationStatus=${getCheckedKeysString(workExCheckboxes)}`;
      searchParams.set(
        'workExperienceVerificationStatus',
        getCheckedKeysString(workExCheckboxes),
      );
    }
    if (!getCheckedKeysString(workExCheckboxes)) {
      searchParams.delete('workExperienceVerificationStatus');
    }
    if (getCheckedKeysString(trueIdCheckboxes)?.length > 0) {
      filterString += `&trueIdVerificationStatus=${getCheckedKeysString(trueIdCheckboxes)}`;
      searchParams.set(
        'trueIdVerificationStatus',
        getCheckedKeysString(trueIdCheckboxes),
      );
    }
    if (!getCheckedKeysString(trueIdCheckboxes)) {
      searchParams.delete('trueIdVerificationStatus');
    }
    verificationCheckboxes?.map((checkboxes) => {
      if (getCheckedKeysString(checkboxes)?.length > 0) {
        filterString += `&${checkboxes[0].type}=${getCheckedKeysString(checkboxes)}`;
        searchParams.set(checkboxes[0].type, getCheckedKeysString(checkboxes));
      }
      if (!getCheckedKeysString(checkboxes)) {
        searchParams.delete(checkboxes[0].type);
      }
    });
    if (getCheckedKeysString(customerTypeCheckboxes)?.length > 0) {
      filterString += `&customerType=${getCheckedKeysString(customerTypeCheckboxes)}`;
      searchParams.set(
        'customerType',
        getCheckedKeysString(customerTypeCheckboxes),
      );
    }
    if (!getCheckedKeysString(customerTypeCheckboxes)) {
      searchParams.delete('customerType');
    }
    if (getCheckedKeysString(jobReelStatusCheckboxes)?.length > 0) {
      filterString += `&jobReelsStatus=${getCheckedKeysString(jobApplicationCheckboxes)}`;
      searchParams.set(
        'jobReelsStatus',
        getCheckedKeysString(jobReelStatusCheckboxes),
      );
    }
    if (!getCheckedKeysString(jobReelStatusCheckboxes)) {
      searchParams.delete('jobReelsStatus');
    }
    if (getCheckedKeysString(jobApplicationCheckboxes)?.length > 0) {
      filterString += `&jobApplicationStatus=${getCheckedKeysString(jobApplicationCheckboxes)}`;
      searchParams.set(
        'jobApplicationStatus',
        getCheckedKeysString(jobApplicationCheckboxes),
      );
    }
    if (!getCheckedKeysString(jobApplicationCheckboxes)) {
      searchParams.delete('jobApplicationStatus');
    }

    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys(filterString);
    toggleDrawer();
    const queryString = generateSearchParams(searchParams);
    navigate(`/customers?${queryString}`, { replace: true });
  };

  return {
    verificationCheckboxes,
    workExCheckboxes,
    trueIdCheckboxes,
    customerTypeCheckboxes,
    jobReelStatusCheckboxes,
    jobApplicationCheckboxes,
    handleWorkExCheckboxChange,
    handleTrueIdCheckboxChange,
    handleVerificationCheckboxChange,
    handleCustomerTypeCheckboxChange,
    handleJobReelStatusCheckboxChange,
    handleJobApplicationStatusCheckboxChange,
    clearFilters,
    handleApplyClick,
  };
};

export default useCustomerFilter;
