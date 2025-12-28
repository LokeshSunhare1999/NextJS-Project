import CustomCTA from "@/components/CustomCTA";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CreditCard = ({ plan, idx, handleClick }) => {
  if (plan?.price == "0 only") return null;
  return (
    <div
      className={`relative bg-[url('/pricingCardBg.png')] flex-shrink-0 flex flex-col items-center justify-between rounded-2xl pt-9 pb-4 px-4 w-full max-w-[359px] sm:w-[248px] text-white ${
        plan?.recommended ? "border-[#FFC043]" : "border-transparent"
      }`}
    >
      {idx === 2 && (
        <span className="absolute font-semibold top-0 left-1/2 -translate-x-1/2 translate-y-[-50%] bg-[#FFC043] text-[#24008C] text-xs px-3 py-1 rounded-full shadow-lg">
          RECOMMENDED
        </span>
      )}
      <div className="relative w-full flex justify-center items-center">
        <div className="rounded-full w-32 h-32 flex items-center justify-center text-2xl font-bold text-black mb-4 border-[4px] border-[#8E6218] bg-[linear-gradient(302deg,_#8E6218_-43.67%,_#F9DDAB_26.17%,_#9C7228_96.01%)]">
          {plan?.credits}
        </div>
        {plan?.benefitsText && (
          <div className="bg-[#300195] absolute bottom-[15px] border-2 border-[#8E6218] rounded-[100px] flex justify-center items-center">
            <span className="text-xs font-semibold px-1 z-100 bg-gradient-to-r from-[#24008C] to-[#4C00AD] bg-[conic-gradient(at_top_right,_#8E6218_-43.67%,_#F9DDAB_26.17%,_#9C7228_96.01%)] bg-clip-text text-transparent">
              {plan?.benefitsText}
            </span>
          </div>
        )}
      </div>
      <div className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#D499FF] to-[#4DE7FF] bg-clip-text text-transparent">
        ₹{plan?.price}
      </div>
      <div className="text-[11px] justify-center items-center flex flex-col text-[#b699dd] mb-4">
        <span>{plan?.validityText} validity</span>
        <span> Amount exclusive of GST</span>
      </div>
      <CustomCTA
        backgroundImg="linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)"
        width="100%"
        height="58px"
        hoverTextColor="#111"
        textColor="#111"
        fontSize="20px"
        fontWeight="700"
        title="Buy Now"
        onClickFn={handleClick}
      />
    </div>
  );
};

const PricingCards = ({ pricingPlans, handleModalClose }) => {
  const router = useRouter();
  const carouselRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    router.prefetch("/credits-payment");
    const timeout = setTimeout(updateScrollButtons, 100);
    return () => clearTimeout(timeout);
  }, [pricingPlans]);

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scrollByCards = (direction = "right") => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.children[0]?.offsetWidth || 300;
    const scrollAmount = (cardWidth + 16) * (direction === "right" ? 1 : -1);
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
    setTimeout(updateScrollButtons, 300);
  };
  const CarouselArrowButton = ({ direction, onClick, disabled, className }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`absolute w-[36px] h-[36px] top-1/2 -translate-y-1/2 z-10 bg-white border border-[#ddd] rounded-lg shadow-lg p-2 flex items-center justify-center ${className}`}
      aria-label={`Scroll ${direction}`}
    >
      <span className="text-xl text-[#4C00AD] cursor-pointer">
        {direction === "left" ? "<" : ">"}
      </span>
    </button>
  );

  return (
    <div className="relative w-full z-50">
      <CarouselArrowButton
        direction="left"
        onClick={() => scrollByCards("left")}
        disabled={!canScrollLeft}
        className="left-2 hidden md:flex"
      />

      <div
        ref={carouselRef}
        className="flex px-4 justify-start gap-4 mt-10 pt-5 
        overflow-x-auto scrollbar-hide 
        flex-col md:flex-row"
        style={{ scrollBehavior: "smooth" }}
        onScroll={updateScrollButtons}
      >
        {pricingPlans?.map((plan, idx) => (
          <CreditCard
            key={plan?.packageId}
            plan={plan}
            idx={idx}
            handleClick={() => {
              router.push(`/credits-payment?packageId=${plan?.packageId}`);
              handleModalClose && handleModalClose();
            }}
          />
        ))}
      </div>
      <CarouselArrowButton
        direction="right"
        onClick={() => scrollByCards("right")}
        disabled={!canScrollRight}
        className="right-2 hidden md:flex"
      />
    </div>
  );
};

export default PricingCards;
