import React from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';

export const TrendingProductCard = ({ 
  product, 
  wishlist, 
  toggleWishlist, 
  handleProductClick, 
  handleQuickAdd 
}) => {
  const isDiscounted = !!product.discountPrice;
  const priceToDisplay = product.discountPrice || product.price;
  const discountPct = isDiscounted ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const inWishlist = wishlist.some(w => w.id === product.id);
  const totalStock = (product.variants || []).reduce((acc, v) => acc + (v.stock || 0), 0);
  const hasStock = totalStock > 0;

  // Determine intelligent badge
  let promoBadge = '';
  if (totalStock > 0 && totalStock <= 4) {
    promoBadge = 'LIMITED STOCK';
  } else if (product.trending) {
    promoBadge = 'TRENDING';
  } else if (product.bestseller) {
    promoBadge = 'BEST SELLER';
  } else if (product.newArrival) {
    promoBadge = 'NEW';
  } else if (product.featured) {
    promoBadge = 'HOT';
  }

  // Helper to render rating stars
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating || 0);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} size={13} className="star-icon filled" fill="currentColor" />);
      } else {
        stars.push(<Star key={i} size={13} className="star-icon" />);
      }
    }
    return stars;
  };

  return (
    <div 
      className="trending-product-card" 
      onClick={() => handleProductClick(product)}
      role="article"
      aria-label={product.name}
    >
      {/* Image Container */}
      <div className="card-media-wrapper">
        <img src={product.image} alt={product.name} className="card-image-content" loading="lazy" />
        
        {/* Wishlist Button */}
        <button 
          className={`card-wishlist-toggle-btn ${inWishlist ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        {/* Promo Badge Overlay */}
        {promoBadge && (
          <span className={`promo-badge-tag ${promoBadge.toLowerCase().replace(' ', '-')}`}>
            {promoBadge}
          </span>
        )}

        {/* Discount Badge */}
        {isDiscounted && (
          <span className="card-discount-badge-bubble">
            {discountPct}% OFF
          </span>
        )}
      </div>

      {/* Info Container */}
      <div className="card-body-wrapper">
        <div className="card-brand-row">{product.brand || 'Magnet'}</div>
        <h3 className="card-title-row">{product.name}</h3>

        {/* Rating row */}
        <div className="card-rating-row">
          <div className="star-rating-stars-list">
            {renderStars(product.rating)}
          </div>
          <span className="rating-score-num">{product.rating || '4.5'}</span>
          <span className="rating-count-num">({product.reviewsCount || 0})</span>
        </div>

        {/* Price Row */}
        <div className="card-pricing-row">
          <span className="current-price-label">₹{priceToDisplay}</span>
          {isDiscounted && (
            <span className="slashed-price-label">₹{product.price}</span>
          )}
        </div>

        {/* Action Button */}
        <button 
          className="card-quick-buy-btn"
          disabled={!hasStock}
          onClick={(e) => {
            e.stopPropagation();
            handleQuickAdd(product, e);
          }}
        >
          <ShoppingCart size={15} />
          {hasStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};
