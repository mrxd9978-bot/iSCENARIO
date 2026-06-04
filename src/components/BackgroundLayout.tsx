import React, { useEffect, useRef, useState } from "react";

export default function BackgroundLayout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spotlight, setSpotlight] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setSpotlight({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W, H;
    let particles: any[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((W * H) / 18000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.5 + 0.3,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -Math.random() * 0.3 - 0.1,
          alpha: Math.random() * 0.4 + 0.1,
          decay: Math.random() * 0.001 + 0.0005,
        });
      }
    };

    const animParticles = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < -10) {
          particles[i] = {
            ...p,
            x: Math.random() * W,
            y: H + 10,
            alpha: Math.random() * 0.4 + 0.1,
          };
          return;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animParticles);
    };

    resizeCanvas();
    initParticles();
    animParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-50 block"
      />
      <div
        className="fixed w-[700px] h-[700px] rounded-full pointer-events-none z-[1] transition-all duration-100 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(201,168,76,0.055) 0%, transparent 70%)",
          left: `${spotlight.x}px`,
          top: `${spotlight.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
