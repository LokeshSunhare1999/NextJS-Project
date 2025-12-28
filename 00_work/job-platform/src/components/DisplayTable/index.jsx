import { ConfigProvider, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import RatingStar from "@/assets/icons/common/ratingStar.svg";
import DownloadIcon from "@/assets/icons/staff/downloadBlue.svg";
import { downloadPDF, formatDate, getTrimmedValue } from "@/utils/helpers";
import { RUPEE_SYMBOL } from "@/constants/index";
import ActionButton from "../ActionButton";
import DocumentStatusPill from "../DocumentStatusPill";
import { v4 as uuidv4 } from "uuid";
import { Tooltip } from "@mui/material";
import InfoIcon from "@/assets/icons/common/info.svg";
import CustomTooltip from "../CustomTooltip";
import CustomCTA from "../CustomCTA";

const DisplayTable = ({
  isMultiSelect = false,
  tableData,
  showActionsPanel = false,
  rows,
  headers,
  title = "",
  arrBtn = [],
  setActionIndex = () => {},
  setActionOpen,
  customProps,
  maxSelectItems,
  selectedActionIndices = [],
  nonSelectableItems = [],
  setSelectedActionIndices = () => {},
  emptyIcon = null,
  emptyDataMessage = "No results found",
}) => {
  const restrictedSelectableItems = new Set(nonSelectableItems);
  const selectedIndices = new Set(selectedActionIndices);
  const staffingEmploymentTypeMap = Object.fromEntries(
    (customProps?.globalData?.staffingEmploymentTypesData ?? []).map(
      ({ key, value }) => [key, value]
    )
  );

  const handleCustomPropsClick = () => {
    customProps?.setIsApplicationDrawerOpen &&
      customProps?.setIsApplicationDrawerOpen(true);
    customProps?.setIsViewApplication &&
      customProps?.setIsViewApplication(false);
  };

  /* Handle content based on type */
  const handleContentConfig = (item, type, rowsIdx) => {
    if (
      item === null ||
      item === undefined ||
      item === "" ||
      item?.length === 0
    )
      return "-----";
      
    switch (type) {
      case "NUMBER":
      case "TEXT":
        return typeof item === "string" ? getTrimmedValue(item, 25) : item;
      case "AMOUNT":
        return `${RUPEE_SYMBOL} ${item}`;
      // case "DOCUMENT_VERIFICATION_TEXT":
      // return <DocumentStatus item={item} />;
      case "DATE":
        return formatDate(item, "DD MMM YYYY");
      case "RATING":
        return (
          <span className="flex">
            <span className="mr-2 font-medium">{item}</span>
            <RatingStar />
          </span>
        );
      // case "VERIFICATION_STATUS":
      case "DOCUMENT_VERIFICATION_TAG":
        return <DocumentStatusPill item={item} />;
      case "EMPLOYMENT_CATEGORY":
        return (
          <span className="flex h-[24px] w-[90px] items-center justify-center rounded bg-[#EBEBEB] text-xs font-medium leading-[18px] tracking-tight text-[#767676]">
            {getTrimmedValue(staffingEmploymentTypeMap[item], 11)}
          </span>
        );
      case "PROFILE_SCORE":
      case "INTERVIEW_SCORE":
        return (
          <div className="flex flex-row items-center gap-2">
            <span className="text-xs font-medium text-[#767676]">{item}</span>
            {customProps?.showRecommnedation &&
            tableData?.[rowsIdx]?.isRecommended ? (
              <DocumentStatusPill item={"RECOMMENDED"} />
            ) : null}
          </div>
        );
      case "DOCUMENT_VERIFICATION_TAG":
        return <DocumentStatusPill item={item} />;
      case "APPLICATION_VIDEO":
        return (
          <span
            className="cursor-pointer text-[#0153FF] text-sm font-normal underline"
            onClick={handleCustomPropsClick}
          >
            Watch Video
          </span>
        );
      // case "APPLICATION_PHONE_NO":
      //   return (
      //     <span
      //       className={`text-sm font-normal ${
      //         visiblePhones[rowsIdx]
      //           ? "text-[#606C85]"
      //           : "text-[#0153FF] underline cursor-pointer"
      //       }`}
      //       onClick={(e) => {
      //         e.stopPropagation();
      //         if (!visiblePhones[rowsIdx]) {
      //           setVisiblePhones((prev) => ({ ...prev, [rowsIdx]: true }));
      //         }
      //       }}
      //     >
      //       {visiblePhones[rowsIdx] ? item : "View"}
      //     </span>
      //   );

      case "DOWNLOAD_BUTTON":
        const handleDownload = () => {
          downloadPDF(item, `payment-receipt.pdf`);
          window.open(item, "_blank");
        };
        return (
          <CustomCTA
            title="Download"
            backgroundColor="#FFFFFF"
            textColor="#141482"
            border="1px solid #141482"
            hoverBgColor="#F4F6FA"
            hoverTextColor="#141482"
            onClickFn={handleDownload}
            leftIcon={<DownloadIcon />}
          />
        );

      default:
        return typeof item !== "object" ? item : "";
    }
  };

  const handleTableHeaderClick = (key) => {
    switch (key) {
      default:
        () => {};
    }
  };

  const handleTableHeaderName = (header) => {
    switch (header?.key) {
      default:
        return (
          <span key={header?.title} className="text-normal font-normal">
            {header?.title}
          </span>
        );
    }
  };

  const tableHeaders = headers?.map((header, idx) => {
    return {
      ...header,
      render: (text, record, index) => {
        return (
          <span
            key={() => uuidv4()}
            className=" text-xs font-normal text-[#606C85]"
          >
            {handleContentConfig(text, header?.type, index)}
          </span>
        );
      },
      title: (
        <span className="flex items-center gap-1">
          <div
            className="w-full flex"
            style={{
              justifyContent: `${
                !showActionsPanel && idx === headers?.length - 1
                  ? "flex-end"
                  : "flex-start"
              }`,
            }}
          >
            {handleTableHeaderName(header)}
          </div>
          {header?.key === "daysLeftToFinalised" ? (
            <div className="cursor-pointer">
              <CustomTooltip
                title="Time left to take action (Finalize or Reject) after interview completion. After this period, the application expires."
                placement="top"
              >
                <InfoIcon />{" "}
              </CustomTooltip>
            </div>
          ) : null}
        </span>
      ),
      onHeaderCell: (column) => ({
        onClick: () => {
          handleTableHeaderClick(header?.key);
        },
      }),
    };
  });
  /* For rendering action button, with access of actionIndex */
  const actionColumnIndex = tableHeaders.findIndex(
    (header) => header.key === "actions"
  );

  /* For multiselect column functionality */
  const multiSelectColumnIndex = tableHeaders.findIndex(
    (header) => header.key === "multiSelectOption"
  );

  const CustomElement = customProps?.ElementToBeRenderedInAction;

  const actionColumn = {
    title: <span className="text-xs font-semibold uppercase">Action</span>,
    key: "actions",
    render: (text, record, index) => (
      <div className="cursor-pointer flex justify-end items-center w-full">
        {CustomElement ? <CustomElement currentIndex={index} /> : null}
        <ActionButton
          arrBtn={arrBtn}
          setActionOpen={setActionOpen}
          top={-10}
          right={-10}
          left={-10}
          width={200}
        >
          <MoreOutlined />
        </ActionButton>
      </div>
    ),
  };

  const multiSelectColumn = {
    title: (
      <input
        type="checkbox"
        className="cursor-pointer"
        checked={
          selectedIndices?.size === maxSelectItems &&
          selectedIndices?.size !== 0
        }
        onChange={() => {
          setSelectedActionIndices((prev) => {
            if (prev?.length > 0) {
              return [];
            } else {
              return rows
                ?.filter((_) => !restrictedSelectableItems.has(_?.id))
                ?.filter((_) => {
                  if (typeof customProps?.isHireable === "function") {
                    return customProps?.isHireable(_);
                  }
                  return true;
                })
                ?.slice(0, maxSelectItems)
                ?.map((_, index) => {
                  return _?.id;
                });
            }
          });
        }}
      />
    ),
    key: "multiSelectOption",
    render: (text, record, index) => (
      <input
        type="checkbox"
        className="cursor-pointer"
        checked={selectedIndices?.has(record?.id)}
        disabled={
          restrictedSelectableItems.has(record?.id) ||
          (selectedIndices?.size >= maxSelectItems &&
            !selectedIndices?.has(record?.id)) ||
          (typeof customProps?.isHireable === "function" &&
            !customProps?.isHireable?.(record))
        }
        onChange={() => {
          if (selectedIndices?.has(record?.id)) {
            setSelectedActionIndices((prev) =>
              prev.filter((item) => item !== record?.id)
            );
          } else if (
            (typeof customProps?.isHireable === "function" &&
              customProps?.isHireable(record)) ||
            !customProps?.isHireable
          ) {
            setSelectedActionIndices((prev) => [...prev, record?.id]);
          }
        }}
      />
    ),
  };

  const EmptyData = () => {
    return (
      <div className="flex h-[250px] w-full flex-col items-center justify-center gap-3">
        {emptyIcon ? <div className="text-[#CBD5E1]">{emptyIcon}</div> : null}
        <span className="text-base font-normal text-[#677995] text-center">
          {emptyDataMessage}
        </span>
      </div>
    );
  };

  if (showActionsPanel) {
    if (actionColumnIndex !== -1) {
      tableHeaders[actionColumnIndex] = actionColumn;
    } else {
      tableHeaders.push(actionColumn);
    }
  }

  if (isMultiSelect) {
    if (multiSelectColumnIndex !== -1) {
      tableHeaders[multiSelectColumnIndex] = multiSelectColumn;
    } else {
      tableHeaders.unshift(multiSelectColumn);
    }
  }

  return (
    <div className="flex w-full flex-col">
      {title ? (
        <div className="rounded-tl-xl rounded-tr-xl bg-white px-4 py-3 text-base font-semibold">
          {title}
        </div>
      ) : null}
      <div
        style={{
          border: "2px solid white",
          borderRadius: title ? "0 0 8px 8px" : "8px",
          overflow: "hidden",
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              Table: {
                headerBg: "#F4F6FA",
                headerBorderRadius: title ? 0 : 8,
              },
            },
          }}
        >
          <Table
            bordered
            rowKey={(record) => uuidv4()}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  setActionIndex(rowIndex);
                },
              };
            }}
            className={`w-full ${
              title ? "!rounded-tl-none !rounded-tr-none" : ""
            }`}
            rowClassName={() => "border-b-2 border-black"}
            dataSource={rows}
            columns={tableHeaders}
            pagination={false}
            locale={{
              emptyText: <EmptyData emptyMessage={emptyDataMessage} />,
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default DisplayTable;
