import { GeneratePodcastProps } from "@/types";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { generateUploadUrl } from "@/convex/files";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { mutation } from "@/convex/_generated/server";
import { useToast } from "./ui/use-toast";
const useGeneratePodcast = ({
  setAudio,
  voicePrompt,
  voiceType,
  setAudioStorageId,
}: GeneratePodcastProps) => {
  const [isGenerating, setisGenerating] = useState(false);
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);
  const { toast } = useToast();
  const generatePodcast = async () => {
    setisGenerating(true);
    setAudio("");
    if (!voicePrompt) {
      toast({ title: "Please provide a voice type" });
      return setisGenerating(false);
    }
    try {
      const response = await getPodcastAudio({
        voice: voiceType,
        input: voicePrompt,
      });
      const blob = new Blob([response], { type: "/audio/mpeg" });
      const filename = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], filename, { type: "/audio/mpeg" });
      startUpload([file]);
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      setAudioStorageId(storageId);
      const getAudioUrl = useMutation(api.podcasts.getUrl);
      const audioUrl = await getAudioUrl({ storageId });
      setAudio(audioUrl!);
      setisGenerating(false);
      toast({ title: "Podcast generated successfully" });
    } catch (error) {
      console.log("Error generating podcast", error);
      toast({ title: "Error creating a podcast", variant: "destructive" });
      setisGenerating(false);
    }
  };
  return {
    isGenerating,
    generatePodcast,
  };
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast } = useGeneratePodcast(props);
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 text-white-1 font-bold">
          AI Prompt to Generate PodCast
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide Text to generate Audio"
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          onClick={generatePodcast}
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
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) =>
            props.setAudioDuration(e.currentTarget.duration)
          }
        />
      )}
    </div>
  );
};

export default GeneratePodcast;
