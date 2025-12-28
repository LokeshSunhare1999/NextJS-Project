import FilterIcon from "@/assets/icons/staff/filter.svg";
import CustomCTA from "@/components/CustomCTA";
import Svg from "@/components/Svg";
import { JOBS_SORT_OPTIONS } from "@/constants";
import { AlignLeftOutlined } from "@ant-design/icons";

const FiltersToolbarControlsMweb = ({
  setIsFiltersOpen,
  setIsSortByOpen,
  activeSortKey,
}) => {
  const sortText =
    JOBS_SORT_OPTIONS?.find((option) => option.value === activeSortKey)
      ?.label?.slice(0, 16)
      .concat("...") || "Sort By";
  return (
    <div className="flex items-center gap-4 mb-4">
      <CustomCTA
        title="All Filters"
        backgroundColor="#fff"
        hoverBgColor="#fff"
        border="1px solid #D8D8D8"
        hoverTextColor="#333"
        hoverBorderColor="#d8d8d8"
        textColor="#333"
        onClickFn={() => setIsFiltersOpen(true)}
        leftIcon={<Svg icon={<FilterIcon />} />}
      />
      <CustomCTA
        title={sortText}
        leftIcon={<AlignLeftOutlined />}
        backgroundColor="#fff"
        hoverBgColor="#fff"
        border="1px solid #D8D8D8"
        hoverTextColor="#333"
        hoverBorderColor="#d8d8d8"
        textColor="#333"
        onClickFn={() => setIsSortByOpen(true)}
      />
    </div>
  );
};
export default FiltersToolbarControlsMweb;
