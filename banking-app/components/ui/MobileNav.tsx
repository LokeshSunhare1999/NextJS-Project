"use client";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();
  return (
    <section className=" max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="mb-12 cursor-pointer items-center flex gap-2"
            >
              <Image
                alt="logo"
                src="/icons/logo.svg"
                width={34}
                height={34}
                className="size-[24px] max-xl:size-14"
              />
              <h1 className="sidebar-logo">SBI</h1>
            </Link>
            {sidebarLinks.map((item) => {
              const isActive =
                pathname === item.route || pathname.startsWith(`${item.route}`);
              return (
                <Link
                  className={cn("sidebar-link", {
                    "bg-bank-gradient": isActive,
                  })}
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
                  <p
                    className={cn("sidebar-label", { "!text-white": isActive })}
                  >
                    {item.label}
                  </p>
                </Link>
              );
            })}
            USER
          </nav>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
