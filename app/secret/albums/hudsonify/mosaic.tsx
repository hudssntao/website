'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from "@/lib/utils";
import Gallery from '../gallery';

interface Image {
  id: string;
  url: string;
  averageColor: string;
}

interface ImageMosaicProps {
  mainImageSrc: string;
  tileSize?: number;
  tileImages: Image[];
  gridSize?: number;
}

interface ProgressState {
  stage: 'loading' | 'processing' | 'complete';
  percent: number;
  message: string;
}

const ImageMosaic = ({
  mainImageSrc,
  tileSize = 10,
  tileImages,
  gridSize = 100
}: ImageMosaicProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState<ProgressState>({
    stage: 'loading',
    percent: 0,
    message: 'Loading tile images...'
  });
  const [tileImageElements, setTileImageElements] = useState<Map<string, HTMLImageElement>>(new Map());
  const [displayedImages, setDisplayedImages] = useState<Set<Image>>(new Set());

  // Preload all tile images with progress tracking
  useEffect(() => {
    const loadTileImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      let loadedCount = 0;

      await Promise.all(tileImages.map((tile) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = tile.url;

          img.onload = () => {
            imageMap.set(tile.id, img);
            loadedCount++;
            setProgress(prev => ({
              stage: 'loading',
              percent: (loadedCount / tileImages.length) * 100,
              message: `Loading images: ${loadedCount}/${tileImages.length}`
            }));
            resolve(null);
          };

          img.onerror = () => {
            loadedCount++;
            setProgress(prev => ({
              stage: 'loading',
              percent: (loadedCount / tileImages.length) * 100,
              message: `Loading images: ${loadedCount}/${tileImages.length}`
            }));
            resolve(null);
          };
        });
      }));

      setTileImageElements(imageMap);

    };

    loadTileImages();
  }, [tileImages]);

  const getAverageColor = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const imageData = ctx.getImageData(x, y, width, height);
    const data = imageData.data;
    let r = 0, g = 0, b = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    return {
      r: Math.floor(r / count),
      g: Math.floor(g / count),
      b: Math.floor(b / count)
    };
  };

  const findBestMatchingTile = (targetColor: { r: number, g: number, b: number }) => {
    let bestMatch = tileImages[0];
    let minDifference = Infinity;

    tileImages.forEach((tile) => {
      const [r, g, b] = tile.averageColor.split(',').map(Number);
      const difference = Math.sqrt(
        Math.pow(targetColor.r - r, 2) +
        Math.pow(targetColor.g - g, 2) +
        Math.pow(targetColor.b - b, 2)
      );

      if (difference < minDifference) {
        minDifference = difference;
        bestMatch = tile;
      }
    });

    return bestMatch;
  };

  // Create the mosaic with progress tracking
  useEffect(() => {
    if (tileImageElements.size === 0) return;

    const mainImg = new Image();
    mainImg.crossOrigin = 'anonymous';
    mainImg.src = mainImageSrc;

    mainImg.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setProgress({
        stage: 'processing',
        percent: 0,
        message: 'Creating mosaic...'
      });

      // Set canvas size
      const aspectRatio = mainImg.height / mainImg.width;
      canvas.width = gridSize * tileSize;
      canvas.height = Math.floor(gridSize * tileSize * aspectRatio);

      // Draw main image
      ctx.drawImage(mainImg, 0, 0, canvas.width, canvas.height);

      // Calculate total tiles for progress tracking
      const totalTiles = Math.ceil(canvas.height / tileSize) * Math.ceil(canvas.width / tileSize);
      let processedTiles = 0;

      // Process tiles with async breaks to prevent UI freezing
      for (let y = 0; y < canvas.height; y += tileSize) {
        for (let x = 0; x < canvas.width; x += tileSize) {
          const avgColor = getAverageColor(ctx, x, y, tileSize, tileSize);
          const bestTile = findBestMatchingTile(avgColor);
          setDisplayedImages(prev => {
            const updated = new Set(prev);
            updated.add(bestTile);
            return updated;
          })
          const tileImg = tileImageElements.get(bestTile.id);

          if (tileImg) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, tileSize, tileSize);
            ctx.clip();
            ctx.drawImage(tileImg, x, y, tileSize, tileSize);
            ctx.restore();
          }

          processedTiles++;

          // Update progress every 10 tiles or when complete
          if (processedTiles % 10 === 0 || processedTiles === totalTiles) {
            setProgress({
              stage: 'processing',
              percent: (processedTiles / totalTiles) * 100,
              message: `Processing tiles: ${processedTiles}/${totalTiles}`
            });

            // Allow UI to update
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
      }

      setProgress({
        stage: 'complete',
        percent: 100,
        message: 'Mosaic complete!'
      });
    };

    mainImg.onerror = () => {
      console.error('Error loading main image');
      setProgress({
        stage: 'complete',
        percent: 0,
        message: 'Error loading main image'
      });
    };
  }, [mainImageSrc, tileSize, tileImageElements, gridSize]);

  return (
    <div className="flex flex-col gap-4 p-10 relative">
      <div className="space-y-2">
        <Progress value={progress.percent} />
        <div className="text-sm text-gray-600 text-center">
          {progress.message}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className={cn("max-w-full h-auto", progress.stage !== "complete" && "hidden")} />
      {progress.stage === "complete" && (
        <div className="flex flex-col w-full justify-center items-center">
          <div className="text-2xl mt-10 font-semibold animate-pulse">
            Images Used
          </div>
          <Gallery images={Array.from(displayedImages)} />
        </div>
      )}
    </div>
  );
};

export default ImageMosaic;
