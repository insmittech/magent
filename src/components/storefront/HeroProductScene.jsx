import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export const HeroProductScene = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check user prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Normalize coordinates relative to card center to range [-1, 1]
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setCoords({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div 
      className="hero-3d-scene-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="Interactive 3D representation of Magnet catalog featuring clothing, hoodies, cargo pants, fast chargers and accessories floating in a digital space."
    >
      {/* Abstract Background Elements */}
      <div className="scene-bg-ambient-light" />
      <div className="scene-magnetic-field-lines">
        <div className="magnetic-orbit orbit-1" />
        <div className="magnetic-orbit orbit-2" />
        <div className="magnetic-orbit orbit-3" />
      </div>

      {/* Central Smartphone centerpiece */}
      <div 
        className="phone-3d-base"
        style={reducedMotion ? {} : {
          transform: `translate3d(${coords.x * 15}px, ${coords.y * 15}px, 30px) rotateY(${coords.x * 12}deg) rotateX(${coords.y * -12}deg)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
          boxShadow: `${-coords.x * 20}px ${25 - coords.y * 20}px 50px rgba(0, 0, 0, 0.25)`
        }}
      >
        <div className="phone-screen-glass">
          {/* Status Bar */}
          <div className="phone-notch" />
          
          {/* Main Content Display */}
          <div className="phone-ui-content">
            <span className="phone-label">MAGNET</span>
            <div className="phone-glow-orb" />
            <span className="phone-tagline">VAPI OFFICIAL</span>
            <div className="phone-category-badges">
              <span className="badge">CLOTHING</span>
              <span className="badge">ACCESSORIES</span>
            </div>
          </div>
          
          {/* Ambient overlay */}
          <div className="phone-glass-glare" />
        </div>
      </div>

      {/* Floating Card 1: Signature Hoodie (Fashion) */}
      <div 
        className="floating-3d-card card-hoodie"
        style={reducedMotion ? {} : {
          transform: `translate3d(${coords.x * -20}px, ${coords.y * -25}px, 90px) rotate(4deg)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <div className="card-glass-body">
          <div className="img-wrapper">
            <img src="/images/featured-hoodie.jpg" alt="Signature Hoodie" />
          </div>
          <div className="card-caption">
            <span className="category">STREETWEAR</span>
            <h4>Heavy Hoodie</h4>
          </div>
        </div>
      </div>

      {/* Floating Card 2: GaN Power Charger (Accessories) */}
      <div 
        className="floating-3d-card card-charger"
        style={reducedMotion ? {} : {
          transform: `translate3d(${coords.x * 25}px, ${coords.y * -15}px, 110px) rotate(-6deg)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <div className="card-glass-body">
          <div className="img-wrapper">
            <img src="/images/accessories.jpg" alt="GaN Charger" />
          </div>
          <div className="card-caption">
            <span className="category">POWER ADAPTER</span>
            <h4>65W GaN Fast</h4>
          </div>
        </div>
      </div>

      {/* Floating Card 3: Cargo Jeans (Fashion) */}
      <div 
        className="floating-3d-card card-jeans"
        style={reducedMotion ? {} : {
          transform: `translate3d(${coords.x * -15}px, ${coords.y * 22}px, 75px) rotate(-3deg)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <div className="card-glass-body">
          <div className="img-wrapper">
            <img src="/images/cargo-jeans.jpg" alt="Cargo Jeans" />
          </div>
          <div className="card-caption">
            <span className="category">DENIM</span>
            <h4>Cargo Jeans</h4>
          </div>
        </div>
      </div>

      {/* Floating Card 4: Windbreaker Jacket (Fashion) */}
      <div 
        className="floating-3d-card card-windbreaker"
        style={reducedMotion ? {} : {
          transform: `translate3d(${coords.x * 18}px, ${coords.y * 28}px, 95px) rotate(5deg)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <div className="card-glass-body">
          <div className="img-wrapper">
            <img src="/images/windbreaker.jpg" alt="Windbreaker Jacket" />
          </div>
          <div className="card-caption">
            <span className="category">OUTERWEAR</span>
            <h4>Windbreaker</h4>
          </div>
        </div>
      </div>

      {/* Simulated Tech Accessories Badge (Wireless Earbuds concept) */}
      <div 
        className="scene-floating-pill pill-earbuds"
        style={reducedMotion ? {} : {
          transform: `translate3d(${coords.x * -30}px, ${coords.y * -5}px, 120px)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <Sparkles size={11} className="pill-icon" />
        <span>Buds Pro</span>
      </div>

      {/* Simulated Tech Accessories Badge (USB-C Cable concept) */}
      <div 
        className="scene-floating-pill pill-cable"
        style={reducedMotion ? {} : {
          transform: `translate3d(${coords.x * 35}px, ${coords.y * 10}px, 80px)`,
          transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <span className="glowing-dot" />
        <span>100W USB-C</span>
      </div>
    </div>
  );
};
