"use client";
import { useState, useEffect, useContext } from "react";
import PaymentOptions from "./paymentOptions";
import {
  usePostCreateOrder,
  usePostCreatePayment,
  usePostVerifyVPA,
  useGetPaymentStatus,
} from "@/apis/queryHooks";
import BillingCard from "./billingCard";
import { scrollToTop } from "@/utils/helpers";
import { EmployerContext } from "@/providers/EmployerProvider";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import ExternalHeader from "@/components/ExternalHeader";
import {
  BANNER_BENEFITS,
  BILLING_BENEFITS,
  SUBSCRIPTION_BENEFITS,
} from "@/constants/payment";
import PaymentCardHeader from "./paymentCardHeader";
import { triggerEvent } from "@/utils/events";
import { JOB_EVENTS } from "@/constants/eventEnums";

export default function PaymentScreen() {
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
    router.prefetch("/confirm-payment");
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
      id: employer?.userId,
      payload: {
        typeId: employer?._id,
        userType: "EMPLOYER",
        items: [employer?.subscriptionItem],
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
        //   router.push("/confirm-payment");
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
        /**for event */
        sessionStorage?.setItem(
          "productId",
          orderDetails?.orderItems?.[0]?.productId
        );
        router.push("/confirm-payment");
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
    triggerEvent(JOB_EVENTS?.PAYMENT_PAGE_LOAD, {
      last_page: "payment",
    });

    /*   
    if (window?.sessionStorage?.getItem("orderId")) {
      router.push("/confirm-payment");
    } 
    */
  }, []);

  useEffect(() => {
    if (employer?._id) {
      createNewOrder();
    }
  }, [employer]);

  return (
    <main className="min-h-screen flex flex-col">
      <ExternalHeader />
      <div className="md:hidden">
        <PaymentCardHeader
          orderDetails={orderDetails}
          productDetails={orderDetails?.orderItems?.[0]}
          desc={[...SUBSCRIPTION_BENEFITS]}
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
              desc={[...BANNER_BENEFITS]}
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
              disablePaymentBtn={
                disablePaymentBtn || triggerCreateOrderStatus === "pending"
              }
              showIcon={false}
            />
            {
              <BillingCard
                title={"Membership Details"}
                orderDetails={orderDetails}
                benefitsTitle="Membership Benefits"
                benefits={BILLING_BENEFITS}
              />
            }
          </div>
        </div>
      </div>
    </main>
  );
}
