import BlueTick from "@/assets/icons/payments/blueTick.svg";
export default function BillingCard({
  title,
  orderDetails,
  benefits,
  benefitsTitle,
}) {
  const sectionTitle = "text-[14px] leading-[20px] text-[#111111]";
  const rowBase = "flex flex-row items-center justify-between";
  const divider = "w-full bg-[#E1E1E9] my-4";
  const highlightDivider = "w-full h-[2px] bg-[#2020CE] my-4";
  return (
    <div className="w-full max-w-[420px] h-fit p-10 bg-[#EFEFFD] rounded-[16px] flex flex-col">
      <header className="text-[18px] leading-[28px] font-semibold text-[#111111]">
        {title}
      </header>

      <div className={`${divider} h-[1px]`} />

      <div
        className={`${rowBase} text-[14px] leading-[20px] font-semibold text-[#111111] mb-4`}
      >
        <span>{orderDetails?.orderItems?.[0]?.productName}</span>
        <span>₹{orderDetails?.orderItems?.[0]?.productOriginalPrice}</span>
      </div>

      {orderDetails?.orderItems?.[0]?.productDiscount ? (
        <div className={`${rowBase} ${sectionTitle} font-normal mb-4`}>
          <span>Discount</span>
          <span>₹{orderDetails?.orderItems?.[0]?.productDiscount}</span>
        </div>
      ) : null}

      {orderDetails?.orderItems?.[0]?.productMetaData?.freeText ? (
        <div className={`${rowBase} ${sectionTitle} font-semibold mb-4`}>
          <span>
            {orderDetails?.orderItems?.[0]?.productMetaData?.freeText}
          </span>
          <div className="flex flex-row items-center gap-1">
            <span className="text-[#666666] line-through font-medium">
              ₹
              {orderDetails?.orderItems?.[0]?.productMetaData?.freeCredits ||
                100}
            </span>
            <span className="font-medium">FREE</span>
          </div>
        </div>
      ) : null}

      <div className={`${rowBase} ${sectionTitle} font-normal`}>
        <span>
          GST ({orderDetails?.orderItems?.[0]?.productTaxRate || 18}%)
        </span>
        <span>₹{orderDetails?.orderItems?.[0]?.productTaxAmount}</span>
      </div>

      <div className={highlightDivider} />

      <div className={`${rowBase} ${sectionTitle} font-normal`}>
        <span>Total</span>
        <span className="text-[18px] leading-[28px] font-semibold text-[#2020CE]">
          ₹{orderDetails?.orderItems?.[0]?.productPrice}
        </span>
      </div>

      <div className={highlightDivider} />

      <footer className="flex flex-col mt-10">
        <span className={`${sectionTitle} font-medium`}>{benefitsTitle}</span>

        {benefits?.map((benefit, index) => (
          <div key={index} className="flex items-center gap-3 mt-3">
            <BlueTick />
            <span className={`${sectionTitle} font-normal`}>{benefit}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}
