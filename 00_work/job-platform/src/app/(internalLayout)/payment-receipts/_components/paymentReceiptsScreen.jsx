"use client";
import { useContext, useState } from "react";
import { EmployerContext } from "@/providers/EmployerProvider";
import { useGetInvoicesData } from "@/apis/queryHooks";
import { CURRENT_JOB_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import DisplayTable from "@/components/DisplayTable";
import { convertToTableData, parseTableHeaders } from "@/utils/helpers";
import DisplayPagination from "@/components/DisplayPagination";
import DisplayCard from "@/components/DisplayCard";
import { useRouter } from "next/navigation";
import BackIcon from "@/assets/icons/common/backIcon.svg";

export default function PaymentReceiptsScreen() {
  const { employer } = useContext(EmployerContext);
  const employerId = employer?._id;
  const [currentPage, setCurrentPage] = useState(CURRENT_JOB_PAGE);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const router = useRouter();

  const { data: invoicesData } = useGetInvoicesData(employerId, {
    pageSize: itemsPerPage,
    pageNo: currentPage,
  });

  const headers = parseTableHeaders(invoicesData?.headers);
  const parsedData = convertToTableData(invoicesData?.receipts, headers);

  return (
    <div className="mt-[60px] md:ml-[260px] md:mt-[78px] min-h-screen flex flex-col">
      <div className="w-full h-full px-5 pt-5">
        <header>
          <button
            className="mt-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-white"
            onClick={() => router.back()}
          >
            <BackIcon />
          </button>
          <h2 className="text-[18px] leading-[24px] font-semibold text-black my-3">
            Payment Receipts
          </h2>
        </header>
        <div className="hidden md:block">
          <DisplayTable
            tableData={invoicesData?.receipts ?? []}
            headers={headers}
            rows={parsedData}
          />
        </div>
        <div className="block md:hidden">
          <DisplayCard
            tableData={invoicesData?.receipts ?? []}
            headers={headers}
            rows={parsedData}
          />
        </div>
        {parsedData.length > 0 ? (
          <div className="flex z-[10] mt-5 w-full bottom-10 p-2 bg-white border rounded-[10px] mb-[82px] md:mb-0">
            <DisplayPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={invoicesData?.totalCount}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
