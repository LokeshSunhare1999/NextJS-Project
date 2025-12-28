import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Fragment, useState } from "react";
import DownArrow from "@/assets/icons/payments/downArrow.svg";
import Svg from "@/components/Svg";

export default function CreditActivityCard({
  tableHeaders = [],
  tableData = [],
  isLoading,
}) {
  const [expandedRefIds, setExpandedRefIds] = useState({});
  const cardData = tableData.map((entry) =>
    tableHeaders.map((header) => ({
      label: header.label,
      value: entry[header.key] ?? "", // fallback to empty string if key is missing
    }))
  );

  const toggleExpand = (idx) => {
    setExpandedRefIds((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="md:hidden flex flex-col items-center justify-center gap-3">
      {isLoading ? (
        <div className="flex items-center justify-center h-20">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />} />
        </div>
      ) : (
        <>
          {cardData?.map((card, idx) => {
            return (
              <div
                className="w-full border-[1px] border-[#DDDDDD] rounded-[12px] bg-white"
                key={idx}
              >
                <div className="flex flex-col gap-1">
                  {card?.map?.((item, itemIdx) => {
                    const itemsToShow = !!expandedRefIds[idx] ? card.length : 4;
                    const isExpanded = !!expandedRefIds[idx];
                    return (
                      <Fragment key={itemIdx}>
                        {itemIdx < itemsToShow ? (
                          <div className="flex flex-col p-3">
                            <div className="flex flex-row items-center justify-between">
                              <span className="text-[12px] leading-[20px] font-medium text-[#111111] uppercase">
                                {item.label}
                              </span>
                              {itemIdx === 0 ? (
                                <div
                                  className="flex flex-row items-center gap-[2px]"
                                  onClick={() => toggleExpand(idx)}
                                >
                                  <span className="text-[#4C33C6] text-[12px] leading-[20px] font-semibold underline uppercase cursor-pointer">
                                    Details
                                  </span>
                                  <Svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    icon={<DownArrow />}
                                    className={isExpanded ? "rotate-180" : ""}
                                  />
                                </div>
                              ) : null}
                            </div>
                            <span className="text-[14px] leading-[20px] font-medium text-[#838383] ">
                              {item.value || "-----"}
                            </span>
                          </div>
                        ) : null}
                        {/* {itemIdx < card.length - 1 ? (
                          <div className="w-full h-[1px] bg-[#DDDDDD]" />
                        ) : null} */}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
