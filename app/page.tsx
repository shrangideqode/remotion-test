"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { NextPage } from "next";
import { Player, PlayerRef } from "@remotion/player";
import { CalculateMetadataFunction, prefetch, staticFile } from "remotion";
import { DURATION_IN_FRAMES, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../types/constants";
import { Spacing } from "../components/Spacing";
import { CaptionedVideo, } from "../remotion/CaptionedVideo";
import { Button } from "../components/Button";
import { BrollProp, SubtitleProp, captionedVideoSchema } from "../types/schema";
import { getVideoMetadata } from "@remotion/renderer";

function formatTime(seconds: number): string {
  if (!seconds) return "End";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2);
  return `${minutes}:${remainingSeconds.padStart(5, '0')}`;
}

const Home: NextPage = () => {
  const [text, setText] = useState<string>("Title");
  const [subtitles, setSubtitles] = useState<SubtitleProp[]>([]);
  const [brolls, setBrolls] = useState<BrollProp[]>([]);
  const [posX, setPosX] = useState<string>("110");
  const [activeTab, setActiveTab] = useState<string>("Theme");
  const playerRef = useRef<PlayerRef>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const fetchSubtitles = useCallback(async () => {
    const response = await fetch("/api/captions", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src: "enhancer2.json" })
    });
    const data: SubtitleProp[] = await response.json();
    setSubtitles(data);
  }, []);

  const fetchBrolls = useCallback(async () => {
    const response = await fetch("/api/broll", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src: "enhancer2.json" })
    });
    const data: BrollProp[] = await response.json();
    data.forEach(broll=>{
      if(broll.videoSrc) {
        const { free, waitUntilDone } = prefetch(broll.videoSrc, {
          method: "blob-url",
          contentType: "video/mp4"
        });
        
        waitUntilDone().then((res:any) => {
          console.log("Video has finished loading",res);
        });
      }
    })
   
    setBrolls(data);
  }, []);

  useEffect(() => {
    fetchSubtitles();
    fetchBrolls();
  }, [fetchSubtitles]);

  // const calculateVideoMetadata: CalculateMetadataFunction = async() =>{

  // } 

  const inputProps = useMemo<captionedVideoSchema>(() => ({
    title: text,
    src: staticFile("enhancer2.mp4"),
    subtitles,
    brolls,
    posX
  }), [text, subtitles, posX, brolls]);

  const metadata = useCallback(async ()=>{
    // let metadata = await getVideoMetadata(staticFile("enhancer2.mp4"));
    console.log('Metadata', metadata)

  }, [])

  const handleSubtitleChange = (index: number, value: string) => {
    setSubtitles(prev => prev.map((sub, i) => i === index ? { ...sub, text: value } : sub));
  };

  const handleSubtitleClick = (timeInSeconds: number) => {
    setCurrentTime(timeInSeconds);
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds * VIDEO_FPS);
      playerRef.current.pause();
    }
  };

  const handleBrollChange = (index: number, value: string) => {
    setBrolls(prev => prev.map((sub, i) => i === index ? { ...sub, text: value } : sub));
  };

  const handleBrollClick = (timeInSeconds: number) => {
    setCurrentTime(timeInSeconds);
    if (playerRef.current) {
      playerRef.current.seekTo(timeInSeconds * VIDEO_FPS);
      playerRef.current.pause();
    }
  };

  return (
    <div className="flex flex-column m-12 gap-4">
      <div className="w-6/12">
        <div className="flex flex-column justify-content-between">
          <Button secondary={activeTab=="Theme"} onClick={()=>setActiveTab("Theme")}>Theme</Button>
          <Button secondary={activeTab=="Subtitles"} onClick={()=>setActiveTab("Subtitles")}>Subtitles</Button>
          <Button secondary={activeTab=="B-roll"} onClick={()=>setActiveTab("B-roll")} >B-roll</Button>
          <Button secondary={activeTab=="Publish"} onClick={()=>setActiveTab("Publish")} >Publish</Button>
        </div>

        {
          activeTab == "Theme" && 
          <div>
            Theme
          </div>
        }

        {
          activeTab == "Subtitles" && 
          <div>
            <h1 className="text-2xl font-bold mb-4">Caption List</h1>
            <ul className="grid gap-2 h-96 overflow-y-auto">
              {subtitles.map((sub, i) => (
                <li key={i} onClick={() => handleSubtitleClick(sub.startInSeconds)}
                className="bg-white p-4 rounded shadow">
                  <span className="font-semibold">
                    {formatTime(sub.startInSeconds)} - {formatTime(subtitles[i + 1]?.startInSeconds)}:
                  </span>
                  <input
                    className="ml-2 cursor-pointer"
                    value={sub.text}
                    onChange={(e) => handleSubtitleChange(i, e.target.value)}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <label className="block font-semibold">Position:</label>
              <input
                type="range"
                value={posX}
                onChange={(e) => setPosX(e.target.value)}
                min="-100"
                max={VIDEO_HEIGHT.toString()}
                step="5"
                className="w-full mt-2"
              />
            </div>

          </div>
        }

        {
          activeTab == "B-roll" && 
          <div>
            <h1 className="text-2xl font-bold mb-4">B-rolls</h1>
            <ul className="grid gap-2 h-96 overflow-y-auto">
              {brolls.map((sub, i) => (
                <li key={i} onClick={() => handleBrollClick(sub.startInSeconds)}
                className="bg-white p-4 flex rounded shadow">
                  <div className="min-w-24 max-w-32 flex justify-center items-center rounded shadow bg-zinc-100  h-24">
                    +
                  </div>
                  <div className="ml-2 ">
                    <span className="font-semibold">
                      {formatTime(sub.startInSeconds)} - {formatTime(brolls[i + 1]?.startInSeconds)}:
                    </span>
                    <span className="ml-2">
                      {sub.text}
                    </span>
                  </div>
                 
                  {/* <input
                    className="ml-2 cursor-pointer"
                    value={sub.text}
                    onChange={(e) => handleBrollChange(i, e.target.value)}
                  /> */}
                </li>
              ))}
            </ul>
          </div>
        }

        {
          activeTab == "Publish" && 
          <div>
            Publish
          </div>
        }

        
      </div>
      <div className="w-6/12 m-auto mb-5">
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          <Player
            ref={playerRef}
            component={CaptionedVideo}
            inputProps={inputProps}
            // calculateMetadata={}
            durationInFrames={DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{ width: "100%" }}
            controls
            autoPlay
            loop
            
          />
        </div>
        {/* <RenderControls text={text} setText={setText} inputProps={inputProps} /> */}
        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
      </div>
    </div>
  );
};

export default Home;