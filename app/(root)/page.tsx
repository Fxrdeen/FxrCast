import PodCastCard from "@/components/PostCastCard";
import { Button } from "@/components/ui/button";
import { podcastData } from "@/constants";

const Home = () => {
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
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
