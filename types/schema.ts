
export type SubtitleProp = {
	startInSeconds: number;
	text: string;
};

export type BrollProp = {
	startInSeconds: number;
	text: string;
  videoSrc: string;
};

export type captionedVideoSchema = {
	src: string,
	title: string,
	subtitles: SubtitleProp[],
  brolls: BrollProp[],
	posX: string
}

export type RenderRequest = {
  id: string,
  inputProps: captionedVideoSchema,
};

export type ProgressRequest = {
  bucketName: string,
  id: string,
};

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };
