"use client";
import { EmployerContext } from "@/providers/EmployerProvider";
import { useRouter } from "next/navigation";
import React, { Suspense, useContext, useEffect } from "react";
import PostJobPageComponent from "../post-job/_components/PostJobPageComponent";

const Page = () => {
  const { employer } = useContext(EmployerContext);
  const router = useRouter();

  // useEffect(() => {
  //   router.prefetch("/jobs");
  // }, []);

  useEffect(() => {
    if (employer?.totalPostedJobs > 0) {
      router.push("/jobs");
    }
  }, [employer, router]);

  return (
    <Suspense fallback={<div></div>}>
      <PostJobPageComponent isFirstJob />
    </Suspense>
  );
};

export default Page;
