import { PRIVACY_POLICY_LINK, TNC_LINK } from "@/constants";
import { JOB_EVENTS } from "@/constants/eventEnums";
import { triggerEvent } from "@/utils/events";

export default function PaymentFooter({ orderMetadata }) {
  const handleClick = () => {
    triggerEvent(JOB_EVENTS?.PAYMENT_TC_CLICK);
    window.open(TNC_LINK);
  };
  return (
    <footer className="w-full flex flex-col">
      {/* <span className="text-[14px] leading-[20px] font-medium text-[#111111] mb-3">
        Terms & Conditions
      </span> */}
      {/* {orderMetadata?.slice(0, -1)?.map((item, index) => {
          return (
            <li
              key={index}
              className="text-[12px] leading-[16px] font-normal text-[#666666] ml-4 mb-3"
            >
              {item}
            </li>
          );
        })} */}
      <div
        key={orderMetadata?.length}
        className="w-full text-center text-[12px] leading-[16px] font-normal text-[#666666] ml-4 mb-3"
      >
        <span onClick={handleClick} className="cursor-pointer underline">
          Terms&Conditions
        </span>{" "}
        apply
      </div>
    </footer>
  );
}
