import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const Background3D = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let shapes = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let scrollY = 0;

    const resizeCanvas = () => {
      const width = Math.min(window.innerWidth, document.documentElement.clientWidth);
      const height = document.documentElement.scrollHeight || document.body.scrollHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = Math.max(height, window.innerHeight);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Track scroll to adjust animation
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const primaryColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(14, 165, 233, ';
    const secondaryColor = isDark ? 'rgba(45, 212, 191, ' : 'rgba(20, 184, 166, ';
    const tertiaryColor = isDark ? 'rgba(59, 130, 246, ' : 'rgba(37, 99, 235, ';

    // Enhanced 3D Particle class with better depth management
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1800 + 200; // Keep particles between 200-2000 (away from camera)
        this.baseSize = Math.random() * 2.5 + 1;
        this.speedZ = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = isDark 
          ? Math.random() * 0.4 + 0.25
          : Math.random() * 0.35 + 0.45;
        // More color variety
        const colorRand = Math.random();
        if (colorRand < 0.4) {
          this.color = primaryColor + this.opacity + ')';
        } else if (colorRand < 0.8) {
          this.color = secondaryColor + this.opacity + ')';
        } else {
          this.color = tertiaryColor + this.opacity + ')';
        }
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.z -= this.speedZ;
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += this.pulseSpeed;

        // Subtle mouse interaction - more refined
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0 && distance < 150) {
          const force = (1 - distance / 150) * 1.5;
          this.x -= (dx / distance) * force;
          this.y -= (dy / distance) * force;
        }

        // Reset when particle goes too close or too far
        if (this.z <= 200) {
          this.z = 2000;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
        if (this.z >= 2000) {
          this.z = 200;
        }
        
        // Wrap around screen edges
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
      }

      draw() {
        // Improved depth management - prevent particles from getting too close
        if (this.z <= 200 || this.z >= 2000) return;
        
        const perspective = 1200; // Increased perspective for smoother scaling
        const scale = Math.min(perspective / (perspective - this.z), 3); // Cap max scale at 3x
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        
        // Add subtle pulse effect
        const pulse = 1 + Math.sin(this.pulsePhase) * 0.1;
        const size2d = Math.max(this.baseSize * scale * pulse, 0.5);

        // Only draw if particle is visible and within canvas bounds
        if (size2d <= 0 || isNaN(size2d) || isNaN(x2d) || isNaN(y2d)) return;
        if (x2d < -50 || x2d > canvas.width + 50 || y2d < -50 || y2d > canvas.height + 50) return;

        // Enhanced glow effect
        const gradientRadius = Math.max(size2d * 3, 8);
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, gradientRadius);
        gradient.addColorStop(0, this.color);
        const colorMatch = this.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (colorMatch) {
          const transparentColor = `rgba(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]}, 0)`;
          gradient.addColorStop(0.5, this.color);
          gradient.addColorStop(1, transparentColor);
        } else {
          gradient.addColorStop(1, this.color.replace(/[\d.]+\)$/, '0)'));
        }

        ctx.beginPath();
        ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      get2DPosition() {
        if (this.z <= 200 || this.z >= 2000) {
          return { x: -1000, y: -1000, z: this.z };
        }
        const perspective = 1200;
        const scale = Math.min(perspective / (perspective - this.z), 3);
        return {
          x: (this.x - canvas.width / 2) * scale + canvas.width / 2,
          y: (this.y - canvas.height / 2) * scale + canvas.height / 2,
          z: this.z
        };
      }
    }

    // Enhanced 3D Geometric Shape class with better depth control
    class Shape3D {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1600 + 300; // Keep shapes between 300-1900
        this.baseSize = Math.random() * 25 + 15;
        this.rotationX = Math.random() * Math.PI * 2;
        this.rotationY = Math.random() * Math.PI * 2;
        this.rotationZ = Math.random() * Math.PI * 2;
        this.rotationSpeedX = (Math.random() - 0.5) * 0.015;
        this.rotationSpeedY = (Math.random() - 0.5) * 0.015;
        this.rotationSpeedZ = (Math.random() - 0.5) * 0.015;
        this.speedZ = Math.random() * 0.8 + 0.2;
        // More shape variety
        const typeRand = Math.random();
        if (typeRand < 0.4) {
          this.type = 'cube';
        } else if (typeRand < 0.7) {
          this.type = 'sphere';
        } else {
          this.type = 'ring';
        }
        const shapeOpacity = isDark ? '0.12' : '0.2';
        const colorRand = Math.random();
        if (colorRand < 0.4) {
          this.color = primaryColor + shapeOpacity + ')';
        } else if (colorRand < 0.8) {
          this.color = secondaryColor + shapeOpacity + ')';
        } else {
          this.color = tertiaryColor + shapeOpacity + ')';
        }
      }

      update() {
        this.rotationX += this.rotationSpeedX;
        this.rotationY += this.rotationSpeedY;
        this.rotationZ += this.rotationSpeedZ;
        this.z -= this.speedZ;

        // Reset when shape goes out of bounds
        if (this.z <= 300) {
          this.z = 1900;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
        if (this.z >= 1900) {
          this.z = 300;
        }
      }

      draw() {
        // Improved depth management
        if (this.z <= 300 || this.z >= 1900) return;
        
        const perspective = 1200;
        const scale = Math.min(perspective / (perspective - this.z), 2.5); // Cap at 2.5x
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size2d = Math.max(this.baseSize * scale, 3);

        // Only draw if shape is visible and within canvas bounds
        if (size2d <= 0 || isNaN(size2d) || isNaN(x2d) || isNaN(y2d)) return;
        if (x2d < -100 || x2d > canvas.width + 100 || y2d < -100 || y2d > canvas.height + 100) return;

        ctx.save();
        ctx.translate(x2d, y2d);
        ctx.rotate(this.rotationZ);

        if (this.type === 'cube') {
          this.drawCube(size2d);
        } else if (this.type === 'sphere') {
          this.drawSphere(size2d);
        } else {
          this.drawRing(size2d);
        }

        ctx.restore();
      }

      drawCube(size) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Draw wireframe cube
        const half = size / 2;
        const points = [
          [-half, -half, -half],
          [half, -half, -half],
          [half, half, -half],
          [-half, half, -half],
          [-half, -half, half],
          [half, -half, half],
          [half, half, half],
          [-half, half, half]
        ];

        // Rotate points
        const rotatedPoints = points.map(p => {
          let [x, y, z] = p;
          // Rotate around Y axis
          const tempX = x * Math.cos(this.rotationY) - z * Math.sin(this.rotationY);
          const tempZ = x * Math.sin(this.rotationY) + z * Math.cos(this.rotationY);
          x = tempX;
          z = tempZ;
          // Rotate around X axis
          const tempY = y * Math.cos(this.rotationX) - z * Math.sin(this.rotationX);
          z = y * Math.sin(this.rotationX) + z * Math.cos(this.rotationX);
          y = tempY;
          return [x, y, z];
        });

        // Project to 2D
        const projected = rotatedPoints.map(([x, y, z]) => ({
          x: x,
          y: y,
          z: z
        }));

        // Draw edges
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // front face
          [4, 5], [5, 6], [6, 7], [7, 4], // back face
          [0, 4], [1, 5], [2, 6], [3, 7]  // connecting edges
        ];

        edges.forEach(([i, j]) => {
          ctx.moveTo(projected[i].x, projected[i].y);
          ctx.lineTo(projected[j].x, projected[j].y);
        });

        ctx.stroke();
      }

      drawSphere(size) {
        const safeSize = Math.max(size, 5);
        const radius = safeSize / 2;
        const gradientRadius = Math.max(safeSize, 10);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gradientRadius);
        gradient.addColorStop(0, this.color);
        const colorMatch = this.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (colorMatch) {
          const transparentColor = `rgba(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]}, 0)`;
          gradient.addColorStop(0.6, this.color);
          gradient.addColorStop(1, transparentColor);
        } else {
          gradient.addColorStop(1, this.color.replace(/[\d.]+\)$/, '0)'));
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      drawRing(size) {
        const radius = size / 2;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ring for depth
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        
        // Cross lines for 3D effect
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius, 0);
        ctx.moveTo(0, -radius);
        ctx.lineTo(0, radius);
        ctx.stroke();
      }
    }

    // Initialize particles and shapes with optimized counts
    for (let i = 0; i < 70; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 12; i++) {
      shapes.push(new Shape3D());
    }

    const animate = () => {
      // Clear canvas for fresh frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between nearby particles (mesh network effect)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i].get2DPosition();
          const p2 = particles[j].get2DPosition();
          
          // Skip if positions are invalid
          if (isNaN(p1.x) || isNaN(p1.y) || isNaN(p2.x) || isNaN(p2.y)) continue;
          
          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + 
            Math.pow(p1.y - p2.y, 2)
          );

          // Only connect particles that are in mid-to-far depth and close together
          if (distance < 120 && p1.z > 400 && p2.z > 400 && p1.z < 1800 && p2.z < 1800) {
            const baseOpacity = isDark ? 0.15 : 0.25;
            const opacity = (1 - distance / 120) * baseOpacity * (1 - Math.abs(p1.z - p2.z) / 1400);
            ctx.strokeStyle = primaryColor + opacity + ')';
            ctx.lineWidth = isDark ? 0.8 : 1.2;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw shapes first (they're further back)
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });

      // Draw particles on top
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="background-3d"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        touchAction: 'none',
        opacity: isDark ? 0.4 : 0.35,
        willChange: 'contents',
      }}
    />
  );
};

export default Background3D;
