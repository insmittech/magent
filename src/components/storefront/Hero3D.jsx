import React from 'react';
import { ArrowRight, ShoppingBag, Smartphone } from 'lucide-react';
import { HeroProductScene } from './HeroProductScene';

export const Hero3D = ({ setActiveView, setActiveCategory }) => {
  const handleScrollToTrending = (e) => {
    e.preventDefault();
    const section = document.getElementById('trending-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="premium-hero-3d-section">
      <div className="container hero-3d-grid-layout">
        {/* Left Column: Context Copy & Action Triggers */}
        <div className="hero-3d-left-col">
          <span className="hero-top-badge" role="text">
            VAPI'S SMART SHOPPING DESTINATION
          </span>
          
          <h1 className="hero-main-title">
            FASHION MEETS <br />
            <span className="accent-glow">TECHNOLOGY</span>
          </h1>

          <div className="hero-supporting-group">
            <span className="supporting-line">Upgrade your style. Upgrade your tech.</span>
            <p className="hero-desc-text">
              Discover trending fashion, mobile accessories and everyday essentials — all in one place.
            </p>
          </div>

          <div className="hero-cta-buttons-row">
            <button 
              className="btn btn-primary hero-btn-fashion"
              onClick={() => {
                setActiveView('shop');
                setActiveCategory('clothing');
              }}
            >
              <ShoppingBag size={16} />
              Shop Fashion
            </button>
            
            <button 
              className="btn btn-secondary hero-btn-tech"
              onClick={() => {
                setActiveView('shop');
                setActiveCategory('accessories');
              }}
            >
              <Smartphone size={16} />
              Shop Mobile Accessories
            </button>
          </div>

          <a 
            href="#trending-section" 
            className="explore-trending-link"
            onClick={handleScrollToTrending}
          >
            Explore Trending Products <ArrowRight size={14} className="arrow-icon" />
          </a>
        </div>

        {/* Right Column: Interactive 3D Parallax Canvas */}
        <div className="hero-3d-right-col">
          <HeroProductScene />
        </div>
      </div>
    </section>
  );
};
