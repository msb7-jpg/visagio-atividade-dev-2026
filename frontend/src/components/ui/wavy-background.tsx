"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export interface WavyBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

// fallow-ignore-next-line complexity
export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 40,
  backgroundFill = "transparent",
  blur = 12,
  speed = "fast",
  waveOpacity = 0.35,
  ...props
}) => {
  const noiseRef = useRef(createNoise3D());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ntRef = useRef(0);

  // Cores adaptadas à paleta Dark Cinema (Dourado âmbar, Violeta/Púrpura retrô e turquesa TMDb sutil)
  const defaultColors = React.useMemo(
    () => [
      "#f59e0b", // Primary Amber
      "#d97706", // Deep Amber
      "#8b5cf6", // Violet
      "#a855f7", // Purple Accent
      "#06b6d4"  // TMDb Cyan
    ],
    []
  );
  const waveColors = colors ?? defaultColors;
  const waveColorsRef = useRef(waveColors);
  useEffect(() => {
    waveColorsRef.current = waveColors;
  }, [waveColors]);

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const waveWidthRef = useRef(waveWidth);
  useEffect(() => {
    waveWidthRef.current = waveWidth;
  }, [waveWidth]);

  const waveOpacityRef = useRef(waveOpacity);
  useEffect(() => {
    waveOpacityRef.current = waveOpacity;
  }, [waveOpacity]);

  const backgroundFillRef = useRef(backgroundFill);
  useEffect(() => {
    backgroundFillRef.current = backgroundFill;
  }, [backgroundFill]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let animationId: number;

    const resize = () => {
      const container = containerRef.current;
      w = canvas.width = container ? container.clientWidth : window.innerWidth;
      h = canvas.height = container ? container.clientHeight : window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = (n: number) => {
      const currentSpeedMode = speedRef.current;
      const speedStep =
        currentSpeedMode === "slow"
          ? 0.0008
          : currentSpeedMode === "fast"
            ? 0.0016
            : 0.0012;
      ntRef.current += speedStep;
      const noise = noiseRef.current;
      const colorsToDraw = waveColorsRef.current;
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidthRef.current;
        ctx.strokeStyle = colorsToDraw[i % colorsToDraw.length];
        for (let x = 0; x < w; x += 6) {
          const y = noise(x / 650, 0.25 * i, ntRef.current) * 80;
          ctx.lineTo(x, y + h * 0.45);
        }
        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const bg = backgroundFillRef.current;
      if (bg && bg !== "transparent") {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalAlpha = waveOpacityRef.current;
      drawWave(4);
      animationId = requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [blur]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", containerClassName)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60 mix-blend-screen"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {})
        }}
      />
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};

