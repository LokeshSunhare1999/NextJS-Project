"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer items-center flex gap-2">
          <Image
            alt="logo"
            src="/icons/logo.svg"
            width={34}
            height={34}
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}`);
          return (
            <Link
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
              href={item.route}
              key={item.label}
            >
              <div className="relative size-6">
                <Image
                  alt={item.label}
                  src={item.imgURL}
                  fill
                  className={cn({ "brightness-[3] invert-0": isActive })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {item.label}
              </p>
            </Link>
          );
        })}
        USER
      </nav>
      FOOTER Nav
    </section>
  );
};

export default Sidebar;
