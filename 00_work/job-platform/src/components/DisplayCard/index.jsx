import { Fragment } from "react";
import ActionButton from "../ActionButton";
import { MoreOutlined } from "@ant-design/icons";
import ThreeDots from "@/assets/icons/common/threeDots.svg";
import DocumentStatusPill from "../DocumentStatusPill";
import { downloadPDF, formatDate } from "@/utils/helpers";
import CustomCTA from "../CustomCTA";
import DownloadIcon from "@/assets/icons/staff/downloadBlue.svg";

export default function DisplayCard({
  tableId,
  tableData,
  showActionsPanel = false,
  rows,
  headers,
  title = "",
  arrBtn = [],
  actionIndex,
  setActionIndex = () => {},
  actionOpen,
  setActionOpen,
  customProps,
  tooltipIcon,
  toolTipArray = [],
  highlightRow = false,
  emptyIcon = null,
  emptyDataMessage = "No results found",
  onHeaderClick = () => {},
  isMultiSelect,
  setSelectedActionIndices,
  selectedActionIndices,
  maxSelectItems,
  nonSelectableItems = [],
}) {
  const restrictedSelectableItems = new Set(nonSelectableItems);
  const selectedIndices = new Set(selectedActionIndices);
  const CustomElement = customProps?.ElementToBeRenderedInAction;
  const result = rows.map((row) => {
    return headers.map((header) => {
      return {
        id: row?.id,
        label: header.title,
        value: row[header.key],
        type: header.type,
      };
    });
  });

  const handleCustomPropsClick = () => {
    customProps?.setIsApplicationDrawerOpen &&
      customProps?.setIsApplicationDrawerOpen(true);
    customProps?.setIsViewApplication &&
      customProps?.setIsViewApplication(false);
  };

  const handleContentConfig = (item, type, rowsIdx) => {
    if (
      item === null ||
      item === undefined ||
      item === "" ||
      item?.length === 0
    )
      return "-----";
    switch (type) {
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
      case "APPLICATION_VIDEO": {
        return (
          <span
            onClick={handleCustomPropsClick}
            className="text-[#0A7AFF] text-[14px] leading-[20px] font-medium cursor-pointer underline"
          >
            View Video
          </span>
        );
      }

      case "DOCUMENT_VERIFICATION_TAG":
        return <DocumentStatusPill item={item} />;
      case "DATE":
        return formatDate(item, "DD MMM YYYY");
      case "DOWNLOAD_BUTTON":
        const handleDownload = () => {
          downloadPDF(item, `payment-receipt.pdf`);
          window.open(item, "_blank");
        };
        return (
          <CustomCTA
            width={"100%"}
            title="Download"
            onClickFn={handleDownload}
            backgroundColor="#FFFFFF"
            textColor="#141482"
            border="1px solid #141482"
            hoverBgColor="#F4F6FA"
            hoverTextColor="#141482"
            leftIcon={<DownloadIcon />}
          />
        );
      default:
        return item;
    }
  };

  const handleSelectCard = (applicant, idx) => {
    if (selectedIndices?.has(applicant?.[0]?.id)) {
      setSelectedActionIndices((prev) =>
        prev.filter((item) => item !== applicant?.[0]?.id)
      );
    } else if (
      (typeof customProps?.isHireable === "function" &&
        customProps?.isHireable(applicant[0])) ||
      !customProps?.isHireable
    ) {
      setSelectedActionIndices((prev) => [...prev, applicant?.[0]?.id]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {result?.length > 0 ? (
        <>
          {result?.map((applicant, idx) => {
            return (
              <div className="relative" key={idx}>
                {isMultiSelect ? (
                  <div className="flex gap-3 bg-[#E0E1E4] py-2 px-4 rounded-t-[12px]">
                    <input
                      id={`selectCard-${applicant?.[0]?.id}`}
                      type="checkbox"
                      disabled={
                        restrictedSelectableItems.has(applicant?.[0]?.id) ||
                        (selectedIndices?.size >= maxSelectItems &&
                          !selectedIndices?.has(applicant?.[0]?.id)) ||
                        (typeof customProps?.isHireable === "function" &&
                          !customProps?.isHireable?.(rows?.[idx]))
                      }
                      checked={selectedIndices?.has(applicant?.[0]?.id)}
                      onChange={() => handleSelectCard(applicant, idx)}
                    />
                    <label
                      htmlFor={`selectCard-${applicant?.[0]?.id}`}
                      className="text-[#747576] font-medium text-xs uppercase cursor-pointer"
                    >
                      Select
                    </label>
                  </div>
                ) : null}
                <div className="w-full rounded-b-[12px] border-[1px] border-[#EEEEEE] bg-white flex flex-col gap-3 p-3">
                  {applicant.map((details, index) => {
                    return (
                      <Fragment key={index}>
                        <div
                          className="text-[12px] leading-[20px] flex flex-col font-medium"
                          onClick={() => setActionIndex(idx)}
                        >
                          <span className=" uppercase text-[#838383]">
                            {details?.label}
                          </span>
                          <span className="text-[#111111]">
                            {handleContentConfig(
                              details?.value,
                              details?.type,
                              idx
                            )}
                          </span>
                        </div>

                        <div className="w-full h-[1px] bg-[#EEEEEE]"></div>
                      </Fragment>
                    );
                  })}
                  <div className="w-full flex items-center justify-between">
                    {CustomElement ? (
                      <div
                        className="flex items-center justify-between w-full"
                        onClick={() => setActionIndex(idx)}
                      >
                        <CustomElement currentIndex={idx} type={"mweb"} />
                        <ActionButton
                          arrBtn={arrBtn}
                          top={-10}
                          right={-10}
                          left={-10}
                          width={200}
                        >
                          <ThreeDots />
                        </ActionButton>
                      </div>
                    ) : (
                      <ActionButton
                        arrBtn={arrBtn}
                        top={-10}
                        right={-10}
                        left={-10}
                        width={200}
                      >
                        <div
                          className="w-full h-[40px] flex flex-row items-center justify-center gap-[10px] border-[1px] border-[#DDDDDD] rounded-[6px]"
                          onClick={() => setActionIndex(idx)}
                        >
                          <span className="text-[14px] font-medium text-[#586276]">
                            Action
                          </span>
                          <ThreeDots />
                        </div>
                      </ActionButton>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="flex h-[250px] w-full flex-col items-center justify-center gap-3">
          {emptyIcon ? <div className="text-[#CBD5E1]">{emptyIcon}</div> : null}
          <span className="text-base font-normal text-[#677995] text-center">
            {emptyDataMessage}
          </span>
        </div>
      )}
    </div>
  );
}
