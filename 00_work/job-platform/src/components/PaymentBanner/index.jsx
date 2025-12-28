import CustomCTA from "@/components/CustomCTA";
import "./index.css";
import Link from "next/link";
export default function PaymentBanner({ credits = 0 }) {
  return (
    <div className="w-full md:h-[152px] banner-img flex flex-row items-center justify-between md:px-10 p-3">
      <div className="flex flex-row items-center gap-5">
        <div
          className="w-[72px] h-[72px] flex-row items-center justify-center rounded-[50%] hidden md:flex"
          style={{
            background:
              "linear-gradient(301.71deg, #8E6218 -43.67%, #F9DDAB 26.17%, #9C7228 96.01%)",
            border: "2px solid #8B6C32",
          }}
        >
          <span className="text-[#140E2F] text-[24px] leading-[28px] font-semibold shadow-text">
            {credits} C
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl md:text-[32px] leading-[36px] font-semibold text-[#FFFFFF]">
            {credits === 0 ? "No Credits Left" : "Low credit balance"}
          </span>
          <div
            className="text-[10px] md:text-normal text-white w-auto h-6 px-3 rounded-[100px] flex flex-row items-center"
            style={{
              background:
                "linear-gradient(90deg, #FF2411 0%, rgba(255, 188, 182, 0) 100%)",
            }}
          >
            {credits === 0
              ? "Add credits to continue finalizing"
              : "Few credits remaining - recharge now."}
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <Link href="/buy-credits">
          <CustomCTA
            width={"238px"}
            height="58px"
            title={credits === 0 ? "Buy Credits" : "Add Credits"}
            textColor="#000000"
            hoverTextColor="#000000"
            fontSize="18px"
            lineHeight="28px"
            fontWeight="700"
            backgroundImg="linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)"
          />
        </Link>
      </div>
      <div className="block md:hidden">
        <Link href="/buy-credits">
          <CustomCTA
            width={"100%"}
            height="40px"
            title={credits === 0 ? "Buy Credits" : "Add Credits"}
            textColor="#000000"
            hoverTextColor="#000000"
            fontSize="14px"
            lineHeight="28px"
            fontWeight="700"
            backgroundImg="linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)"
          />
        </Link>
      </div>
    </div>
  );
}
