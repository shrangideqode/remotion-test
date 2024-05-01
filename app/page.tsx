"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { z } from "zod";
import { Player } from "@remotion/player";
import { staticFile } from "remotion";
import { DURATION_IN_FRAMES, VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../types/constants";
import { Spacing } from "../components/Spacing";
import { CaptionedVideo, SubtitleProp, captionedVideoSchema } from "../remotion/CaptionedVideo";

function formatTime(seconds: number): string {
  if (!seconds) return "End";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2);
  return `${minutes}:${remainingSeconds.padStart(5, '0')}`;
}

const Home: NextPage = () => {
  const [text, setText] = useState<string>("Title");
  const [subtitles, setSubtitles] = useState<SubtitleProp[]>([]);
  const [posX, setPosX] = useState<string>("0");

  const fetchSubtitles = useCallback(async () => {
    const response = await fetch("/api/captions", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ src: "2.json" })
    });
    const data: SubtitleProp[] = await response.json();
    setSubtitles(data);
  }, []);

  useEffect(() => {
    fetchSubtitles();
  }, [fetchSubtitles]);

  const inputProps = useMemo<captionedVideoSchema>(() => ({
    title: text,
    src: staticFile("2.mp4"),
    subtitles,
    posX
  }), [text, subtitles, posX]);

  const handleSubtitleChange = (index: number, value: string) => {
    setSubtitles(prev => prev.map((sub, i) => i === index ? { ...sub, text: value } : sub));
  };

  return (
    <div className="flex flex-column m-12 gap-4">
      <div className="w-6/12">
        <h1 className="text-2xl font-bold mb-4">Caption List</h1>
        <ul className="grid gap-2 h-96 overflow-y-auto">
          {subtitles.map((sub, i) => (
            <li key={i} className="bg-white p-4 rounded shadow">
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
      <div className="w-6/12 m-auto mb-5">
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          <Player
            component={CaptionedVideo}
            inputProps={inputProps}
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