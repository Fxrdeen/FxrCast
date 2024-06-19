import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { GenerateThumbnailProps } from "@/types";
import { Loader } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUploadFiles } from "@xixixao/uploadstuff/react";

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isAIThumbnail, setisAIThumbnail] = useState(false);
  const generateImage = async () => {};
  const { toast } = useToast();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const handleImage = async (blob: Blob, fileName: string) => {
    setisGenerating(true);
    setImage("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setImageStorageId(storageId);
      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setisGenerating(false);
      toast({ title: "Thumbnail generated successfully" });
    } catch (error) {
      console.log(error);
      toast({ title: "Error generating thumbnail", variant: "destructive" });
    }
  };
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({ title: "Error uploading image" });
    }
  };
  const [isGenerating, setisGenerating] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="generate_thumbnail">
        <Button
          onClick={() => setisAIThumbnail(true)}
          type="button"
          variant={"plain"}
          className={cn("", {
            "bg-black-6": isAIThumbnail,
          })}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          onClick={() => setisAIThumbnail(false)}
          type="button"
          variant={"plain"}
          className={cn("", {
            "bg-black-6": !isAIThumbnail,
          })}
        >
          Upload Custom Image
        </Button>
      </div>
      {isAIThumbnail ? (
        <div className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <Label className="text-16 text-white-1 font-bold">
              AI Prompt to Generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide Text to generate Thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className=" w-full max-w-[200px]">
            <Button
              onClick={generateImage}
              type="submit"
              className="text-16 bg-orange-1 py-4 font-bold text-white-1 "
            >
              {isGenerating ? (
                <>
                  {" "}
                  Generating
                  <Loader className="mr-2 animate-spin" size={20} />
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isGenerating ? (
            <Image
              alt="upload"
              src={"/icons/upload-image.svg"}
              width={40}
              height={40}
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              <Loader className="animate-spin" size={20} />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to Upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG, or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <div className="flex-center w-full">
          <Image
            width={200}
            height={200}
            src={image}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  );
};

export default GenerateThumbnail;
