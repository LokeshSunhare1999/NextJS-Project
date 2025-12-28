import { useState, useEffect } from 'react';
import { generateSearchParams } from '../../utils/helper';

const useApplicationFilters = (
  setTotalFiltersCount,
  setFilterKeys,
  toggleDrawer,
  navigate,
  searchParams,
  setCurrentPage,
  setItemsPerPage,
  jobId,
) => {
  const [screeningStatusCheckboxes, setScreeningStatusCheckboxes] = useState([
    { key: 'SHORTLISTED', value: 'Shortlisted', checked: false },
    { key: 'SCREENING_REJECTED', value: 'Rejected', checked: false },
  ]);
  const [finalStatusCheckboxes, setFinalStatusCheckboxes] = useState([
    { key: 'HIRED', value: 'Finalised', checked: false },
    { key: 'INTERVIEW_REJECTED', value: 'Rejected', checked: false },
    { key: 'ONBOARDED', value: 'Onboarding', checked: false },
  ]);
  const [interviewStatusCheckboxes, setInterviewStatusCheckboxes] = useState([
    { key: 'INTERVIEW_COMPLETED', value: 'Completed', checked: false },
    { key: 'INTERVIEW_PENDING', value: 'Pending', checked: false },
    { key: 'INTERVIEW_UNDER_EVALUATION', value: 'Dropped', checked: false },
    { key: 'INTERVIEW_LAPSED', value: 'Lapsed', checked: false },
  ]);

  useEffect(() => {
    let filterString = '';

    const filterParams = [
      {
        param: 'screeningStatus',
        setter: setScreeningStatusCheckboxes,
      },
      {
        param: 'finalStatus',
        setter: setFinalStatusCheckboxes,
      },
      {
        param: 'interviewStatus',
        setter: setInterviewStatusCheckboxes,
      },
    ];
    filterParams.forEach;
  }, []);
  useEffect(() => {
    let filterString = '';
    const finalStatus = searchParams.get('finalStatus');
    if (finalStatus) {
      const finalStatusArray = finalStatus.split(',');
      setFinalStatusCheckboxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return finalStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&finalStatus=${finalStatus}`;
    }

    const interviewStatus = searchParams.get('interviewStatus');
    if (interviewStatus) {
      const interviewStatusArray = interviewStatus.split(',');
      setInterviewStatusCheckboxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return interviewStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&interviewStatus=${interviewStatus}`;
    }
    const screeningStatus = searchParams.get('screeningStatus');
    if (screeningStatus) {
      const screeningStatusArray = screeningStatus.split(',');
      setScreeningStatusCheckboxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return screeningStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&screeningStatus=${screeningStatus}`;
    }
    setFilterKeys(filterString);
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, []);

  useEffect(() => {
    let totalFilters = 0;
    totalFilters += screeningStatusCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += finalStatusCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;
    totalFilters += interviewStatusCheckboxes.filter(
      (checkbox) => checkbox.checked,
    ).length;

    setTotalFiltersCount(totalFilters);
  }, [
    screeningStatusCheckboxes,
    finalStatusCheckboxes,
    interviewStatusCheckboxes,
  ]);

  const handleFinalStatusCheckboxChange = (value) => {
    setFinalStatusCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const handleInterviewStatusCheckboxChange = (value) => {
    setInterviewStatusCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const handleScreeningStatusCheckboxChange = (value, typeIndex) => {
    setScreeningStatusCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const clearFilters = () => {
    setFinalStatusCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setInterviewStatusCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setScreeningStatusCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });

    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys('');
    toggleDrawer();
    navigate(`/jobs/${jobId}/applications`, { replace: true });
  };

  const getCheckedKeysString = (checkBoxes) => {
    const checkedKeys = checkBoxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.key);

    return checkedKeys.join(',');
  };

  const handleApplyClick = () => {
    let filterString = '';
    if (getCheckedKeysString(finalStatusCheckboxes)?.length > 0) {
      filterString += `&finalStatus=${getCheckedKeysString(finalStatusCheckboxes)}`;
      searchParams.set(
        'finalStatus',
        getCheckedKeysString(finalStatusCheckboxes),
      );
    }
    if (!getCheckedKeysString(finalStatusCheckboxes)) {
      searchParams.delete('finalStatus');
    }
    if (getCheckedKeysString(interviewStatusCheckboxes)?.length > 0) {
      filterString += `&interviewStatus=${getCheckedKeysString(interviewStatusCheckboxes)}`;
      searchParams.set(
        'interviewStatus',
        getCheckedKeysString(interviewStatusCheckboxes),
      );
    }
    if (!getCheckedKeysString(interviewStatusCheckboxes)) {
      searchParams.delete('interviewStatus');
    }
    if (getCheckedKeysString(screeningStatusCheckboxes)?.length > 0) {
      filterString += `&screeningStatus=${getCheckedKeysString(screeningStatusCheckboxes)}`;
      searchParams.set(
        'screeningStatus',
        getCheckedKeysString(screeningStatusCheckboxes),
      );
    }
    if (!getCheckedKeysString(screeningStatusCheckboxes)) {
      searchParams.delete('screeningStatus');
    }

    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys(filterString);
    toggleDrawer();
    const queryString = generateSearchParams(searchParams);
    navigate(`/jobs/${jobId}/applications?${queryString}`, { replace: true });
  };

  return {
    screeningStatusCheckboxes,
    finalStatusCheckboxes,
    interviewStatusCheckboxes,
    handleFinalStatusCheckboxChange,
    handleInterviewStatusCheckboxChange,
    handleScreeningStatusCheckboxChange,
    clearFilters,
    handleApplyClick,
  };
};

export default useApplicationFilters;
