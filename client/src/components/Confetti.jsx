import { useEffect, useRef } from "react";

const COLORS = [
  "#E8863A", // accent orange
  "#F0A050", // light orange
  "#FDBA74", // peach
  "#ffffff", // white
  "#a8a29e", // warm gray
  "#78716c", // darker gray
];

const EXPLOSION_COLORS = [
  "#E8863A", "#F0A050", "#FDBA74", "#ff6b6b", "#ffd93d",
  "#6bcb77", "#4d96ff", "#ff6bd6", "#ffffff", "#ffa94d",
];

const SHAPES = ["circle", "rect", "star"];

export default function Confetti({ particleCount = 40, fadeAfter = 0, explosion = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let globalAlpha = 1;
    let fadeStart = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = explosion
      ? // Explosion: burst from center with gravity
        Array.from({ length: particleCount }, () => {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 12 + 4;
          return {
            x: canvas.width / 2 + (Math.random() - 0.5) * 60,
            y: canvas.height / 2 + (Math.random() - 0.5) * 60,
            size: Math.random() * 6 + 2,
            color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3,
            gravity: 0.15,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            opacity: 1,
            shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            drag: 0.98,
          };
        })
      : // Gentle float: drift slowly
        Array.from({ length: particleCount }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.3 - 0.15,
          opacity: Math.random() * 0.6 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        }));

    const drawStar = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const method = i === 0 ? "moveTo" : "lineTo";
        ctx[method](cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
    };

    const animate = (timestamp) => {
      if (!fadeStart) fadeStart = timestamp;

      if (fadeAfter > 0) {
        const elapsed = timestamp - fadeStart;
        if (elapsed > fadeAfter) {
          globalAlpha = Math.max(0, 1 - (elapsed - fadeAfter) / 1500);
          if (globalAlpha <= 0) {
            cancelAnimationFrame(animationId);
            return;
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        if (explosion) {
          p.vx *= p.drag;
          p.vy *= p.drag;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity * globalAlpha);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else if (p.shape === "star") {
            drawStar(0, 0, p.size * 0.7);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.pulse += p.pulseSpeed;

          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.y > canvas.height + 10) p.y = -10;

          const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, pulseOpacity * globalAlpha);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [particleCount, fadeAfter, explosion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: explosion ? 10 : 3 }}
    />
  );
}
