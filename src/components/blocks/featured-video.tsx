"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { getYouTubeVideoId } from "@/lib/utils/youtube";

type FeaturedVideoProps = {
  title: string;
  youtubeUrl: string;
};

export function FeaturedVideo({ title, youtubeUrl }: FeaturedVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = useMemo(() => getYouTubeVideoId(youtubeUrl), [youtubeUrl]);

  if (!videoId) {
    return null;
  }

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const handlePlay = () => setIsPlaying(true);

  return (
    <section aria-label="추천 영상" className="container py-16">
      <h2 className="mb-8 text-3xl font-bold tracking-tight">{title}</h2>

      <div className="overflow-hidden rounded-xl border bg-muted">
        <div className="relative aspect-video w-full">
          {isPlaying ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              aria-label={`${title} 재생`}
              className="group absolute inset-0 h-full w-full"
            >
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                priority={false}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="inline-flex items-center justify-center rounded-full bg-background/90 p-4 text-foreground shadow-sm transition-transform group-hover:scale-105 group-focus-visible:scale-105">
                  <Play className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <span className="sr-only">재생</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}


