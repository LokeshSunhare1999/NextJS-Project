import { useEffect, useState } from 'react';
import { generateSearchParams } from '../../utils/helper';
import { PAGE_SOURCE } from '../../constants/job';
import {
  STATUS_CHECKBOXES,
  CATEGORY_CHECKBOXES,
  POSTEDBY_CHECKBOXES,
} from '../../constants/job';

const useAllJobsFilter = (
  pageSource,
  setTotalFiltersCount,
  setFilterKeys,
  toggleDrawer,
  navigate,
  employerId,
  searchParams,
  setCurrentPage,
  setItemsPerPage,
) => {
  const [statusCheckBoxes, setStatusCheckBoxes] = useState(STATUS_CHECKBOXES);
  const [categoryCheckboxes, setCategoryCheckBoxes] =
    useState(CATEGORY_CHECKBOXES);
  const [jobPostedbyCheckBoxes, setJobPostedbyCheckBoxes] =
    useState(POSTEDBY_CHECKBOXES);

  useEffect(() => {
    let filterString = '';

    if (pageSource === PAGE_SOURCE.ALL_JOBS) {
      const filterAgencyType = searchParams.get('filterAgencyType');
      if (filterAgencyType) {
        const filterAgencyTypeArray = filterAgencyType.split(',');
        setCategoryCheckBoxes((prevCheckboxes) => {
          return prevCheckboxes.map((checkbox) => {
            return filterAgencyTypeArray.includes(checkbox.key)
              ? { ...checkbox, checked: true }
              : checkbox;
          });
        });
        filterString += `&filterAgencyType=${filterAgencyType}`;
      }
    }

    const jobStatus = searchParams.get('jobStatus');
    if (jobStatus) {
      const jobStatusArray = jobStatus.split(',');
      setStatusCheckBoxes((prevCheckboxes) => {
        return prevCheckboxes.map((checkbox) => {
          return jobStatusArray.includes(checkbox.key)
            ? { ...checkbox, checked: true }
            : checkbox;
        });
      });
      filterString += `&jobStatus=${jobStatus}`;
    }

    if (pageSource === PAGE_SOURCE.EMPLOYER_JOBS) {
      const postedBy = searchParams.get('postedBy');
      if (postedBy) {
        const postedByArray = postedBy.split(',');
        setJobPostedbyCheckBoxes((prevCheckboxes) => {
          return prevCheckboxes.map((checkbox) => {
            return postedByArray.includes(checkbox.key)
              ? { ...checkbox, checked: true }
              : checkbox;
          });
        });
        filterString += `&postedBy=${postedBy}`;
      }
    }

    setFilterKeys(filterString);
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, [pageSource]);

  useEffect(() => {
    let totalFilters = 0;

    if (pageSource === PAGE_SOURCE.ALL_JOBS) {
      totalFilters += categoryCheckboxes.filter(
        (checkbox) => checkbox.checked,
      ).length;
    }

    totalFilters += statusCheckBoxes.filter(
      (checkbox) => checkbox.checked,
    ).length;

    if (pageSource === PAGE_SOURCE.EMPLOYER_JOBS) {
      totalFilters += jobPostedbyCheckBoxes.filter(
        (checkbox) => checkbox.checked,
      ).length;
    }

    setTotalFiltersCount(totalFilters);
  }, [pageSource, statusCheckBoxes, categoryCheckboxes, jobPostedbyCheckBoxes]);

  const clearFilters = () => {
    setStatusCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setCategoryCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    setJobPostedbyCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return { ...checkbox, checked: false };
      });
    });
    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys('');
    toggleDrawer();
    if (pageSource === PAGE_SOURCE.ALL_JOBS) {
      navigate(`/all-jobs`, { replace: true });
    } else if (pageSource === PAGE_SOURCE.EMPLOYER_JOBS) {
      navigate(`/employers/${employerId}?tab=jobs`, { replace: true });
    }
  };
  const handleJobStatusCheckBoxesChange = (value) => {
    setStatusCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };
  const handleCategoryCheckboxesChange = (value) => {
    if (pageSource !== PAGE_SOURCE.ALL_JOBS) return;

    setCategoryCheckBoxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const handleJobPostedbyCheckBoxesChange = (value) => {
    if (pageSource !== PAGE_SOURCE.EMPLOYER_JOBS) return;

    setJobPostedbyCheckBoxes((prevCheckboxes) => {
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

    if (pageSource === PAGE_SOURCE.ALL_JOBS) {
      if (getCheckedKeysString(categoryCheckboxes)?.length > 0) {
        filterString += `&filterAgencyType=${getCheckedKeysString(categoryCheckboxes)}`;
        searchParams.set(
          'filterAgencyType',
          getCheckedKeysString(categoryCheckboxes),
        );
      }
      if (!getCheckedKeysString(categoryCheckboxes)) {
        searchParams.delete('filterAgencyType');
      }
    }

    if (getCheckedKeysString(statusCheckBoxes)?.length > 0) {
      filterString += `&jobStatus=${getCheckedKeysString(statusCheckBoxes)}`;
      searchParams.set('jobStatus', getCheckedKeysString(statusCheckBoxes));
    }
    if (!getCheckedKeysString(statusCheckBoxes)) {
      searchParams.delete('jobStatus');
    }

    if (pageSource === PAGE_SOURCE.EMPLOYER_JOBS) {
      if (getCheckedKeysString(jobPostedbyCheckBoxes)?.length > 0) {
        filterString += `&postedBy=${getCheckedKeysString(jobPostedbyCheckBoxes)}`;
        searchParams.set(
          'postedBy',
          getCheckedKeysString(jobPostedbyCheckBoxes),
        );
      }
      if (!getCheckedKeysString(jobPostedbyCheckBoxes)) {
        searchParams.delete('postedBy');
      }
    }

    searchParams.set('currentPage', 1);
    setCurrentPage(1);
    setFilterKeys(filterString);
    toggleDrawer();

    const queryString = generateSearchParams(searchParams);

    if (pageSource === PAGE_SOURCE.ALL_JOBS) {
      navigate(`/all-jobs?${queryString}`, { replace: true });
    } else if (pageSource === PAGE_SOURCE.EMPLOYER_JOBS) {
      navigate(`/employers/${employerId}?${queryString}`, { replace: true });
    }
  };

  return {
    statusCheckBoxes,
    categoryCheckboxes,
    jobPostedbyCheckBoxes,
    handleCategoryCheckboxesChange,
    handleJobPostedbyCheckBoxesChange,
    handleJobStatusCheckBoxesChange,
    clearFilters,
    handleApplyClick,
  };
};
export default useAllJobsFilter;
