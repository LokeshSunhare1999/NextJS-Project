"use client";
import "./index.css";
import { useGetEmployerDetails, useGetPaymentStatus } from "@/apis/queryHooks";
import SaathiLogo from "@/assets/icons/common/saathiLogo.svg";
import Retry from "@/assets/icons/payments/retry.svg";
import {
  CONFIRMATION_SCREEN,
  PAYMENT_STATUS_POLLING_INTERVAL,
  PAYMENT_STATUS_POLLING_TIMEOUT,
} from "@/constants/payment";
import { useRef, useEffect, useState, useContext } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomCTA from "@/components/CustomCTA";
import { EmployerContext } from "@/providers/EmployerProvider";
import { parseCookies } from "nookies";
import { triggerEvent } from "@/utils/events";
import { JOB_EVENTS } from "@/constants/eventEnums";
export default function CreditsConfirmationScreen({}) {
  const [status, setStatus] = useState("PENDING");
  const [paymentData, setPaymentData] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [productId, setProductId] = useState(null);
  const timerRef = useRef(null);
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");
  const { employer, setEmployer } = useContext(EmployerContext);
  const cookies = parseCookies();

  const {
    data: employerData,
    status: employerStatus,
    refetch: refetchEmployerData,
  } = useGetEmployerDetails({
    userId: cookies?.userId,
    enabled: false,
  });

  const {
    data: paymentStatusData,
    refetch: refetchPaymentStatusData,
    isError: isPaymentStatusDataError,
  } = useGetPaymentStatus(orderId, {
    enabled: !!orderId,
  });
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/jobs");
    router.prefetch("/credits-payment");
    if (window?.sessionStorage?.getItem("orderId")) {
      const storedOrderId = window?.sessionStorage?.getItem("orderId");
      const storedProductId = window?.sessionStorage?.getItem("productId");
      setOrderId(storedOrderId);
      setProductId(storedProductId);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (orderId) {
      handleFetchPayments();
    }
  }, [orderId]);

  useEffect(() => {
    if (employerStatus === "success") {
      setEmployer(employerData);
    }
  }, [employerStatus]);

  useEffect(() => {
    if (status === "PENDING") {
      triggerEvent(JOB_EVENTS?.PAYMENT_PROCESSING_VIEWED, {
        transaction_id: paymentData?.uniqueOrderId,
        payment_mode: "upi",
        product_id: productId,
      });
    } else if (status === "VERIFIED") {
      triggerEvent(JOB_EVENTS?.PAYMENT_CONFIRMATION_VIEWED, {
        transaction_id: paymentData?.uniqueOrderId,
        payment_mode: "upi",
        product_id: productId,
      });
    } else if (status === "REJECTED") {
      triggerEvent(JOB_EVENTS?.PAYMENT_REJECTION_VIEWED, {
        transaction_id: paymentData?.uniqueOrderId,
        payment_mode: "upi",
        product_id: productId,
      });
    }
  }, [status, paymentData?.uniqueOrderId, productId]);

  const getPaymentStatus = async () => {
    const response = await refetchPaymentStatusData();
    const validTill = response?.data?.validTill;
    if (response?.data?.paymentStatus === "SUCCESS") {
      setStatus("VERIFIED");
      sessionStorage?.removeItem("orderId");
      sessionStorage?.removeItem("productId");
      refetchEmployerData();
      clearTimeout(timerRef.current);
      setTimeout(() => {
        router.push("/jobs");
      }, 3000);
    } else if (
      response?.data?.paymentStatus === "FAILED" ||
      validTill < Date.now()
    ) {
      setStatus("REJECTED");
      clearTimeout(timerRef.current);
    }
    setPaymentData(response?.data);
  };

  const handleFetchPayments = async () => {
    getPaymentStatus();
    checkForPaymentStatus();
  };

  const checkForPaymentStatus = () => {
    let startTime = Date.now();
    const checkStatus = async () => {
      getPaymentStatus();

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= PAYMENT_STATUS_POLLING_TIMEOUT) {
        startTime = Date.now();

        /* Do after polling ends */
        clearTimeout(timerRef.current);
        return;
      } else
        timerRef.current = setTimeout(
          checkStatus,
          PAYMENT_STATUS_POLLING_INTERVAL
        );
    };
    checkStatus();
  };

  const handleRetryPayment = () => {
    router.push(`/credits-payment?packageId=${packageId}`);
    sessionStorage?.removeItem("orderId");
    sessionStorage?.removeItem("productId");
  };

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full h-[80px] border-b-[1px] border-b-[#EEEEEE] flex flex-row bg-white px-10 items-center">
        <span onClick={() => router.push("/jobs")} className="cursor-pointer">
          <SaathiLogo />
        </span>
      </nav>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full p-4 max-w-[696px] flex flex-col mt-7">
          <header className="text-[22px] leading-[28px] font-semibold text-[#111111]">
            Payment Confirmation
          </header>
          <div
            className="w-full rounded-[16px] p-10 border-[1px] mt-7 flex flex-col items-center justify-center gap-6"
            style={{
              background: CONFIRMATION_SCREEN?.[status]?.bgColor,
              borderColor: CONFIRMATION_SCREEN?.[status]?.borderColor,
            }}
          >
            {CONFIRMATION_SCREEN?.[status]?.icon}
            <div className="flex flex-col items-center">
              <span className="text-[32px] leading-[40px] font-semibold text-[#111111]">
                ₹{paymentData?.amount || 0}
              </span>
              <span className="text-[14px] leading-[20px] font-medium text-[#111111]">
                {CONFIRMATION_SCREEN?.[status]?.desc}
              </span>
            </div>
            <div className="flex flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-[12px] leading-[20px] font-semibold text-[#A09986] uppercase">
                  Transaction ID
                </span>
                <span className="text-[14px] leading-[20px] font-medium text-[#111111]">
                  {paymentData?.uniqueOrderId || "-----"}
                </span>
              </div>
              <div className="bg-[#CFC7AD] h-[44px] w-[1px]" />
              <div className="flex flex-col items-center">
                <span className="text-[12px] leading-[20px] font-semibold text-[#A09986] uppercase">
                  Payment Mode
                </span>
                <span className="text-[14px] leading-[20px] font-medium text-[#111111]">
                  {paymentData?.paymentMode || "-----"}
                </span>
              </div>
            </div>
            {status === "REJECTED" ? (
              <div className="w-full items-center flex flex-col">
                <CustomCTA
                  borderColor={"#20247E"}
                  backgroundColor="#FFFFFF"
                  textColor="#20247E"
                  hoverBgColor={"#FFFFFF"}
                  hoverTextColor={"#20247E"}
                  hoverBorderColor={"#20247E"}
                  title={"Retry Payment"}
                  borderRadius="8px"
                  height="48px"
                  width={"169px"}
                  fontWeight="600"
                  border={"2px solid"}
                  rightIcon={<Retry />}
                  onClickFn={handleRetryPayment}
                />
              </div>
            ) : null}
          </div>
          <span
            className="w-full text-center text-[14px] leading-[20px] font-medium text-[#111111] mt-[18px] hyperlink"
            dangerouslySetInnerHTML={{
              __html: CONFIRMATION_SCREEN?.[status]?.footer,
            }}
          ></span>
        </div>
      </div>
    </main>
  );
}
