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
import { getVideoMetadata } from "@remotion/renderer";
import { metadata } from "../app/layout";

const defaultProps: captionedVideoSchema = {
  title: "",
  src: staticFile("enhancer2.mp4"),
  subtitles: [],
  brolls: [],
  posX: "50"
} 

// async () => {
//   let matadata:any = await getVideoMetadata(staticFile("enhancer2.mp4"))

//   console.log("MEtadata", metadata)

// }

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
        calculateMetadata={async ({ props }) => {
          // const response1 = await fetch("http://localhost:3001/api/broll", {
          //   method: 'POST',
           
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ src: "2.json" })
          // });
          // console.log(await response1.json())
          // let data1 = await response1.json();

          // const response2 = await fetch("http://localhost:3001/api/captions", {
          //   method: 'POST',
          //   mode: "no-cors",
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ src: "2.json" })
          // });
          // let data2 = await response2.json();

          let data:any = await fetch(staticFile('enhancer2.json'))
          data = await data.json()

          let data2:any = await fetch(staticFile('broll-enhancer2.json'))
          data2 = await data2.json()

   
          return {
            props: {
              ...props,
              subtitles: data.transcription,
              brolls: data2
            },
          };
        }}
   
      />
     
    </>
  );
};
