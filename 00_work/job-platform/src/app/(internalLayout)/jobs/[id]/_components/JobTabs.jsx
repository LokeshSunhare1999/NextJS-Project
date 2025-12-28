"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
export default function JobTabs({ items, activeTab, jobId }) {
  const router = useRouter();

  return (
    <>
      <div className="w-full h-[55px] flex items-center gap-6 md:gap-[50px]">
        {items?.map((item, index) => {
          return (
            <Link
              href={`/jobs/${jobId}?tab=${index}`}
              className={`w-1/3 md:w-auto h-full flex justify-center items-center text-[14px] leading-[14px] md:text-[18px] font-medium md:leading-[18px] cursor-pointer  ${
                activeTab === index
                  ? "border-b-[1px] border-b-[#141482] text-[#141482]"
                  : "text-[#677995]"
              }`}
              key={item.key}
            >
              <div className="flex gap-2 items-center">
                {item.label}
                <span className="text-[#FF920D] text-[16px] font-semibold">
                  {item.count}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
