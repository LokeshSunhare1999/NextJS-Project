'use client';
import PodcastCard from "@/components/PodcastCard";
import PodcastDetailsPlayer from "@/components/PodcastDetailsPlayer";
import EmptyState from "@/components/ui/EmptyState";
import LoaderSpinner from "@/components/ui/LoaderSpinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";
import React from "react";

const PodcastsDetails = ({ params: { podcastId } }: { params: { podcastId: Id<'podcasts'> } }) => {
  const {user, isLoaded} = useUser()
  const podcast = useQuery(api.podcasts.getPodcastById, { podcastId });

  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, { podcastId });

  
  // if (!similarPodcasts || !podcast) return <LoaderSpinner />
  if (!isLoaded || !similarPodcasts || !podcast) return <LoaderSpinner />;
  const isOwner = user?.id === podcast?.authorId;
  
  return (<section className="flex w-full flex-col">
    <header className="mt-9 flex items-center justify-between">
      <h1 className="text-200 font-bold text-white-1">Currently Playing</h1>
      <figure className="flex gap-3">
        <Image
          src="/icons/headphone.svg"
          alt="headphone icon"
          width={30}
          height={30}
        />
        <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
      </figure>
    </header>
    <PodcastDetailsPlayer
      isOwner={isOwner}
      podcastId={podcast._id}
      {...podcast}
    />
    <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">{podcast?.podcastDescription}</p>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-18 font-bold text-white-1">Transcription</h1>
        <p className="text-16 font-medium text-white-2">{podcast?.voicePrompt}</p>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-18 font-bold text-white-1">Thumbnail Prompt</h1>
        <p className="text-16 font-medium text-white-2">{podcast?.imagePrompt}</p>
      </div>
    </div>
    <section className="mt-8 flex flex-col gap-5">
      <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>
      {similarPodcasts && similarPodcasts.length > 0 ? (
        <div className="podcast_grid">
          {similarPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
            <PodcastCard
              key={_id}
              imgUrl={imageUrl}
              title={podcastTitle}
              description={podcastDescription}
              podcastId={_id}
            />
          ))}
        </div>
      ) : (
        <div className="flex-center text-white-1">
          <EmptyState
            title="No similar podcasts found"
            buttonLink='/discover'
            buttonText="Discover more podcasts"
          />
        </div>
      )}
    </section>
  </section>);
};

export default PodcastsDetails;
