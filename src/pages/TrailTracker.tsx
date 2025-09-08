import { useCallback, useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
  strokeId: number; // To group continuous strokes
}

export default function TrailTracker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailsRef = useRef<TrailPoint[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const isDrawing = useRef(false);
  const currentStrokeId = useRef(0);

  const addTrailPoint = useCallback((x: number, y: number, forceAdd = false) => {
    const trails = trailsRef.current;
    const lastPoint = trails[trails.length - 1];

    // Add point if it's the first point, forced, or from a different stroke
    if (forceAdd || !lastPoint || lastPoint.strokeId !== currentStrokeId.current) {
      trails.push({
        x,
        y,
        timestamp: Date.now(),
        strokeId: currentStrokeId.current,
      });
    } else {
      // Only add if moved at least 5 pixels to reduce dots
      const distance = Math.sqrt((x - lastPoint.x) ** 2 + (y - lastPoint.y) ** 2);
      if (distance >= 5) {
        trails.push({
          x,
          y,
          timestamp: Date.now(),
          strokeId: currentStrokeId.current,
        });
      }
    }
  }, []);

  const getPointerPosition = useCallback((e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      isDrawing.current = true;
      currentStrokeId.current++;
      const touch = e.touches[0];
      const pos = getPointerPosition(touch, canvas);
      addTrailPoint(pos.x, pos.y, true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!isDrawing.current) return;
      const touch = e.touches[0];
      const pos = getPointerPosition(touch, canvas);
      addTrailPoint(pos.x, pos.y);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      isDrawing.current = false;
    };

    // Mouse event handlers (for desktop testing)
    const handleMouseDown = (e: MouseEvent) => {
      isDrawing.current = true;
      currentStrokeId.current++;
      const pos = getPointerPosition(e, canvas);
      addTrailPoint(pos.x, pos.y, true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      const pos = getPointerPosition(e, canvas);
      addTrailPoint(pos.x, pos.y);
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    // Add event listeners
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    // Animation loop
    const animate = () => {
      const now = Date.now();
      const fadeDuration = 1500; // 1.5 seconds

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Filter out old trails and calculate opacity
      const activeTrails = trailsRef.current
        .map((point) => {
          const age = now - point.timestamp;
          const opacity = Math.max(0, 1 - age / fadeDuration);
          return { ...point, opacity };
        })
        .filter((point) => point.opacity > 0);

      // Update trails array
      trailsRef.current = activeTrails;

      // Draw trails
      if (activeTrails.length > 0) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = 8;
        ctx.globalCompositeOperation = "lighter";

        // Group points by stroke ID
        const strokeGroups = new Map<number, typeof activeTrails>();
        for (const point of activeTrails) {
          if (!strokeGroups.has(point.strokeId)) {
            strokeGroups.set(point.strokeId, []);
          }
          const group = strokeGroups.get(point.strokeId);
          if (group) {
            group.push(point);
          }
        }

        // Draw each stroke
        for (const [, points] of strokeGroups) {
          if (points.length === 1) {
            // Single point - draw a small circle
            const point = points[0];
            ctx.fillStyle = `rgba(150, 150, 255, ${point.opacity * 0.8})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Multiple points - draw lines
            for (let i = 1; i < points.length; i++) {
              const prev = points[i - 1];
              const curr = points[i];

              // Create gradient
              const gradient = ctx.createLinearGradient(prev.x, prev.y, curr.x, curr.y);
              gradient.addColorStop(0, `rgba(255, 100, 255, ${prev.opacity * 0.8})`);
              gradient.addColorStop(1, `rgba(100, 200, 255, ${curr.opacity * 0.8})`);

              ctx.strokeStyle = gradient;

              ctx.beginPath();
              ctx.moveTo(prev.x, prev.y);
              ctx.lineTo(curr.x, curr.y);
              ctx.stroke();
            }
          }
        }

        ctx.globalCompositeOperation = "source-over";
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [addTrailPoint, getPointerPosition]);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-none"
        style={{ touchAction: "none" }}
      />
      <div className="absolute top-4 left-4 text-white/60 text-sm font-mono pointer-events-none">
        Swipe to create trails
      </div>
      <div className="absolute top-4 right-4 text-white/40 text-xs font-mono pointer-events-none">
        Trails fade in 1.5s
      </div>
    </div>
  );
}
