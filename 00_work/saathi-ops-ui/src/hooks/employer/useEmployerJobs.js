import { useGetEmployerJobs } from '../../apis/queryHooks';
import { getNestedProperty } from '../../utils/helper';

const useEmployerJobs = ({
  employerId,
  currentPage,
  itemsPerPage,
  filterKeys,
}) => {
  const {
    data: employerJobsData,
    isLoading: employerJobsDataLoading,
    isFetching: employerJobsDataFetching,
  } = useGetEmployerJobs({
    employerId,
    currentPage,
    itemsPerPage,
    filterKeys,
  });

  const employerJobs = employerJobsData?.jobs || [];

  const employerJobsHeaders = employerJobsData?.headers?.metaData || [];

  const employerJobTableHeaders = Array.from(
    employerJobsHeaders.map((item) => item?.value),
  );
  const employerJobKeys = Array.from(
    employerJobsHeaders.map((item) => item?.key),
  );

  function createData(employerJobs) {
    const headerKeys = Array.from(employerJobsHeaders.map((item) => item.key));
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(employerJobs, itemKey);
    });
  }
  const employerJobsRows = Array.from(
    employerJobs.map((item) => createData(item)),
  );

  return {
    employerJobs,
    employerJobTableHeaders,
    employerJobsHeaders,
    employerJobKeys,
    employerJobsRows,
    employerJobsData,
  };
};

export default useEmployerJobs;
