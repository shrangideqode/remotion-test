import { Composition, staticFile } from "remotion";

import {
  COMP_NAME,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { CaptionedVideo } from "./CaptionedVideo";
import { captionedVideoSchema } from "../types/schema";

const defaultProps: captionedVideoSchema = {
  title: "",
  src: staticFile("2.mp4"),
  subtitles: [],
  brolls: [],
  posX: "0"
} 

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMP_NAME}
        component={CaptionedVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultProps}
      />
     
    </>
  );
};
