import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple floating particles
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Initialize fewer particles for cleaner look
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000 + 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    const animate = () => {
      time += 0.005;
      
      // Clean gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 1)'); // slate-900
      gradient.addColorStop(0.6, 'rgba(30, 58, 138, 0.4)'); // blue-900 with transparency
      gradient.addColorStop(1, 'rgba(15, 23, 42, 1)'); // slate-900
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle animated grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.lineWidth = 1;
      
      const gridSize = 80;
      const offsetX = (time * 10) % gridSize;
      const offsetY = (time * 8) % gridSize;
      
      // Vertical lines
      for (let x = -gridSize + offsetX; x < canvas.width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = -gridSize + offsetY; y < canvas.height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw particles with simple 3D effect
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z -= 0.5;

        // Reset particle if it goes off screen
        if (particle.z <= 0 || particle.x < -50 || particle.x > canvas.width + 50 || 
            particle.y < -50 || particle.y > canvas.height + 50) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.z = Math.random() * 800 + 600;
        }

        // Simple 3D projection
        const scale = 200 / (200 + particle.z);
        const x2d = particle.x;
        const y2d = particle.y;
        const size = particle.size * scale;
        const opacity = particle.opacity * scale;

        // Clean glow effect
        const glowGradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 6);
        glowGradient.addColorStop(0, `rgba(147, 197, 253, ${opacity})`);
        glowGradient.addColorStop(0.4, `rgba(59, 130, 246, ${opacity * 0.6})`);
        glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size * 6, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = `rgba(191, 219, 254, ${opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Flowing gradient orbs
      for (let i = 0; i < 3; i++) {
        const orbX = canvas.width * (0.2 + i * 0.3) + Math.cos(time * 0.4 + i * 2) * 60;
        const orbY = canvas.height * (0.3 + i * 0.2) + Math.sin(time * 0.3 + i * 1.5) * 40;
        const orbSize = 80 + Math.sin(time * 0.5 + i) * 20;
        const orbOpacity = 0.1 + Math.sin(time * 0.6 + i) * 0.05;
        
        const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbSize);
        orbGradient.addColorStop(0, `rgba(59, 130, 246, ${orbOpacity})`);
        orbGradient.addColorStop(0.6, `rgba(37, 99, 235, ${orbOpacity * 0.5})`);
        orbGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Subtle wave at the bottom
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x <= canvas.width; x += 3) {
        const y = canvas.height - 100 + Math.sin((x * 0.005) + (time * 2)) * 20;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

export default AnimatedBackground;