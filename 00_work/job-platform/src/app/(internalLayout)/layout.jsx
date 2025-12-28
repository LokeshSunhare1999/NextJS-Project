"use client";
import "@ant-design/v5-patch-for-react-19";
import { useEffect, useContext } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { EmployerContext } from "@/providers/EmployerProvider";
import { useGetEmployerDetails } from "@/apis/queryHooks";
import { parseCookies, setCookie } from "nookies";
import { COOKIES_MAX_AGE } from "@/constants";
import { useRouter, usePathname } from "next/navigation";
import Hamburger from "@/components/Hamburger";

export default function InternalLayout({ children }) {
  const cookies = parseCookies();
  const router = useRouter();
  const currentPathname = usePathname();
  const { employer, setEmployer } = useContext(EmployerContext);
  const { data: employerData, status: employerStatus } = useGetEmployerDetails({
    userId: cookies?.userId,
  });

  useEffect(() => {
    if (!cookies.accessToken) {
      sessionStorage?.setItem("redirectUrl", currentPathname);
      router.replace("/login");
    }
  }, []);

  useEffect(() => {
    if (employerStatus === "success" && employerData) {
      setEmployer((prev) => ({
        ...prev,
        ...employerData,
      }));
      setCookie(null, "employerId", employerData?._id, {
        maxAge: COOKIES_MAX_AGE,
        path: "/",
      });
    }
  }, [employerStatus, employerData]);

  return (
    <div className={`relative min-h-screen w-full bg-[#F5F6FA]`}>
      <Header
        employerName={employerData?.companyRegisteredName}
        employerPhoneNo={employerData?.phoneNo}
        isCreditsPurchased={employerData?.isCreditsPurchased}
        router={router}
        creditBalance={employerData?.creditBalance}
      />
      <Sidebar />
      <Hamburger />
      {children}
    </div>
  );
}
