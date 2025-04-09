import { EmptyStateProps } from "@/types";
import Image from "next/image";
import React from "react";
import { Button } from "./button";
import Link from "next/link";

const EmptyState = ({
  title,
  search,
  buttonLink,
  buttonText,
}: EmptyStateProps) => {
  return (
    <section className="flex-center size-full flex-col gap-3">
      <Image
        src="/icons/emptyState.svg"
        alt="empty state icon"
        width={250}
        height={250}
      />
      <div className="flex-center w-full max-w-[254px] flex-col gap-3">
        <h1 className="text-16 text-center">{title}</h1>
        {search && <p className="text-14 text-center text-white-2">{search}</p>}
        {buttonLink && (
          <Button className="bg-orange-1">
            <Link href={buttonLink} className="gap-1 flex">
              <Image
                src="/icons/discover.svg"
                alt="discover"
                width={20}
                height={20}
              />
              <h1 className="text-16 font-extrabold text-white-1">{buttonText}</h1>
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default EmptyState;
