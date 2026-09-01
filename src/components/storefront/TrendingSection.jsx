import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryTabs } from './CategoryTabs';
import { TrendingProductCard } from './TrendingProductCard';

export const TrendingSection = ({ 
  products, 
  wishlist, 
  toggleWishlist, 
  handleProductClick, 
  handleQuickAdd 
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const sliderRef = useRef(null);

  // Filter products based on selected tab
  const getFilteredProducts = () => {
    let list = [];
    switch (activeTab) {
      case 'all':
        list = products.filter(p => p.trending || p.featured);
        break;
      case 'clothing':
        list = products.filter(p => p.category === 'clothing');
        break;
      case 'accessories':
        list = products.filter(p => p.category === 'accessories');
        break;
      case 'newArrival':
        list = products.filter(p => p.newArrival);
        break;
      case 'bestseller':
        list = products.filter(p => p.bestseller);
        break;
      default:
        list = products;
    }
    // Return active products only, limit to maximum 10 items for high-performance carousel
    return list.filter(p => p.active).slice(0, 10);
  };

  const filteredList = getFilteredProducts();

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="trending-catalog-section" id="trending-section">
      <div className="container">
        {/* Section Header */}
        <div className="trending-section-header">
          <div>
            <h2 className="trending-section-title">Trending Now</h2>
            <p className="trending-section-subtitle">What's getting attention right now</p>
          </div>
        </div>

        {/* Tab Filters */}
        <CategoryTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Carousel Slider */}
        {filteredList.length > 0 ? (
          <div className="trending-slider-wrapper">
            {/* Scroll Left Button */}
            <button 
              className="trending-nav-btn left" 
              onClick={() => handleScroll('left')} 
              aria-label="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Slider Track */}
            <div className="trending-slider-track" ref={sliderRef}>
              {filteredList.map(product => (
                <TrendingProductCard
                  key={product.id}
                  product={product}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  handleProductClick={handleProductClick}
                  handleQuickAdd={handleQuickAdd}
                />
              ))}
            </div>

            {/* Scroll Right Button */}
            <button 
              className="trending-nav-btn right" 
              onClick={() => handleScroll('right')} 
              aria-label="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <div className="trending-empty-state">
            <p>No trending items available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};
