"use client";
import PodCastCard from "@/components/PostCastCard";
import { podcastData } from "@/constants";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/clerk-react";

const Home = () => {
  // const tasks = useQuery(api.tasks.get);
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <div className="flex min-h-screen flex-col items-center justify-between p-24">
          {/* {tasks?.map(({ _id, text }) => (
            <div className="text-white-1" key={_id}>
              {text}
            </div>
          ))} */}
        </div>
        <div className="podcast_grid">
          {podcastData.map((podcast) => (
            <PodCastCard
              key={podcast.id}
              imgUrl={podcast.imgURL}
              title={podcast.title}
              description={podcast.description}
              podCastId={podcast.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
