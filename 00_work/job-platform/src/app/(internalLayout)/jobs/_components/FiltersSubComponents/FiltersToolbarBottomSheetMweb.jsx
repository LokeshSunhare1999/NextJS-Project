import {
  useGetAvailableBrandNames,
  useGetAvailableJobCategories,
  useGetAvailableJobLocations,
  useGetAvailableJobStatus,
} from "@/apis/queryHooks";
import CustomCTA from "@/components/CustomCTA";
import InputBox from "@/components/InputBox";
import Loader from "@/components/Loader";
import { JOBS_FILTER_TABS } from "@/constants";
import {
  CheckOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const JobLocationFilters = ({
  employerId,
  searchKeyword,
  setSearchKeyword,
  selectedFilters,
  setSelectedFilters,
}) => {
  const [filteredLocations, setFilteredLocations] = useState([]);

  const {
    data: availableJobLocations,
    status: availableJobLocationStatus,
    fetchStatus: availableJobLocationFetchStatus,
  } = useGetAvailableJobLocations(employerId, {
    jobStatus: selectedFilters?.jobStatus,
    jobCategory: selectedFilters?.jobCategory?.join(","),
    brandName: selectedFilters?.brandName?.join(","),
  });

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
  };

  useEffect(() => {
    if (searchKeyword === "") {
      setFilteredLocations(availableJobLocations || []);
      return;
    }
    const filteredLocations =
      availableJobLocations?.filter((location) =>
        location?.locationName
          ?.toLowerCase()
          .includes(searchKeyword?.toLowerCase())
      ) || [];
    setFilteredLocations(filteredLocations);
  }, [searchKeyword, availableJobLocations]);

  useEffect(() => {
    if (searchKeyword) {
      const filtered = availableJobLocations?.filter((location) =>
        location?.locationName
          .toLowerCase()
          .includes(searchKeyword.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(availableJobLocations);
    }
  }, [searchKeyword]);

  const handleSelectLocation = (label) => {
    const isSelected = selectedFilters?.jobLocation.includes(label);
    const newSelectedFilters = isSelected
      ? selectedFilters?.jobLocation.filter((location) => location !== label)
      : [...selectedFilters?.jobLocation, label];
    setSelectedFilters((prev) => ({
      ...prev,
      jobLocation: newSelectedFilters,
    }));
  };

  if (
    availableJobLocationStatus === "pending" ||
    availableJobLocationFetchStatus === "fetching" ||
    !availableJobLocations
  ) {
    return <Loader />;
  }

  return (
    <div>
      <InputBox
        placeholder="Search by location"
        classes="w-full pb-2 pt-3"
        inputClasses="text-sm"
        inputBg="#fff"
        value={searchKeyword}
        onChange={handleSearchChange}
        prefix={<SearchOutlined />}
      />
      <div className="h-[1px] my-2 bg-[#EFEFEF]" />
      {filteredLocations?.length > 0 ? (
        filteredLocations?.map((option, index) => (
          <div
            key={`${option?.locationName}-${index}`}
            className="flex items-center border-b border-[#efefef] py-2.5 gap-2 text-sm text-[#333] font-medium"
            onClick={() => handleSelectLocation(option?.locationName)}
          >
            <input
              type="checkbox"
              checked={selectedFilters?.jobLocation.includes(
                option?.locationName
              )}
              onChange={() => handleSelectLocation(option?.locationName)}
              className="mr-2"
            />
            {option?.locationName}
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-[#333] my-4">
          No locations found
        </div>
      )}
    </div>
  );
};

const JobCategoriesFilters = ({
  employerId,
  selectedFilters,
  setSelectedFilters,
}) => {
  const {
    data: availableJobCategories,
    status: availableJobCategoryStatus,
    fetchStatus: availableJobCategoryFetchStatus,
  } = useGetAvailableJobCategories(employerId, {
    jobStatus: selectedFilters?.jobStatus,
    jobLocation: selectedFilters?.jobLocation?.join(":"),
    brandName: selectedFilters?.brandName?.join(","),
  });

  const handleSelectCategory = (label) => {
    const isSelected = selectedFilters?.jobCategory.includes(label);
    const newSelectedFilters = isSelected
      ? selectedFilters?.jobCategory.filter((category) => category !== label)
      : [...selectedFilters?.jobCategory, label];
    setSelectedFilters((prev) => ({
      ...prev,
      jobCategory: newSelectedFilters,
    }));
  };

  if (
    availableJobCategoryStatus === "pending" ||
    availableJobCategoryFetchStatus === "fetching" ||
    !availableJobCategories
  ) {
    return <Loader />;
  }

  return (
    <div>
      {availableJobCategories?.map((option) => (
        <div
          className="flex items-center border-b border-[#efefef] py-2.5 gap-2 text-sm text-[#333] font-medium"
          onClick={() => handleSelectCategory(option?.enum)}
          key={option?.enum}
        >
          <input
            type="checkbox"
            checked={selectedFilters?.jobCategory.includes(option?.enum)}
            onChange={() => handleSelectCategory(option?.enum)}
            className="mr-2"
          />
          {option?.category}
        </div>
      ))}
    </div>
  );
};

const BrandNameFilters = ({
  employerId,
  selectedFilters,
  setSelectedFilters,
}) => {
  const {
    data: availableBrandNames,
    status: availableBrandNamesStatus,
    fetchStatus: availableBrandNamesFetchStatus,
  } = useGetAvailableBrandNames(employerId, {
    jobStatus: selectedFilters?.jobStatus,
    jobLocation: selectedFilters?.jobLocation?.join(":"),
    jobCategory: selectedFilters?.jobCategory?.join(","),
  });

  const handleSelectBrand = (label) => {
    const isSelected = selectedFilters?.brandName.includes(label);
    const newSelectedFilters = isSelected
      ? selectedFilters?.brandName.filter((brand) => brand !== label)
      : [...selectedFilters?.brandName, label];
    setSelectedFilters((prev) => ({ ...prev, brandName: newSelectedFilters }));
  };

  if (
    availableBrandNamesStatus === "pending" ||
    availableBrandNamesFetchStatus === "fetching" ||
    !availableBrandNames
  ) {
    return <Loader />;
  }

  return (
    <div>
      {availableBrandNames?.map((option) => (
        <div
          className="flex items-center border-b border-[#efefef] py-2.5 gap-2 text-sm text-[#333] font-medium"
          key={option}
          onClick={() => handleSelectBrand(option)}
        >
          <input
            type="checkbox"
            checked={selectedFilters?.brandName.includes(option)}
            onChange={() => handleSelectBrand(option)}
            className="mr-2"
          />
          {option}
        </div>
      ))}
    </div>
  );
};

const JobStatusFilters = ({
  selectedFilters,
  employerId,
  setSelectedFilters,
}) => {
  const {
    data: availableJobStatus,
    status: availableJobStatusStatus,
    fetchStatus: availableJobStatusFetchStatus,
  } = useGetAvailableJobStatus(employerId);
  const handleSelectStatus = (label) => {
    const isSelected = selectedFilters?.jobStatus === label;
    const newSelectedFilters = isSelected ? "" : label;
    setSelectedFilters((prev) => ({ ...prev, jobStatus: newSelectedFilters }));
  };

  if (
    availableJobStatusStatus === "pending" ||
    availableJobStatusFetchStatus === "fetching" ||
    !availableJobStatus
  ) {
    return <Loader />;
  }

  return availableJobStatus?.map((option) => (
    <div
      key={option.enum}
      onClick={() => handleSelectStatus(option.enum)}
      className={`flex justify-between items-center py-3 px-2 rounded-md cursor-pointer transition-colors ${
        selectedFilters?.jobStatus === option.enum && "bg-[#f4f4f4]"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: option.color }}
        />
        <span className="text-sm text-[#1a1a1a]">{option.status}</span>
      </div>
      {selectedFilters?.jobStatus === option.enum && <CheckOutlined />}
    </div>
  ));
};

const FiltersToolbarBottomSheetMweb = ({
  employerId,
  activeSortKey,
  setGlobalFilters,
  updateQueryParams,
  handleCloseFiltersBottomSheet,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState(JOBS_FILTER_TABS[0]?.value);
  const [selectedFilters, setSelectedFilters] = useState({
    jobStatus: "",
    jobLocation: [],
    jobCategory: [],
    brandName: [],
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    /** Get filters from query params */
    const status = searchParams.get("jobStatus") || "";
    const location = searchParams.get("jobLocation")?.split(":") || [];
    const category = searchParams.get("jobCategory")?.split(",") || [];
    const brand = searchParams.get("brandName")?.split(",") || [];

    const initialFilters = {
      jobStatus: status,
      jobLocation: location.filter(Boolean),
      jobCategory: category.filter(Boolean),
      brandName: brand.filter(Boolean),
    };

    setSelectedFilters(initialFilters);
    setGlobalFilters(initialFilters);
  }, []);

  const handleReset = () => {
    const cleared = {
      jobStatus: "",
      jobLocation: [],
      jobCategory: [],
      brandName: [],
    };
    setSelectedFilters(cleared);
    setGlobalFilters(cleared);
    updateQueryParams({ ...cleared, sortBy: activeSortKey });
    setSearchKeyword("");
    handleCloseFiltersBottomSheet();
  };

  const handleApply = () => {
    setGlobalFilters(selectedFilters);
    updateQueryParams({ ...selectedFilters, sortBy: activeSortKey });
    handleCloseFiltersBottomSheet();
  };

  const handleResetByTab = () => {
    switch (activeTab) {
      case "JOB_STATUS":
        setSelectedFilters((prev) => ({ ...prev, jobStatus: "" }));
        break;
      case "JOB_LOCATION":
        setSelectedFilters((prev) => ({ ...prev, jobLocation: [] }));
        setSearchKeyword("");
        break;
      case "JOB_CATEGORY":
        setSelectedFilters((prev) => ({ ...prev, jobCategory: [] }));
        break;
      case "BRAND_NAME":
        setSelectedFilters((prev) => ({ ...prev, brandName: [] }));
        break;
      default:
        break;
    }
  };

  const renderTabComponent = (tab, customProps) => {
    const {
      employerId,
      selectedFilters,
      setSelectedFilters,
      searchKeyword,
      setSearchKeyword,
    } = customProps;
    switch (tab) {
      case "JOB_STATUS":
        return (
          <JobStatusFilters
            employerId={employerId}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        );
      case "JOB_LOCATION":
        return (
          <JobLocationFilters
            employerId={employerId}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        );
      case "JOB_CATEGORY":
        return (
          <JobCategoriesFilters
            employerId={employerId}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        );
      case "BRAND_NAME": {
        return (
          <BrandNameFilters
            employerId={employerId}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        );
      }
      default:
        return null;
    }
  };
  return (
    <div className="bg-white flex flex-col h-[70vh]">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-[#efefef]">
        <h2 className="font-bold text-black text-xl">Filters</h2>
        <CustomCTA
          title="Reset All"
          onClickFn={handleReset}
          backgroundColor="#fff"
          textColor="#3B2B8C"
          hoverTextColor="#3B2B8C"
          border="none"
          hoverBgColor="#fff"
          classes="!px-0 !py-0 rounded- md"
          leftIcon={<ReloadOutlined />}
        />
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tabs */}
        <div className="w-[40%] bg-[#f7f7fa] border-r border-[#efefef] flex flex-col text-sm">
          {JOBS_FILTER_TABS.map((tab) => (
            <button
              key={tab?.value}
              onClick={() => setActiveTab(tab?.value)}
              className={`px-4 py-3 text-left border-l-2 transition-colors 
                ${
                  activeTab === tab?.value
                    ? "bg-white border-[#5e63db] font-semibold text-[#1a1a1a]"
                    : "text-[#6b6b6b] border-transparent"
                }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Slots for filters */}
        <div className="flex-1 px-4 py-3 overflow-y-auto">
          {renderTabComponent(activeTab, {
            employerId,
            searchKeyword,
            setSearchKeyword,
            selectedFilters,
            setSelectedFilters,
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-4 border-t border-[#efefef]">
        <CustomCTA
          title="Reset"
          onClickFn={() => handleResetByTab(activeTab)}
          backgroundColor="#fff"
          hoverBgColor="#fff"
          hoverTextColor="#3B2B8C"
          textColor="#3B2B8C"
          border="1px solid #d2d2d2"
          classes="px-4 py-2 rounded- md"
          leftIcon={<ReloadOutlined />}
        />
        <CustomCTA
          title="Apply"
          onClickFn={handleApply}
          classes="px-4 py-2 rounded-md"
        />
      </div>
    </div>
  );
};

export default FiltersToolbarBottomSheetMweb;
