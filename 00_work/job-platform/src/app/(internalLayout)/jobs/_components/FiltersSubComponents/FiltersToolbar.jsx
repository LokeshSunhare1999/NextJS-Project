import {
  useGetAvailableBrandNames,
  useGetAvailableJobCategories,
  useGetAvailableJobLocations,
  useGetAvailableJobStatus,
} from "@/apis/queryHooks";
import CustomCTA from "@/components/CustomCTA";
import InputBox from "@/components/InputBox";
import { JOBS_SORT_OPTIONS } from "@/constants";
import {
  AlignLeftOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Select } from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const FiltersToolbar = ({
  employerId,
  setGlobalFilters,
  setActiveSortKey,
  activeSortKey,
  updateQueryParams,
}) => {
  const searchParams = useSearchParams();

  /** State for locally controlling UI for filters */
  const [selectedFilters, setSelectedFilters] = useState({
    jobStatus: "",
    jobLocation: [],
    jobCategory: [],
    brandName: [],
  });

  const [isJobLocationOpen, setIsJobLocationOpen] = useState(false);
  const [isJobCategoryOpen, setIsJobCategoryOpen] = useState(false);
  const [isBrandNameOpen, setIsBrandNameOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [filteredJobLocations, setFilteredJobLocations] = useState([]);
  const { data: availableJobStatus } = useGetAvailableJobStatus(employerId);
  const { data: availableJobLocations } = useGetAvailableJobLocations(
    employerId,
    {
      jobStatus: selectedFilters?.jobStatus,
      jobCategory: selectedFilters?.jobCategory?.join(","),
      brandName: selectedFilters?.brandName?.join(","),
    }
  );
  const { data: availableJobCategories } = useGetAvailableJobCategories(
    employerId,
    {
      jobStatus: selectedFilters?.jobStatus,
      jobLocation: selectedFilters?.jobLocation?.join(":"),
      brandName: selectedFilters?.brandName?.join(","),
    }
  );
  const { data: availableBrandNames } = useGetAvailableBrandNames(employerId, {
    jobStatus: selectedFilters?.jobStatus,
    jobLocation: selectedFilters?.jobLocation?.join(":"),
    jobCategory: selectedFilters?.jobCategory?.join(","),
  });

  const jobLocationData = availableJobLocations
    ?.map(({ locationName }) => ({
      locationName,
    }))
    ?.filter((location) =>
      location?.locationName?.toLowerCase().includes(searchKey.toLowerCase())
    );
  const jobCategoryData = availableJobCategories?.map((category) => ({
    category: category?.category,
    enum: category?.enum,
  }));
  const brandNameData = availableBrandNames?.map((brandName) => ({
    brandName,
  }));

  const getInfoFromJobStatus = (status) => {
    return (
      availableJobStatus?.find((statusItem) => statusItem.enum === status) || {}
    );
  };
  useEffect(() => {
    /** Get filters from query params */
    const status = searchParams.get("jobStatus") || "";
    const location = searchParams.get("jobLocation")?.split(":") || [];
    const category = searchParams.get("jobCategory")?.split(",") || [];
    const brand = searchParams.get("brandName")?.split(",") || [];
    const sortBy = searchParams.get("sortBy") || JOBS_SORT_OPTIONS[0]?.value;
    const initialFilters = {
      jobStatus: status,
      jobLocation: location.filter(Boolean),
      jobCategory: category.filter(Boolean),
      brandName: brand.filter(Boolean),
    };

    setActiveSortKey(sortBy);
    setSelectedFilters(initialFilters);
    setGlobalFilters(initialFilters);
  }, []);

  const updateFilter = (type, value) => {
    if (type === "jobStatus") {
      setSelectedFilters((prev) => ({ ...prev, jobStatus: value }));
      updateQueryParams({
        ...selectedFilters,
        jobStatus: value,
        sortBy: activeSortKey,
      });
      setGlobalFilters((prev) => ({ ...prev, jobStatus: value }));
      return;
    }
    const isSelected = selectedFilters[type].includes(value);
    const updated = isSelected
      ? selectedFilters[type].filter((item) => item !== value)
      : [...selectedFilters[type], value];
    setSelectedFilters((prev) => ({ ...prev, [type]: updated }));
  };

  const handleReset = () => {
    const cleared = {
      jobStatus: "",
      jobLocation: [],
      jobCategory: [],
      brandName: [],
    };
    setSelectedFilters(cleared);
    setGlobalFilters(cleared);
    setSearchKey("");
    updateQueryParams({ ...cleared, sortBy: activeSortKey });
  };

  useEffect(() => {
    if (searchKey === "") {
      setFilteredJobLocations(jobLocationData || []);
      return;
    }
    const filteredLocations =
      jobLocationData?.filter((location) =>
        location?.locationName?.toLowerCase().includes(searchKey?.toLowerCase())
      ) || [];
    setFilteredJobLocations(filteredLocations);
  }, [searchKey, availableJobLocations]);

  /** Do not use label, value for options rendering in filters, it requires controlling through antd provided props.
   * This is custom implementation as per requirement
   */

  const handleResetByFilter = (filter) => {
    if (filter === "jobStatus") {
      setSelectedFilters((prev) => ({
        ...prev,
        jobStatus: "",
      }));
      return;
    }
    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: [],
    }));
    setSearchKey("");
  };

  const handleApply = () => {
    setIsBrandNameOpen(false);
    setIsJobCategoryOpen(false);
    setIsJobLocationOpen(false);
    setGlobalFilters(selectedFilters);
    updateQueryParams({ ...selectedFilters, sortBy: activeSortKey });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {/* Job Status */}
        <Select
          value={selectedFilters?.jobStatus || undefined}
          placeholder={
            <div className="flex items-center justify-start text-sm text-[#333] font-medium pl-1">
              Job Status
            </div>
          }
          optionLabelProp="label"
          style={{
            width: 125,
            height: 48,
            boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
          styles={{ popup: { root: { width: 300 } } }}
          popupRender={(menu) =>
            availableJobStatus?.length > 0 ? (
              menu
            ) : (
              <div className="text-center text-sm text-[#333] my-4">
                No job status found
              </div>
            )
          }
          options={availableJobStatus?.map((status) => ({
            value: status.enum,
            label: (
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                {status.status}
              </div>
            ),
            data: { ...status },
          }))}
          optionRender={(option) => {
            return (
              <div
                className="flex items-center px-4 py-2 justify-between cursor-pointer"
                onClick={() =>
                  updateFilter("jobStatus", option.data?.data?.enum)
                }
              >
                <div className="flex gap-2 items-center">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: option.data?.data?.color }}
                  />
                  {option.data?.data?.status}
                </div>
                {selectedFilters?.jobStatus === option.data?.data?.enum && (
                  <CheckOutlined />
                )}
              </div>
            );
          }}
        />

        {/* Job Location */}
        <Select
          open={isJobLocationOpen}
          onOpenChange={(open) => setIsJobLocationOpen(open)}
          mode="multiple"
          defaultValue="Job Location"
          value={
            <div className="h-11 flex items-center justify-center text-sm text-[#333] font-medium pl-2">
              Job Location
            </div>
          }
          style={{
            width: 148,
            height: 48,
            boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
          styles={{ popup: { root: { width: 300, padding: 12 } } }}
          showSearch={false}
          tagRender={() => (
            <div className="flex h-11 pl-3 items-center justify-center text-sm text-[#333] font-medium pl-0">
              Job Location
            </div>
          )}
          maxTagCount={0}
          popupRender={(menu) => (
            <div>
              <InputBox
                placeholder="Search by location"
                classes="w-full pb-2 pt-3"
                inputClasses="text-sm"
                inputBg="#fff"
                onChange={(value) => {
                  setSearchKey(value);
                }}
                value={searchKey}
                prefix={<SearchOutlined />}
              />
              <div className="h-[1px] my-2 bg-[#EFEFEF]" />
              {filteredJobLocations?.length > 0 ? (
                menu
              ) : (
                <div className="text-center text-sm text-[#333] my-4">
                  No locations found
                </div>
              )}

              <div className="flex items-center justify-between px-0 py-2 border-t border-[#efefef]">
                <CustomCTA
                  title="Reset"
                  onClickFn={() => handleResetByFilter("jobLocation")}
                  backgroundColor="#fff"
                  hoverBgColor="#fff"
                  hoverTextColor="#3B2B8C"
                  textColor="#3B2B8C"
                  border="none"
                  classes=" rounded- md"
                  leftIcon={<ReloadOutlined />}
                />
                <CustomCTA
                  title="Apply"
                  onClickFn={handleApply}
                  disabled={
                    filteredJobLocations?.length === 0 || !availableJobLocations
                  }
                  disabledBgColor="#c4bfdc"
                  disabledBorderColor="#c4bfdc"
                  disabledTextColor="#fff"
                  classes="rounded-md"
                />
              </div>
            </div>
          )}
          optionRender={(option, index) => (
            <div
              key={`${option?.data?.locationName}-${index}`}
              className="flex items-center gap-2"
              onClick={() =>
                updateFilter("jobLocation", option?.data?.locationName)
              }
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedFilters?.jobLocation.includes(
                  option?.data?.locationName
                )}
                onChange={() =>
                  updateFilter("jobLocation", option?.data?.locationName)
                }
              />
              {option?.data?.locationName}
            </div>
          )}
          options={filteredJobLocations}
        />

        {/* Job Category */}
        <Select
          mode="multiple"
          open={isJobCategoryOpen}
          onOpenChange={(open) => setIsJobCategoryOpen(open)}
          defaultValue="Job Category"
          style={{
            width: 148,
            height: 48,
            boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
          styles={{ popup: { root: { width: 300, padding: 12 } } }}
          showSearch={false}
          tagRender={() => (
            <div className="flex h-11 pl-3 items-center justify-center text-sm text-[#333] font-medium pl-0">
              Job Category
            </div>
          )}
          maxTagCount={0}
          optionRender={(option) => (
            <div
              className="flex items-center gap-2"
              onClick={() => updateFilter("jobCategory", option?.data?.enum)}
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedFilters?.jobCategory.includes(
                  option?.data?.enum
                )}
                onChange={() => updateFilter("jobCategory", option?.data?.enum)}
              />
              {option?.data?.category}
            </div>
          )}
          popupRender={(menu) => (
            <>
              {availableJobCategories?.length > 0 ? (
                menu
              ) : (
                <div className="text-center text-sm text-[#333] my-4">
                  No categories found
                </div>
              )}
              <div className="flex h-11 pl-3 items-center justify-between px-0 py-2 border-t border-[#efefef]">
                <CustomCTA
                  title="Reset"
                  onClickFn={() => handleResetByFilter("jobCategory")}
                  backgroundColor="#fff"
                  hoverBgColor="#fff"
                  hoverTextColor="#3B2B8C"
                  textColor="#3B2B8C"
                  border="none"
                  classes=" rounded- md"
                  leftIcon={<ReloadOutlined />}
                />
                <CustomCTA
                  title="Apply"
                  onClickFn={handleApply}
                  disabled={
                    !availableJobCategories ||
                    availableJobCategories?.length === 0
                  }
                  disabledBgColor="#c4bfdc"
                  disabledBorderColor="#c4bfdc"
                  disabledTextColor="#fff"
                  classes="rounded-md"
                />
              </div>
            </>
          )}
          options={jobCategoryData}
        />

        {/* Brand Name */}
        <Select
          mode="multiple"
          open={isBrandNameOpen}
          onOpenChange={(open) => setIsBrandNameOpen(open)}
          defaultValue="Brand Name"
          style={{
            width: 138,
            height: 48,
            boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
          styles={{ popup: { root: { width: 300, padding: 12 } } }}
          showSearch={false}
          tagRender={() => (
            <div className="flex h-11 pl-3 items-center justify-center text-sm text-[#333] font-medium">
              Brand Name
            </div>
          )}
          maxTagCount={0}
          optionRender={(option) => (
            <div
              className="flex items-center gap-2"
              onClick={() => updateFilter("brandName", option?.data?.brandName)}
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedFilters?.brandName.includes(
                  option?.data?.brandName
                )}
                onChange={() =>
                  updateFilter("brandName", option?.data?.brandName)
                }
              />
              {option?.data?.brandName}
            </div>
          )}
          popupRender={(menu) => (
            <>
              {availableBrandNames?.length > 0 ? (
                menu
              ) : (
                <div className="text-center text-sm text-[#333] my-4">
                  No brand names found
                </div>
              )}
              <div className="flex h-11 pl-3 items-center justify-between px-0 py-2 border-t border-[#efefef]">
                <CustomCTA
                  title="Reset"
                  onClickFn={() => handleResetByFilter("brandName")}
                  backgroundColor="#fff"
                  hoverBgColor="#fff"
                  hoverTextColor="#3B2B8C"
                  textColor="#3B2B8C"
                  border="none"
                  classes=" rounded- md"
                  leftIcon={<ReloadOutlined />}
                />
                <CustomCTA
                  title="Apply"
                  onClickFn={handleApply}
                  disabled={
                    !availableBrandNames || availableBrandNames?.length === 0
                  }
                  disabledBgColor="#c4bfdc"
                  disabledBorderColor="#c4bfdc"
                  disabledTextColor="#fff"
                  classes="rounded-md"
                />
              </div>
            </>
          )}
          options={brandNameData}
        />

        <CustomCTA
          title="Reset Filters"
          onClickFn={handleReset}
          backgroundColor="transparent"
          textColor="#3B2B8C"
          hoverTextColor="#3B2B8C"
          border="none"
          hoverBgColor="transparent"
          classes="!px-0 !py-0 rounded- md"
          leftIcon={<ReloadOutlined />}
        />
      </div>

      <Select
        value={activeSortKey}
        placeholder={
          <div className="flex items-center justify-center text-sm text-[#333] font-medium pl-2">
            Sort By
          </div>
        }
        onChange={(value) => {
          setActiveSortKey(value);
          updateQueryParams({ ...selectedFilters, sortBy: value });
        }}
        prefix={<AlignLeftOutlined />}
        style={{
          height: 48,
          boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.06)",
        }}
        styles={{ popup: { root: { width: 300 } } }}
        showSearch={false}
        options={JOBS_SORT_OPTIONS}
      />
    </div>
  );
};

export default FiltersToolbar;
