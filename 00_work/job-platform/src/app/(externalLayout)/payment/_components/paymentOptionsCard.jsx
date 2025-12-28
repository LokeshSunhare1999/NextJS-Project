"use client";
import CustomCTA from "@/components/CustomCTA";
import ChevronDown from "@/assets/icons/payments/chevronDown.svg";
import { useState } from "react";

export default function PaymentOptionsCard({
  paymentOption,
  vpa,
  handleVPAChange,
  isVpaVerified,
  handleVerifyVPA,
  handleVPAPayment,
  errText,
  disablePaymentBtn,
}) {
  const [showVPA, setShowVPA] = useState(true);
  return (
    <div className="relative w-full rounded-[12px] bg-[#F8F8F8] flex flex-col">
      <div
        className="w-full flex flex-col p-7 bg-white rounded-[12px] border-[1px] border-[#C3D4E4]"
        style={{ boxShadow: "0px 2px 8px 0px #0000001A" }}
      >
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-4">
            {paymentOption?.icon}
            <div className="flex flex-col">
              <span className="text-[18px] leading-[20px] font-semibold text-[#111111]">
                {paymentOption?.title}
              </span>
              <span className="text-[12px] leading-[18px] font-normal text-[#666666]">
                {paymentOption?.description}
              </span>
            </div>
          </div>
          {/* <CustomCTA
            borderColor={paymentOption?.id === "card" ? "#20247E" : "#FFFFFF"}
            backgroundColor="#FFFFFF"
            textColor="#20247E"
            hoverBgColor={paymentOption?.id === "card" ? "#20247E" : "#FFFFFF"}
            hoverTextColor={
              paymentOption?.id === "card" ? "#FFFFFF" : "#20247E"
            }
            hoverBorderColor={
              paymentOption?.id === "card" ? "#FFFFFF" : "#20247E"
            }
            title={
              paymentOption?.id === "card" ? "Pay With Card" : "Pay With UPI"
            }
            borderRadius="8px"
            height="44px"
            width="140px"
            fontWeight="600"
            border={paymentOption?.id === "card" ? "2px solid" : "0px solid"}
            rightIcon={
              paymentOption?.id === "card" ? null : showVPA ? (
                <div className="rotate-180">
                  <ChevronDown />
                </div>
              ) : (
                <ChevronDown />
              )
            }
            onClickFn={
              paymentOption?.id === "card" ? null : () => setShowVPA(!showVPA)
            }
          /> */}
        </div>
        {paymentOption?.id === "upi" && showVPA ? (
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between mt-4">
            <div className="flex flex-col w-full md:mb-0 mb-2">
              <input
                value={vpa}
                onChange={(e) => handleVPAChange(e.target.value)}
                type="text"
                placeholder="Enter your UPI ID"
                className={`rounded-[8px] max-w-[400px] w-full  bg-[#FFFFFF] border-[2px] border-[#111111] px-6 text-[14px] text-[#727272] focus:outline-0 h-[44px] ${
                  errText ? "!border-[#FF4E42]" : ""
                } ${isVpaVerified ? "!border-[#2EC068]" : ""}`}
              />
              {errText ? (
                <span className="block mt-3 text-sm text-white font-normal">
                  {errText}
                </span>
              ) : null}
            </div>
            <CustomCTA
              borderColor={"#20247E"}
              backgroundColor="#FFFFFF"
              textColor="#20247E"
              hoverBgColor={"#20247E"}
              hoverTextColor={"#FFFFFF"}
              hoverBorderColor={"#FFFFFF"}
              title={"Proceed to Pay"}
              borderRadius="8px"
              height="44px"
              width={"150px"}
              fontWeight="600"
              border={"2px solid"}
              onClickFn={handleVPAPayment}
              loading={disablePaymentBtn}
            />
          </div>
        ) : null}
      </div>
      <div className="flex flex-row items-center w-full gap-2 px-5 py-2">
        {paymentOption?.options?.map((option, index) => (
          <div key={index}>{option.icon}</div>
        ))}
      </div>
    </div>
  );
}
