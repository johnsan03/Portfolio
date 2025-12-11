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
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const primaryColor = isDark ? 'rgba(129, 140, 248, ' : 'rgba(99, 102, 241, ';
    const secondaryColor = isDark ? 'rgba(167, 139, 250, ' : 'rgba(139, 92, 246, ';

    // Enhanced 3D Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 2000;
        this.size = Math.random() * 3 + 1;
        this.speedZ = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        // Higher opacity in light mode for better visibility
        this.opacity = isDark 
          ? Math.random() * 0.5 + 0.3
          : Math.random() * 0.4 + 0.5;
        this.color = Math.random() > 0.5 
          ? primaryColor + this.opacity + ')'
          : secondaryColor + this.opacity + ')';
      }

      update() {
        this.z -= this.speedZ;
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction - prevent division by zero
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0 && distance < 200) {
          this.x -= (dx / distance) * 2;
          this.y -= (dy / distance) * 2;
        }

        if (this.z <= 0) {
          this.z = 2000;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        // Safety check: prevent division issues when z is too close to 1000
        if (this.z >= 990 || this.z <= 0) return;
        
        const scale = 1000 / (1000 - this.z);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size2d = Math.max(this.size * scale, 1);

        // Only draw if particle is visible and has valid size
        if (size2d <= 0 || isNaN(size2d) || isNaN(x2d) || isNaN(y2d)) return;
        if (x2d < -50 || x2d > canvas.width + 50 || y2d < -50 || y2d > canvas.height + 50) return;

        // Draw with glow effect - ensure gradient radius is always positive
        const gradientRadius = Math.max(size2d * 2, 5);
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, gradientRadius);
        gradient.addColorStop(0, this.color);
        // Create transparent version - extract RGB and set alpha to 0
        const colorMatch = this.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (colorMatch) {
          const transparentColor = `rgba(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]}, 0)`;
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
        // Safety check: prevent division issues
        if (this.z >= 990 || this.z <= 0) {
          return { x: -1000, y: -1000, z: this.z };
        }
        const scale = 1000 / (1000 - this.z);
        return {
          x: (this.x - canvas.width / 2) * scale + canvas.width / 2,
          y: (this.y - canvas.height / 2) * scale + canvas.height / 2,
          z: this.z
        };
      }
    }

    // 3D Geometric Shape class
    class Shape3D {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1500;
        this.size = Math.random() * 30 + 20;
        this.rotationX = Math.random() * Math.PI * 2;
        this.rotationY = Math.random() * Math.PI * 2;
        this.rotationZ = Math.random() * Math.PI * 2;
        this.rotationSpeedX = (Math.random() - 0.5) * 0.02;
        this.rotationSpeedY = (Math.random() - 0.5) * 0.02;
        this.rotationSpeedZ = (Math.random() - 0.5) * 0.02;
        this.speedZ = Math.random() * 1 + 0.3;
        this.type = Math.random() > 0.5 ? 'cube' : 'sphere';
        // Higher opacity in light mode for better visibility
        const shapeOpacity = isDark ? '0.15' : '0.25';
        this.color = Math.random() > 0.5 
          ? primaryColor + shapeOpacity + ')'
          : secondaryColor + shapeOpacity + ')';
      }

      update() {
        this.rotationX += this.rotationSpeedX;
        this.rotationY += this.rotationSpeedY;
        this.rotationZ += this.rotationSpeedZ;
        this.z -= this.speedZ;

        if (this.z <= 0) {
          this.z = 1500;
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
        }
      }

      draw() {
        // Safety check: prevent division issues when z is too close to 1000
        if (this.z >= 990 || this.z <= 0) return;
        
        const scale = 1000 / (1000 - this.z);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size2d = Math.max(this.size * scale, 5);

        // Only draw if shape is visible and has positive size
        if (size2d <= 0 || isNaN(size2d) || isNaN(x2d) || isNaN(y2d)) return;
        if (x2d < -100 || x2d > canvas.width + 100 || y2d < -100 || y2d > canvas.height + 100) return;

        ctx.save();
        ctx.translate(x2d, y2d);
        ctx.rotate(this.rotationZ);

        if (this.type === 'cube') {
          this.drawCube(size2d);
        } else {
          this.drawSphere(size2d);
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
        // Ensure size is positive and above minimum
        const safeSize = Math.max(size, 5);
        const radius = safeSize / 2;
        
        // Ensure gradient radius is positive
        const gradientRadius = Math.max(safeSize, 10);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gradientRadius);
        gradient.addColorStop(0, this.color);
        // Create transparent version - extract RGB and set alpha to 0
        const colorMatch = this.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (colorMatch) {
          const transparentColor = `rgba(${colorMatch[1]}, ${colorMatch[2]}, ${colorMatch[3]}, 0)`;
          gradient.addColorStop(1, transparentColor);
        } else {
          gradient.addColorStop(1, this.color.replace(/[\d.]+\)$/, '0)'));
        }
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Initialize particles and shapes
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 15; i++) {
      shapes.push(new Shape3D());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i].get2DPosition();
          const p2 = particles[j].get2DPosition();
          const distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + 
            Math.pow(p1.y - p2.y, 2)
          );

          if (distance < 150 && p1.z > 500 && p2.z > 500) {
            // Higher opacity for connections in light mode
            const baseOpacity = isDark ? 0.2 : 0.3;
            const opacity = (1 - distance / 150) * baseOpacity;
            ctx.strokeStyle = primaryColor + opacity + ')';
            ctx.lineWidth = isDark ? 1 : 1.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw shapes
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });

      // Draw particles
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
        opacity: isDark ? 0.4 : 0.35,
      }}
    />
  );
};

export default Background3D;
