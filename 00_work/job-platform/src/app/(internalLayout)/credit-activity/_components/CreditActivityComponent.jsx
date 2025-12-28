import { useContext, useState } from "react";
import PricingGradientBig from "@/assets/icons/jobs/pricingGradientBig.svg";
import PricingGradientSmall from "@/assets/icons/jobs/pricingGradientSmall.svg";
import Svg from "@/components/Svg";
import AiInterviewIcon from "@/assets/icons/payments/aiInterviewIcon.svg";
import PricingHeaders from "@/app/(externalLayout)/payment/_components/PricingHeaders";
import CustomCTA from "@/components/CustomCTA";
import { useGetCreditActivityDetails } from "@/apis/queryHooks";
import {
  CREDIT_ACTIVITY_HEADERS,
  CREDIT_ACTIVITY_HEADERS_MWEB,
  DEFAULT_PAGE_SIZE,
} from "@/constants";
import CreditActivityTable from "./CreditActivityTable";
import { EmployerContext } from "@/providers/EmployerProvider";
import { MIN_CREDITS } from "@/constants/payment";
import DisplayPagination from "@/components/DisplayPagination";
import CreditActivityCard from "./CreditActivityCard";
import Link from "next/link";

const FeatureCards = ({ title, description, icon }) => {
  return (
    <div className="bg-gradient-to-r from-purple-400 via-blue-300 to-cyan-300 p-0.5 rounded-full w-fit">
      <div className="bg-[#dceaff] rounded-full px-6 py-4 flex items-center gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center w-13 h-13 rounded-full text-white relative">
          <Svg
            icon={<AiInterviewIcon />}
            width="32"
            height="32"
            viewBox="0 0 32 32"
          />
          <div className="absolute inset-0 rounded-full border-2 border-white/30" />
        </div>

        <div className="text-black">
          <p className="text-sm font-medium">1 AI Interview</p>
          <p className="text-lg font-bold">In 20 Credits</p>
        </div>
      </div>
    </div>
  );
};

const CreditActivityComponent = () => {
  const { employer } = useContext(EmployerContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);

  const { data: creditActivityDetails, status: creditActivityStatus } =
    useGetCreditActivityDetails(employer?._id, {
      pageNo: currentPage,
      pageSize: itemsPerPage,
    });

  return (
    <div className="md:ml-[260px] mt-[60px] md:mt-[78px] px-5 pt-5 min-h-screen flex flex-col relative">
      <Svg
        icon={<PricingGradientBig />}
        width="1165"
        height="355"
        viewBox="0 0 1165 355"
        style={{
          fill: "linear-gradient(90deg, #F4F0FF 0%, #AEE1FF 100%)",
        }}
        className="hidden md:block w-full h-auto absolute top-0 left-0"
      />

      <div
        className="absolute  md:hidden h-[400px] z-[1] top-0 left-[-20px]"
        style={{ width: "calc(100vw + 20px)" }}
      >
        <Svg
          icon={<PricingGradientSmall />}
          width="375"
          height="265"
          viewBox="0 0 375 265"
          style={{
            fill: "linear-gradient(90deg, #F4F0FF 0%, #AEE1FF 100%)",
          }}
          className="w-full h-auto"
        />
      </div>

      <div className="mt-12 z-10 flex flex-col items-center justify-center">
        <PricingHeaders
          showIcon={false}
          title="Your Credits"
          description="Use credits to finalize candidates and view their contact details"
        />
        <div className="mt-10 w-full md:w-[500px] bg-white border border-[#BAC8D3] pt-10 pb-5 px-5 rounded-3xl flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-[40px] font-semibold text-[#000]">
              {creditActivityDetails?.credits || 0}
            </span>
            <div className="rounded-full w-10 h-10 flex items-center justify-center text-xl font-semibold text-black border-[2px] border-[#8E6218] bg-[linear-gradient(302deg,_#8E6218_-43.67%,_#F9DDAB_26.17%,_#9C7228_96.01%)]">
              C
            </div>
          </div>
          <span className="text-sm font-medium text-[#000]">Credits left</span>
          <div className="mt-6 w-full flex items-center flex-col">
            {creditActivityDetails?.credits <= MIN_CREDITS ? (
              <div className="bg-[#FF2411] w-75 md:w-90 text-[10px] md:text-xs rounded-t-full text-center leading-[24px] text-white">
                Only a few credits left — top up now and stay ahead!
              </div>
            ) : null}

            <Link href={"/buy-credits"} className="w-full">
              <CustomCTA
                backgroundImg="linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)"
                border="none"
                width="100%"
                height="58px"
                hoverTextColor="#111"
                textColor="#111"
                fontSize="20px"
                fontWeight="700"
                title={"Buy Credits"}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-10 pb-10">
        {creditActivityDetails?.ledger?.length > 0 ? (
          <span className="text-[#000] font-semibold text-lg block mb-4">
            Your credit activity
          </span>
        ) : null}
        <CreditActivityTable
          tableHeaders={CREDIT_ACTIVITY_HEADERS}
          tableData={creditActivityDetails?.ledger}
          isLoading={creditActivityStatus === "pending"}
          currentPage={currentPage}
        />
        <CreditActivityCard
          tableHeaders={CREDIT_ACTIVITY_HEADERS_MWEB}
          tableData={creditActivityDetails?.ledger}
          isLoading={creditActivityStatus === "pending"}
        />
      </div>
      {creditActivityDetails?.ledger?.length > 0 ? (
        <div className="flex mt-5 w-full bottom-10 p-2 bg-white border rounded-[10px] mb-5 ">
          <DisplayPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={creditActivityDetails?.totalEntries}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CreditActivityComponent;
