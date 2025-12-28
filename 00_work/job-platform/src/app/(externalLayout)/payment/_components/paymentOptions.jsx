"use client";
import PaymentCardHeader from "./paymentCardHeader";
import "@/styles/paymentCheckbox.css";
import SecurePayment from "@/assets/icons/payments/securePayment.svg";
import { useState } from "react";
import PaymentOptionsCard from "./paymentOptionsCard";
import { UPI_PAYMENT } from "@/constants/payment";
import PaymentFooter from "./paymentFooter";
import BadgeComponent from "@/components/BadgeComponent";
import MoneyBack from "@/assets/icons/account-info/MoneyBack.svg";

export default function PaymentOptions({
  companyName,
  setCompanyName,
  gstNumber,
  setGstNumber,
  vpa,
  handleVPAChange,
  isVpaVerified,
  handleVerifyVPA,
  handleVPAPayment,
  errText,
  orderDetails,
  disablePaymentBtn,
  desc,
  showIcon,
}) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="w-full max-w-[696px] border-[1px] border-[#EEEEEE] rounded-[16px]">
      <div className="hidden md:block">
        <PaymentCardHeader
          orderDetails={orderDetails}
          productDetails={orderDetails?.orderItems?.[0]}
          desc={desc}
          showIcon={showIcon}
        />
      </div>
      <div className="flex flex-col p-10">
        {/* <div className="flex flex-row items-center">
          <Checkbox
            onChange={() => setIsChecked(!isChecked)}
            checked={isChecked}
          >
            <span className="text-[14px] leading-[20px] text-[#111111] font-medium">
              Enter a GST number(optional)
            </span>
          </Checkbox>
        </div>
        {isChecked ? (
          <div className="flex flex-row items-center gap-5 mt-4">
            <input
              type="text"
              className="w-[298px] h-[52px] rounded-[8px] border-[1px] border-[#BAC8D3] bg-[#FFFFFF] text-[14px] leading-[20px] text-[#111111] font-normal px-4 active:outline-[#20247e] focus:outline-[#20247e]"
              placeholder={"Company Name"}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              type="text"
              className="w-[298px] h-[52px] rounded-[8px] border-[1px] border-[#BAC8D3] bg-[#FFFFFF] text-[14px] leading-[20px] text-[#111111] font-normal px-4 active:outline-[#20247e] focus:outline-[#20247e]"
              placeholder={"Registration Number"}
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
            />
          </div>
        ) : null}
        <hr className="w-full h-[1px] bg-[#E1E1E9] my-5" /> */}
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between mb-3">
            <span className="text-[14px] leading-[20px] font-medium text-[#111111]">
              Select payment method
            </span>
            <div className="flex flex-row items-center gap-1">
              <SecurePayment />
              <span className="text-[12px] leading-[16px] font-normal text-[#666666]">
                Secure Payments
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {/* <PaymentOptionsCard paymentOption={CARD_PAYMENT} /> */}
            <PaymentOptionsCard
              paymentOption={UPI_PAYMENT}
              vpa={vpa}
              isVpaVerified={isVpaVerified}
              handleVPAChange={handleVPAChange}
              handleVPAPayment={handleVPAPayment}
              handleVerifyVPA={handleVerifyVPA}
              errText={errText}
              disablePaymentBtn={disablePaymentBtn}
            />
          </div>
        </div>

        <div className="mt-5">
          <PaymentFooter orderMetadata={orderDetails?.orderMetadata} />
        </div>
      </div>
    </div>
  );
}
