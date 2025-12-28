import { ConfigProvider, Pagination } from "antd";
import React from "react";
import Svg from "@/components/Svg";
import PrevArrow from "@/assets/icons/common/prevArrow.svg";
import NextArrow from "@/assets/icons/common/nextArrow.svg";

const DisplayPagination = ({
  currentPage,
  setCurrentPage,
  totalItems,
  setTotalItems,
  itemsPerPage = 10,
  setItemsPerPage,
  arrowBg,
  setOpenDropdown,
  openDropdown,
  handleDropdown,
  showSizeChanger = true,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <button
          className={`flex h-full items-center rounded-lg bg-white px-2 !text-xs ${
            currentPage === 1 ? "!cursor-not-allowed !text-[#ccc]" : ""
          }`}
        >
          <Svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            icon={<PrevArrow />}
          />
          Prev
        </button>
      );
    }
    if (type === "next") {
      return (
        <button
          className={`flex h-full items-center rounded-lg bg-white px-2 !text-xs ${
            currentPage === totalPages || totalItems === 0
              ? "!cursor-not-allowed !text-[#ccc]"
              : ""
          }`}
        >
          Next
          <Svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            icon={<NextArrow />}
          />
        </button>
      );
    }
    return originalElement;
  };

  const handlePaginate = (page) => {
    if (currentPage !== page) {
      setCurrentPage(page);
    }
  };

  const onShowSizeChange = (current, size) => {
    setItemsPerPage(size);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            itemActiveBg: "#3b2b8c",
            itemActiveColorDisabled: "#fffff",
          },
        },
      }}
    >
      <Pagination
        showSizeChanger={showSizeChanger}
        showLessItems={true}
        current={currentPage}
        total={totalItems}
        pageSize={itemsPerPage}
        itemRender={itemRender}
        onChange={handlePaginate}
        onShowSizeChange={onShowSizeChange}
        align="end"
        defaultCurrent={1}
        totalItems={totalItems}
      />
    </ConfigProvider>
  );
};

export default DisplayPagination;
