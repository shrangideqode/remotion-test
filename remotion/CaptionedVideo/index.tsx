import {useCallback, useEffect, useState} from 'react';
import {
	AbsoluteFill,
	CalculateMetadataFunction,
	cancelRender,
	continueRender,
	delayRender,
	OffthreadVideo,
	Sequence,
	useVideoConfig,
	Video,
} from 'remotion';
import {z} from 'zod';
import Subtitle from './Subtitle';
import {getVideoMetadata} from '@remotion/media-utils';
import {loadFont} from '../load-font';
import {NoCaptionFile} from './NoCaptionFile';
import { getStaticFiles, watchStaticFile } from '@remotion/studio';

export type SubtitleProp = {
	startInSeconds: number;
	text: string;
};

export type captionedVideoSchema = {
	src: string,
	title: string,
	subtitles: SubtitleProp[],
	posX: string
}

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
captionedVideoSchema
> = async ({props}) => {
	const fps = 30;
	const metadata = await getVideoMetadata(props.src);

	return {
		fps,
		durationInFrames: Math.floor(metadata.durationInSeconds * fps),
	};
};

const getFileExists = (file: string) => {
	const files = getStaticFiles();
	const fileExists = files.find((f) => {
		return f.src === file;
	});
	return Boolean(fileExists);
};

export const CaptionedVideo: React.FC<
	 captionedVideoSchema
	> = ( props ) => {
	// const [subtitles, setSubtitles] = useState<SubtitleProp[]>([]);
	const [handle] = useState(() => delayRender());
	const {fps} = useVideoConfig();
	const subtitlesFile = props.src
		.replace(/.mp4$/, '.json')
		.replace(/.mkv$/, '.json')
		.replace(/.mov$/, '.json')
		.replace(/.webm$/, '.json');

	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<AbsoluteFill>
				<OffthreadVideo
					style={{
						objectFit: 'cover',
					}}
					src={props.src}
				/>
			</AbsoluteFill>
			{props.subtitles.map((subtitle, index) => {
				const nextSubtitle = props.subtitles[index + 1] ?? null;
				const subtitleStartFrame = subtitle.startInSeconds * fps;
				const subtitleEndFrame = Math.min(
					nextSubtitle ? nextSubtitle.startInSeconds * fps : Infinity,
					subtitleStartFrame + fps,
				);
				const durationInFrames = subtitleEndFrame - subtitleStartFrame;
				if (durationInFrames <= 0) {
					return null;
				}

				return (
					<Sequence key={index}
						from={subtitleStartFrame}
						durationInFrames={durationInFrames}
					
					>
						<Subtitle key={index} posX= {props.posX} text={subtitle.text} />;
					</Sequence>
				);
			})}
			{/* {getFileExists(subtitlesFile) ? null : <NoCaptionFile />} */}
			
		</AbsoluteFill>
	);
};
