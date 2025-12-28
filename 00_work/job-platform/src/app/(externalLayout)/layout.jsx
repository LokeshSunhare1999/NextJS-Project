"use client";
import "@ant-design/v5-patch-for-react-19";
import { useEffect, useContext } from "react";
import "../../styles/globals.css";
import { EmployerContext } from "@/providers/EmployerProvider";
import { useGetEmployerDetails } from "@/apis/queryHooks";
import { parseCookies, setCookie } from "nookies";
import { COOKIES_MAX_AGE } from "@/constants";
import { useRouter, usePathname } from "next/navigation";

export default function ExternalLayout({ children }) {
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
    if (employerStatus === "success") {
      setEmployer(employerData);
      setCookie(null, "employerId", employerData?._id, {
        maxAge: COOKIES_MAX_AGE,
        path: "/",
      });
      
    }
  }, [employerStatus]);

  return <div className={`relative min-h-screen w-full`}>{children}</div>;
}
