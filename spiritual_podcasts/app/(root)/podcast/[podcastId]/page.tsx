import React from "react";

const PodcastsDetails = ({ params }: { params: { podcastId: string } }) => {
  return <p className="text-white-1">PodcastsDetails for {params.podcastId}</p>;
};

export default PodcastsDetails;
