"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/lib/useDebounce";

const Searchbar = () => {
  const [search, setsearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const debouncedValue = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedValue) {
      router.push(`/discover?search=${debouncedValue}`, { scroll: true });
    } else if (!debouncedValue && pathname === "/discover") {
      router.push("/discover", { scroll: true });
    }
  }, [router, pathname, debouncedValue]);

  return (
    <div className="relative mt-8 block">
      <Input
        type="text"
        className="input-class py-6 pl-12 focus-visible:ring-offset-yellow-1"
        placeholder="Search Podcasts"
        value={search}
        onChange={(e) => setsearch(e.target.value)}
        onLoad={() => setsearch("")}
      />
      <Image
        src="/icons/search.svg"
        alt="search icon"
        width={20}
        height={20}
        className="absolute top-3.5 left-4  cursor-pointer"
      />
    </div>
  );
};

export default Searchbar;
