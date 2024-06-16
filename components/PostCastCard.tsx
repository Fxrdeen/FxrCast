import Image from "next/image";

type Props = {
  imgUrl: string;
  title: string;
  description: string;
  podCastId: number;
};
const PodCastCard = ({ description, imgUrl, podCastId, title }: Props) => {
  return (
    <div className="cursor-pointer">
      <figure className="flex flex-col gap-2">
        <Image
          src={imgUrl}
          alt={title}
          width={174}
          height={174}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
        />
        <div className="flex flex-col">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal capitalize text-white-4">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodCastCard;