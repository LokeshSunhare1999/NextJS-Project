import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PodcastCardProps } from "@/types";

const PodcastCard = ({ imgUrl, title, description, podcastId, }: PodcastCardProps) => {
  const router = useRouter();
  const handleViews = () => {
    router.push(`/podcast/${podcastId}`, { scroll: true })
  }

  return (
    <div className="cursor-pointer" onClick={handleViews}>
      <figure className="flex flex-col gap-3">
        <Image
          src={imgUrl}
          alt={title}
          width={174}
          height={174}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-white-1 text-16 font-bold truncate">{title}</h1>
          <h2 className="text-white-4 text-12 truncate capitalize">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
