import { useEffect, useState } from "react";
import Svg from "@/components/Svg";
import DownArrow from "@/assets/icons/common/downArrow.svg";
import InfoIcon from "@/assets/icons/common/info.svg";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const TableHeader = ({ tableHeaders }) => (
  <thead className="bg-[#f4f6fa] text-gray-600 border border-[#ddd] text-left h-16">
    <tr>
      {tableHeaders?.map((header) => (
        <th
          key={header?.key}
          className="p-3 border text-center border-[#ddd] text-xs uppercase font-medium text-[#111]"
        >
          {header?.label}
        </th>
      ))}
    </tr>
  </thead>
);

const TransactionRow = ({ txn, isExpanded, toggleExpand, index }) => {
  const isCredit = txn?.transactionType === "CREDIT";
  const cellClass = `px-4 py-2 border border-[#ddd] ${
    isCredit ? "font-medium" : ""
  }`;
  let maskedReferenceId = txn?.referenceId;
  const lastFourDigits = maskedReferenceId?.slice(-4);
  if (maskedReferenceId?.length > 6) {
    maskedReferenceId = `XXXX${lastFourDigits}`;
  }

  return (
    <>
      <tr className="border-t border-gray-200 h-16">
        <td className={cellClass}>{txn?.date}</td>
        <td className={cellClass}>{txn?.txnId}</td>
        <td className={cellClass}>{txn?.description}</td>
        <td className={cellClass}>
          <button
            onClick={() => toggleExpand(index)}
            className="flex items-center gap-1 cursor-pointer"
          >
            Details
            <Svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              icon={<DownArrow />}
              className={isExpanded ? "rotate-180" : ""}
            />
          </button>
        </td>
        <td
          className={`${cellClass} ${
            isCredit ? "text-black font-bold" : "text-gray-700"
          }`}
        >
          {txn?.transactionType}
        </td>
        <td className={cellClass}>{txn?.value}</td>
        <td className={cellClass}>{txn?.balance}</td>
      </tr>
      {isExpanded && (
        <tr className="bg-[#fff3d4]">
          <td colSpan={7} className="px-4 py-2 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <Svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                icon={<InfoIcon />}
              />
              {txn?.referenceIdDescription}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default function CreditActivityTable({
  tableHeaders = [],
  tableData = [],
  isLoading,
  currentPage = 1,
}) {
  const [expandedRefIds, setExpandedRefIds] = useState({});

  const toggleExpand = (idx) => {
    setExpandedRefIds((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  useEffect(() => {
    if (Object.keys(expandedRefIds)?.length > 0) {
      setExpandedRefIds({});
    }
  }, [currentPage]);

  return (
    <div className="hidden md:block">
      {isLoading ? (
        <div className="flex items-center justify-center h-20">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />} />
        </div>
      ) : (
        <table className="text-[#000] w-full text-sm rounded overflow-hidden">
          {tableData?.length > 0 ? (
            <TableHeader tableHeaders={tableHeaders} />
          ) : null}
          <tbody className="bg-white">
            {tableData?.map((txn, idx) => (
              <TransactionRow
                key={txn?.txnId}
                txn={txn}
                index={idx}
                isExpanded={!!expandedRefIds[idx]}
                toggleExpand={toggleExpand}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
