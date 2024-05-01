import { useState } from 'react';
import {
	AbsoluteFill,
	CalculateMetadataFunction,
	continueRender,
	delayRender,
	OffthreadVideo,
	Sequence,
	useVideoConfig,
	Video,
} from 'remotion';
import Subtitle from './Subtitle';
import {getVideoMetadata} from '@remotion/media-utils';
import { getStaticFiles } from '@remotion/studio';
import { captionedVideoSchema } from '../../types/schema';
import { DURATION_IN_FRAMES } from '../../types/constants';



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

const getStartAndDurationInSecond = (type:"subtitle"|"broll",list:any, item:any, index:number, fps:number) => {

	const nextSubtitle = list[index + 1] ?? null;
	const subtitleStartFrame = item.startInSeconds * fps;
	let subtitleEndFrame = Math.min(
		nextSubtitle ? nextSubtitle.startInSeconds * fps : Infinity,
		type == "broll" ? DURATION_IN_FRAMES: subtitleStartFrame + fps,
	);

	const durationInFrames = subtitleEndFrame - subtitleStartFrame;
	if (durationInFrames <= 0) {
		return null;
	}
	
	return {
		start: subtitleStartFrame,
		durationInFrames: durationInFrames
	}

}

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
	const [handle] = useState(() => delayRender("Subs & Broll",{
		timeoutInMilliseconds: 45000,

	}));
	const {fps} = useVideoConfig();

	// if(props.subtitles.length && props.brolls.length) {
	// 	continueRender(handle)
	// }
	setTimeout(()=>{
		continueRender(handle)
	},40000)

	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<AbsoluteFill>
				<Video
					style={{
						objectFit: 'cover',
					}}
					src={props.src}
				/>
			</AbsoluteFill>
	
			<AbsoluteFill>
			{ 
				props.brolls.map((broll, index)=>{
					let result = getStartAndDurationInSecond("broll",props.brolls, broll, index, fps)
					let start = result?.start;
					let durationInFrames = result?.durationInFrames;
					
					if(broll.videoSrc) {
						return (
							<Sequence key={index}
							from={start}
							durationInFrames={durationInFrames}>
								<Video
									style={{
										objectFit: 'cover',
										width:"100%"
									}}
									src={broll.videoSrc}
								/>
							</Sequence>
						)
					} else return "" 
				})
			}
			</AbsoluteFill>
		
			{props.subtitles.map((subtitle, index) => {
				
				let result = getStartAndDurationInSecond("subtitle",props.subtitles, subtitle, index, fps)
				let start = result?.start;
				let durationInFrames = result?.durationInFrames;

				return (
					<Sequence key={index}
						from={start}
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
