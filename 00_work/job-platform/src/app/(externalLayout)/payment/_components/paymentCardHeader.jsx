import "./index.css";
export default function PaymentCardHeader({
  orderDetails,
  productDetails,
  desc,
  showIcon = false,
}) {
  const validity = orderDetails?.orderItems?.[0]?.productMetaData?.validity;
  return (
    <header className="w-full h-[92px] md:h-[72px] border-b-[1px] border-[#EEEEEE] md:rounded-t-[16px] flex flex-row items-center justify-between px-3 md:px-5 bgBase paymentBannerBg ">
      <div className="flex flex-row items-center justify-start gap-3">
        <div className="flex flex-col">
          <span className="text-[18px] md:text-[22px] leading-[28px] font-semibold text-[#FFFFFF]">
            {productDetails?.productDescription}
          </span>
          <span className="text-[12px] md:text-[13px] leading-[20px] font-normal text-[#E0DAFC] flex flex-col md:flex-row md:items-center gap-[2px] md:gap-5">
            <div className="flex flex-row items-center gap-2">
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.95215 11.5C3.22828 11.5 3.45215 11.7239 3.45215 12C3.45215 12.2761 3.22828 12.5 2.95215 12.5H2.94629C2.67015 12.5 2.44629 12.2761 2.44629 12C2.44629 11.7239 2.67015 11.5 2.94629 11.5H2.95215ZM14.9463 11.5C15.2223 11.5002 15.4463 11.724 15.4463 12C15.4463 12.276 15.2223 12.4998 14.9463 12.5H6.2793C6.0033 12.4998 5.7793 12.276 5.7793 12C5.7793 11.724 6.0033 11.5002 6.2793 11.5H14.9463ZM2.95215 7.5C3.22828 7.50001 3.45215 7.72387 3.45215 8C3.45215 8.27613 3.22828 8.49999 2.95215 8.5H2.94629C2.67015 8.5 2.44629 8.27614 2.44629 8C2.44629 7.72386 2.67015 7.5 2.94629 7.5H2.95215ZM14.9463 7.5C15.2223 7.50018 15.4463 7.72397 15.4463 8C15.4463 8.27603 15.2223 8.49982 14.9463 8.5H6.2793C6.0033 8.49982 5.7793 8.27603 5.7793 8C5.7793 7.72397 6.0033 7.50018 6.2793 7.5H14.9463ZM2.95215 3.5C3.22828 3.50001 3.45215 3.72387 3.45215 4C3.45215 4.27613 3.22828 4.49999 2.95215 4.5H2.94629C2.67015 4.5 2.44629 4.27614 2.44629 4C2.44629 3.72386 2.67015 3.5 2.94629 3.5H2.95215ZM14.9463 3.5C15.2223 3.50018 15.4463 3.72397 15.4463 4C15.4463 4.27603 15.2223 4.49982 14.9463 4.5H6.2793C6.0033 4.49982 5.7793 4.27603 5.7793 4C5.7793 3.72397 6.0033 3.50018 6.2793 3.5H14.9463Z"
                  fill="#01D033"
                />
              </svg>

              <span>
                {
                  orderDetails?.orderItems?.[0]?.productMetaData
                    ?.bottomTexts?.[0]
                }
              </span>
            </div>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center">
        <span className="text-[20px] md:text-[24px] leading-[32px] md:leading-[28px] font-semibold text-[#390192]">
          Pay ₹{productDetails?.productPrice || 0}
        </span>
      </div>
    </header>
  );
}
