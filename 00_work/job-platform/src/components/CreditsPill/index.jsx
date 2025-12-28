import { MIN_CREDITS } from "@/constants/payment";
import "./index.css";

export default function CreditsPill({ credits = 0, handleClick }) {
  return (
    <div
      className="w-auto h-[44px] flex flex-row items-center justify-center gap-2 rounded-[8px] px-4 rounded-[100px] cursor-pointer"
      style={{
        background:
          "linear-gradient(301.71deg, #8E6218 -43.67%, #F9DDAB 26.17%, #9C7228 96.01%)",
        border: "2px solid #8B6C32",
      }}
      onClick={handleClick}
    >
      <span className="text-[#140E2F] text-[18px] leading-[23px] font-semibold shadow-text select-none cursor-pointer">
        {credits} C
      </span>
      {credits < MIN_CREDITS ? (
        <>
          <div className="bg-[#90774A] w-2 h-2 rounded-[50%]" />

          <div className="w-auto h-6 bg-[#111111] rounded-[100px] px-2 flex flex-row items-center">
            <span
              className="text-[14px] leading-[20px] font-semibold text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)",
              }}
            >
              Buy Credits
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}
