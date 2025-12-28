"use client";
import { useState, useEffect, useContext } from "react";
import PaymentOptions from "@/app/(externalLayout)/payment/_components/paymentOptions";
import SaathiLogo from "@/assets/icons/common/saathiLogo.svg";
import {
  usePostCreateOrder,
  usePostCreatePayment,
  usePostVerifyVPA,
  useGetPaymentStatus,
} from "@/apis/queryHooks";
import BillingCard from "@/app/(externalLayout)/payment/_components/billingCard";
import { scrollToTop } from "@/utils/helpers";
import { EmployerContext } from "@/providers/EmployerProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { parseCookies } from "nookies";
import { CREDITS_BENEFITS } from "@/constants/payment";
import { JOB_EVENTS } from "@/constants/eventEnums";
import { triggerEvent } from "@/utils/events";
import PaymentCardHeader from "@/app/(externalLayout)/payment/_components/paymentCardHeader";
import BackIcon from "@/assets/icons/common/backIcon.svg";

export default function CreditsPaymentScreen() {
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [vpa, setVpa] = useState("");
  const [isVpaVerified, setIsVpaVerified] = useState(false);
  const [errText, setErrText] = useState("");
  const [orderDetails, setOrderDetails] = useState({});
  const [disablePaymentBtn, setDisablePaymentBtn] = useState(false);

  const { employer } = useContext(EmployerContext);
  const router = useRouter();
  const cookies = parseCookies();
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");

  const { mutateAsync: triggerCreateOrder, status: triggerCreateOrderStatus } =
    usePostCreateOrder();
  const { mutateAsync: triggerCreatePayment, status: createPaymentStatus } =
    usePostCreatePayment();
  const { mutateAsync: triggerVerifyVPA, status: verifyVPAStatus } =
    usePostVerifyVPA();
  const {
    data: paymentStatusData,
    refetch: refetchPaymentStatusData,
    isError: isPaymentStatusDataError,
  } = useGetPaymentStatus(orderId, {
    enabled: false,
  });

  useEffect(() => {
    router.prefetch("/confirm-credits-payment");
  }, []);

  const handleVPAChange = (value) => {
    if (value?.length === 1) {
      triggerEvent(JOB_EVENTS?.PAYMENT_UPIID_ENTERED);
    }
    setVpa(value);
    setIsVpaVerified(false);
  };

  const createNewOrder = () => {
    triggerCreateOrder({
      id: cookies?.userId,
      payload: {
        typeId: cookies?.employerId,
        userType: "EMPLOYER",
        items: [
          {
            productId: packageId,
            productCategory: "EMPLOYER_CREDITS",
            productQuantity: 1,
          },
        ],
        sourceType: "WEB",
      },
    })
      .then((response) => {
        // const pollingCondition =
        //   response.validTill > Date.now() &&
        //   response?.orderStatus === 'PENDING';
        // setValidTill(Math.floor((response?.validTill - Date.now()) / 1000));
        // setShouldStartPoll(pollingCondition);
        // if (response?.orderStatus === "PENDING") {
        //   router.push(`/confirm-credits-payment?packageId=${packageId}`);
        // }
        setOrderDetails(response);
        setOrderId(response._id);
      })
      .catch((err) => {});
  };

  const handleVerifyVPA = () => {
    // if (paymentStatusData?.paymentStatus === "PENDING") return;
    // triggerVerifyVPA({
    //   vpa,
    // })
    //   .then((res) => {
    //     if (res.status === "VALID") {
    //       setIsVpaVerified(true);
    //       setErrText("");
    //     }
    //   })
    //   .catch((err) => {
    //     setErrText("Invalid UPI, try again");
    //     setIsVpaVerified(false);
    //   });
  };

  const handleVPAPayment = () => {
    triggerEvent(JOB_EVENTS?.PAYMENT_PAYCTA_CLICK);

    setDisablePaymentBtn(true);

    triggerCreatePayment({
      orderId,
      upiVpa: vpa,
    })
      .then((response) => {
        sessionStorage?.setItem("orderId", orderId);
        sessionStorage?.setItem(
          "productId",
          orderDetails?.orderItems?.[0]?.productId
        );
        router.push(`/confirm-credits-payment?packageId=${packageId}`);
      })
      .catch((err) => {
        if (
          err?.response?.data?.error?.message === "Invalid UPI, try again" ||
          err?.response?.data?.error?.message ===
            `"upiVpa" is not allowed to be empty`
        ) {
          triggerEvent(JOB_EVENTS?.PAYMENT_INVALIDUPI_ERROR);
        }
        if (err?.response?.data?.error?.message) {
          enqueueSnackbar(err?.response?.data?.error?.message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Failed to process payment, please try again later", {
            variant: "error",
          });
        }
        setDisablePaymentBtn(false);
        createNewOrder();
      });
  };

  useEffect(() => {
    scrollToTop();
    /*
    if (window?.sessionStorage?.getItem("orderId")) {
      router.push(`/confirm-credits-payment?packageId=${packageId}`);
    }
    */
    triggerEvent(JOB_EVENTS?.PAYMENT_PAGE_LOAD, {
      last_page: "credit_payment",
    });
    if (cookies?.userId) {
      createNewOrder();
    } else if (!cookies?.accessToken) {
      router.push("/login");
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full h-[80px] border-b-[1px] border-b-[#EEEEEE] flex flex-row bg-white px-6 items-center">
        <span
          onClick={() => router.replace("/buy-credits")}
          className="flex items-center font-semibold gap-1 text-[16px] leading-[28px] text-[#111111] cursor-pointer"
        >
          <BackIcon />
          Payment
        </span>
      </nav>
      <div className="md:hidden">
        <PaymentCardHeader
          orderDetails={orderDetails}
          productDetails={orderDetails?.orderItems?.[0]}
          desc={CREDITS_BENEFITS}
          showIcon={false}
        />
      </div>
      <div className="w-full flex items-center justify-center p-4">
        <div className="w-full max-w-[1140px] flex flex-col">
          <header className="font-semibold text-[22px] text-[#111111] leading-[28px] my-7">
            Payment
          </header>
          <div className="flex flex-col-reverse items-center lg:items-stretch lg:flex-row gap-6">
            <PaymentOptions
              companyName={companyName}
              setCompanyName={setCompanyName}
              gstNumber={gstNumber}
              setGstNumber={setGstNumber}
              vpa={vpa}
              handleVPAChange={handleVPAChange}
              isVpaVerified={isVpaVerified}
              handleVerifyVPA={handleVerifyVPA}
              handleVPAPayment={handleVPAPayment}
              errText={errText}
              orderDetails={orderDetails}
              triggerCreateOrderStatus={triggerCreateOrderStatus}
              desc={CREDITS_BENEFITS}
              showIcon={true}
              disablePaymentBtn={
                disablePaymentBtn || triggerCreateOrderStatus === "pending"
              }
            />
            <BillingCard
              title={"Credit Details"}
              orderDetails={orderDetails}
              benefitsTitle="Credits Benefits"
              benefits={
                orderDetails?.orderItems?.[0]?.productMetaData?.bottomTexts
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
