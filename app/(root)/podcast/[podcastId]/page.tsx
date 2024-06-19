"use client";
import EmptyState from "@/components/EmptyState";
import LoaderSpinner from "@/components/LoaderSpinner";
import PodcastDetailPlayer from "@/components/PodcastDetailPlayer";
import PodCastCard from "@/components/PostCastCard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Image from "next/image";

const PodCastDetails = ({
  params,
}: {
  params: { podcastId: Id<"podcasts"> };
}) => {
  const podcast = useQuery(api.podcasts.getPodcastById, {
    podcastId: params.podcastId,
  });
  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId: params.podcastId,
  });
  const { user } = useUser();
  const isOwner = user?.id === podcast?.authorId;
  if (!similarPodcasts || !podcast) return <LoaderSpinner />;
  return (
    <section className="flex w-full flex-col">
      <header className="mt-9 flex items-center justify-between">
        <h1 className="text-20 font-bold text-white-1">Currently Playing</h1>
        <figure className="flex gap-3">
          <Image
            src={"/icons/headphone.svg"}
            width={24}
            height={24}
            alt="headphone"
          />
          <h2 className="text-16 font-bold text-white-1">{podcast?.views}</h2>
        </figure>
      </header>
      <PodcastDetailPlayer
        isOwner={isOwner}
        {...podcast}
        podcastId={podcast._id}
      />
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">
        {podcast?.podcastDescription}
      </p>

      <section className="mt-8 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Similar PodCasts</h1>
        {similarPodcasts && similarPodcasts.length > 0 ? (
          <div className="podcast_grid">
            {similarPodcasts?.map((podcast) => (
              <PodCastCard
                key={podcast._id}
                imgUrl={podcast.imageUrl!}
                title={podcast.podcastTitle}
                description={podcast.podcastDescription}
                podcastId={podcast._id}
              />
            ))}
          </div>
        ) : (
          <>
            <EmptyState
              title="No similar podcasts found"
              buttonLink="/discover"
              buttonText="Discover more podcasts"
            />
          </>
        )}
      </section>
    </section>
  );
};

export default PodCastDetails;
