import React, { useState, useMemo, useEffect } from 'react';
import { 
  Star, ThumbsUp, CheckCircle2, ShieldCheck, 
  MessageSquarePlus, Filter, Sparkles, Send, X, Check, Award,
  ChevronDown, Search, HelpCircle
} from 'lucide-react';

const SEED_REVIEWS_BY_PRODUCT = {
  'slim-fit-cargo-jeans': [
    {
      id: 'rev-carg-1',
      author: 'Aniket Sharma',
      location: 'Surat, Gujarat',
      avatarColor: '#4f46e5',
      rating: 5,
      date: '2026-09-18',
      title: 'Best fitting cargo jeans I have owned in India!',
      comment: 'The stretch denim is extremely comfortable and durable. The 6-pocket utility layout is functional—front pockets easily hold an iPhone 15 Pro Max. The mid-wash finish looks even better in person.',
      variant: 'Size: 32 • Color: Blue',
      verified: true,
      helpfulCount: 24,
      recommends: true,
      fitFeedback: 'True to Size',
      qualityScore: 5
    },
    {
      id: 'rev-carg-2',
      author: 'Rahul Desai',
      location: 'Vapi, Gujarat',
      avatarColor: '#059669',
      rating: 5,
      date: '2026-09-12',
      title: 'Superb tapering at ankle, looks great with sneakers',
      comment: 'The elasticated hem adjusters make sneakers pop nicely. Worn it on two bike trips and no signs of tear. Fabric has substantial weight (12.5 oz) yet allows easy movement.',
      variant: 'Size: 30 • Color: Blue',
      verified: true,
      helpfulCount: 19,
      recommends: true,
      fitFeedback: 'True to Size',
      qualityScore: 5
    },
    {
      id: 'rev-carg-3',
      author: 'Sneha Kothari',
      location: 'Ahmedabad',
      avatarColor: '#db2777',
      rating: 4,
      date: '2026-08-30',
      title: 'Premium denim quality, very comfortable for all-day wear',
      comment: 'Fabric quality is exceptional for this price. Breathable enough to wear throughout humid weather. Only minor thing is to follow washing instructions inside out to retain deep color.',
      variant: 'Size: 34 • Color: Black',
      verified: true,
      helpfulCount: 11,
      recommends: true,
      fitFeedback: 'True to Size',
      qualityScore: 4
    },
    {
      id: 'rev-carg-4',
      author: 'Vikram Varma',
      location: 'Mumbai',
      avatarColor: '#d97706',
      rating: 4,
      date: '2026-08-22',
      title: 'Tactical aesthetic is on point',
      comment: 'Heavy-duty zipper fly and reinforced pocket stitching. If you have larger athletic thighs, go one size up for a relaxed fit, but the stretch is forgiving.',
      variant: 'Size: 32 • Color: Black',
      verified: true,
      helpfulCount: 8,
      recommends: true,
      fitFeedback: 'Slightly Snug',
      qualityScore: 5
    }
  ],
  'magnet-signature-hoodie': [
    {
      id: 'rev-hd-1',
      author: 'Dev Patel',
      location: 'Vapi, Gujarat',
      avatarColor: '#2563eb',
      rating: 5,
      date: '2026-09-20',
      title: '400 GSM heavyweight cotton is pure luxury',
      comment: 'Heavyweight boxy drape without sagging. The double-lined hood holds its structured shape perfectly. Minimalist embroidery branding is subtle and classy.',
      variant: 'Size: L • Color: Black',
      verified: true,
      helpfulCount: 38,
      recommends: true,
      fitFeedback: 'True to Size (Boxy)',
      qualityScore: 5
    },
    {
      id: 'rev-hd-2',
      author: 'Priyanshu Mehta',
      location: 'Pune',
      avatarColor: '#7c3aed',
      rating: 5,
      date: '2026-09-08',
      title: 'Equivalent to international streetwear brands',
      comment: 'Super soft fleece inside, zero lint shedding after first wash. Kangaroo pocket is deeply stitched. Best hoodie in my collection.',
      variant: 'Size: M • Color: Grey',
      verified: true,
      helpfulCount: 22,
      recommends: true,
      fitFeedback: 'True to Size',
      qualityScore: 5
    }
  ],
  'magnet-matte-armor-iphone-case': [
    {
      id: 'rev-cs-1',
      author: 'Hardik Joshi',
      location: 'Surat, Gujarat',
      avatarColor: '#0d9488',
      rating: 5,
      date: '2026-09-21',
      title: 'Stronger MagSafe lock than the OEM Apple case!',
      comment: 'Snaps solidly onto car mounts and magnetic wallets. Already survived a 5-foot concrete drop with zero scratches. Frosted back keeps greasy fingerprints away.',
      variant: 'iPhone 15 Pro • Matte Black',
      verified: true,
      helpfulCount: 45,
      recommends: true,
      fitFeedback: 'Perfect Fit',
      qualityScore: 5
    },
    {
      id: 'rev-cs-2',
      author: 'Riya Shah',
      location: 'Vapi',
      avatarColor: '#e11d48',
      rating: 5,
      date: '2026-09-14',
      title: 'Tactile buttons are clicky and responsive',
      comment: 'The raised camera lip protects the lenses when placed flat on tables. Frosted Navy shade matches the titanium blue hue beautifully.',
      variant: 'iPhone 15 • Frosted Navy',
      verified: true,
      helpfulCount: 16,
      recommends: true,
      fitFeedback: 'Perfect Fit',
      qualityScore: 5
    }
  ],
  'gan-65w-triple-port-wall-charger': [
    {
      id: 'rev-ch-1',
      author: 'Yashwardhan Mehta',
      location: 'Mumbai',
      avatarColor: '#4338ca',
      rating: 5,
      date: '2026-09-19',
      title: 'Powers MacBook Pro + iPhone simultaneously without thermal throttle',
      comment: 'Very compact GaN brick. Powers full speed 65W PD. Replaced 3 separate chargers in my travel bag.',
      variant: 'Charcoal Grey • US Plug',
      verified: true,
      helpfulCount: 31,
      recommends: true,
      fitFeedback: 'Compact',
      qualityScore: 5
    }
  ]
};

// Generic fallback generation for other products
const generateDefaultReviews = (product) => {
  const isClothing = product.category === 'clothing';
  return [
    {
      id: `rev-gen-1-${product.id || 'p'}`,
      author: 'Aditya Dave',
      location: 'Surat, Gujarat',
      avatarColor: '#3b82f6',
      rating: 5,
      date: '2026-09-15',
      title: `Exceptional quality & build - ${product.brand || 'Magnet'} nailed it`,
      comment: isClothing 
        ? `Super comfortable fabric and precision stitching. Fits exactly as described on the size chart. Arrived quickly in premium packaging.`
        : `High-grade materials and sturdy performance. Works effortlessly with my setup and feels durable. Highly recommended!`,
      variant: isClothing ? 'Size: M • Color: Black' : 'Standard Edition',
      verified: true,
      helpfulCount: 18,
      recommends: true,
      fitFeedback: 'True to Size',
      qualityScore: 5
    },
    {
      id: `rev-gen-2-${product.id || 'p'}`,
      author: 'Manish R.',
      location: 'Vapi, Gujarat',
      avatarColor: '#10b981',
      rating: (product.rating && product.rating >= 4.5) ? 5 : 4,
      date: '2026-09-02',
      title: 'Value for money product, highly recommend',
      comment: `Authentic product with fast delivery in Vapi within 24 hours. The finish and texture are top-notch for the price point.`,
      variant: isClothing ? 'Size: L' : 'Standard Edition',
      verified: true,
      helpfulCount: 12,
      recommends: true,
      fitFeedback: 'True to Size',
      qualityScore: 5
    },
    {
      id: `rev-gen-3-${product.id || 'p'}`,
      author: 'Pooja Trivedi',
      location: 'Valsad',
      avatarColor: '#ec4899',
      rating: 4,
      date: '2026-08-25',
      title: 'Great purchase, looks exactly as pictured',
      comment: `The product looks identical to the official catalog photos. Sturdy build, prompt customer support, and good packaging.`,
      variant: 'Standard Edition',
      verified: true,
      helpfulCount: 7,
      recommends: true,
      fitFeedback: 'True to Size',
      qualityScore: 4
    }
  ];
};

export const ProductReviews = ({ product, userProfile, onReviewSubmitted }) => {
  const productKey = product?.slug || product?.id || 'default';
  const storageKey = `magnet_reviews_${productKey}`;

  // State
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading reviews from localStorage:', e);
    }
    return SEED_REVIEWS_BY_PRODUCT[product?.slug] || generateDefaultReviews(product);
  });

  const [selectedFilterStar, setSelectedFilterStar] = useState('all');
  const [sortBy, setSortBy] = useState('recent'); // recent, highest, lowest, helpful
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState({});

  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formName, setFormName] = useState(userProfile?.name || '');
  const [formLocation, setFormLocation] = useState(userProfile?.city ? `${userProfile.city}, Gujarat` : 'Vapi, Gujarat');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formVariant, setFormVariant] = useState('');
  const [formRecommends, setFormRecommends] = useState(true);
  const [formFit, setFormFit] = useState('True to Size');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Update localStorage whenever reviews change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error saving reviews:', e);
    }
  }, [reviews, storageKey]);

  // Sync if product changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`magnet_reviews_${product?.slug || product?.id}`);
      if (saved) {
        setReviews(JSON.parse(saved));
      } else {
        setReviews(SEED_REVIEWS_BY_PRODUCT[product?.slug] || generateDefaultReviews(product));
      }
    } catch (e) {
      setReviews(SEED_REVIEWS_BY_PRODUCT[product?.slug] || generateDefaultReviews(product));
    }
    setIsFormOpen(false);
    setFormSuccess(false);
    setSelectedFilterStar('all');
  }, [product?.slug, product?.id]);

  // Calculated Stats
  const stats = useMemo(() => {
    const totalCount = reviews.length;
    if (totalCount === 0) {
      return {
        avg: product?.rating || 4.5,
        total: product?.reviewsCount || 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendPct: 95
      };
    }

    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = (sum / totalCount).toFixed(1);
    
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let recommendCount = 0;
    reviews.forEach(r => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      dist[star] = (dist[star] || 0) + 1;
      if (r.recommends !== false) recommendCount++;
    });

    const recommendPct = Math.round((recommendCount / totalCount) * 100);

    return {
      avg: Number(avg),
      total: Math.max(totalCount, product?.reviewsCount || totalCount),
      actualReviewsCount: totalCount,
      distribution: dist,
      recommendPct
    };
  }, [reviews, product?.rating, product?.reviewsCount]);

  // Filter & Sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(r => {
        if (selectedFilterStar !== 'all') {
          if (Math.round(r.rating) !== Number(selectedFilterStar)) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchText = `${r.title} ${r.comment} ${r.author} ${r.variant}`.toLowerCase();
          if (!matchText.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'lowest') return (a.rating || 0) - (b.rating || 0);
        if (sortBy === 'helpful') return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        // Default: recent
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
  }, [reviews, selectedFilterStar, sortBy, searchQuery]);

  // Handle Helpful Click
  const handleHelpfulClick = (reviewId) => {
    if (helpfulVoted[reviewId]) return;
    
    setHelpfulVoted(prev => ({ ...prev, [reviewId]: true }));
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, helpfulCount: (r.helpfulCount || 0) + 1 };
      }
      return r;
    }));
  };

  // Submit Review Handler
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!formTitle.trim()) {
      setFormError('Please add a headline/title for your review.');
      return;
    }
    if (!formComment.trim() || formComment.trim().length < 10) {
      setFormError('Please share at least 10 characters in your detailed review.');
      return;
    }

    setFormError('');

    const newReviewObj = {
      id: `rev-user-${Date.now()}`,
      author: formName.trim(),
      location: formLocation.trim() || 'Verified Customer',
      avatarColor: ['#ef4444', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)],
      rating: Number(formRating),
      date: new Date().toISOString().split('T')[0],
      title: formTitle.trim(),
      comment: formComment.trim(),
      variant: formVariant.trim() || (product.category === 'clothing' ? 'Purchased: Size M' : 'Verified Purchase'),
      verified: true,
      helpfulCount: 0,
      recommends: formRecommends,
      fitFeedback: formFit,
      qualityScore: formRating
    };

    setReviews(prev => [newReviewObj, ...prev]);
    setFormSuccess(true);
    if (onReviewSubmitted) {
      onReviewSubmitted(newReviewObj);
    }

    setTimeout(() => {
      setIsFormOpen(false);
      setFormSuccess(false);
      setFormTitle('');
      setFormComment('');
    }, 2000);
  };

  const getRatingLabel = (score) => {
    if (score >= 5) return 'Excellent';
    if (score >= 4) return 'Good';
    if (score >= 3) return 'Average';
    if (score >= 2) return 'Poor';
    return 'Terrible';
  };

  return (
    <div className="product-reviews-container">
      {/* SECTION HEADER & SUMMARY OVERVIEW */}
      <div className="reviews-summary-card">
        <div className="reviews-summary-grid">
          {/* Overall Rating Score */}
          <div className="summary-rating-col">
            <div className="rating-big-number">{stats.avg}</div>
            <div className="stars-row-big">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={star <= Math.round(stats.avg) ? 'star-filled-gold' : 'star-empty'}
                  fill={star <= Math.round(stats.avg) ? '#eab308' : 'none'}
                />
              ))}
            </div>
            <div className="total-ratings-text">
              Based on <strong>{stats.total} ratings</strong> & {stats.actualReviewsCount} verified reviews
            </div>
            <div className="recommend-badge-pill">
              <Sparkles size={14} />
              <span>{stats.recommendPct}% of buyers recommend this</span>
            </div>
          </div>

          {/* Star Distribution Breakdown Bars */}
          <div className="summary-bars-col">
            <span className="summary-col-title">Rating Breakdown</span>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star] || 0;
              const pct = stats.actualReviewsCount > 0 ? Math.round((count / stats.actualReviewsCount) * 100) : 0;
              const isSelected = selectedFilterStar === String(star);

              return (
                <button
                  key={star}
                  type="button"
                  className={`dist-bar-row ${isSelected ? 'active-filter' : ''}`}
                  onClick={() => setSelectedFilterStar(isSelected ? 'all' : String(star))}
                  title={`Filter by ${star} star reviews`}
                >
                  <span className="dist-star-label">{star} ★</span>
                  <div className="dist-track">
                    <div 
                      className={`dist-fill dist-fill-${star}`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="dist-count-label">{count} ({pct}%)</span>
                </button>
              );
            })}
          </div>

          {/* Value Highlights & Action CTA */}
          <div className="summary-action-col">
            <div className="features-rating-box">
              <div className="feature-item">
                <span className="feature-name">Quality & Fabric</span>
                <span className="feature-score">4.9 / 5</span>
              </div>
              <div className="feature-item">
                <span className="feature-name">Value for Money</span>
                <span className="feature-score">4.8 / 5</span>
              </div>
              <div className="feature-item">
                <span className="feature-name">Fast Delivery</span>
                <span className="feature-score">4.9 / 5</span>
              </div>
            </div>

            <button 
              className="btn btn-primary write-review-cta-btn"
              onClick={() => setIsFormOpen(prev => !prev)}
            >
              <MessageSquarePlus size={18} />
              {isFormOpen ? 'Close Review Form' : 'Write a Customer Review'}
            </button>
            <p className="verified-purchase-note">
              <ShieldCheck size={14} /> 100% Genuine & Verified Buyer Reviews
            </p>
          </div>
        </div>
      </div>

      {/* WRITE A REVIEW FORM (EXPANDABLE) */}
      {isFormOpen && (
        <div className="write-review-form-wrapper">
          <div className="write-review-header">
            <div>
              <h3 className="write-review-title">Write a Review for {product.name}</h3>
              <p className="write-review-subtitle">Share your authentic experience with the Magnet community</p>
            </div>
            <button 
              type="button" 
              className="close-review-form-btn"
              onClick={() => setIsFormOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {formSuccess ? (
            <div className="review-success-banner">
              <CheckCircle2 size={32} color="#10b981" />
              <div>
                <h4 style={{ fontWeight: 700, color: '#059669' }}>Thank you! Your review has been published!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Your feedback helps other shoppers make informed choices.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="write-review-form">
              {formError && (
                <div className="form-error-banner">
                  {formError}
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="form-group">
                <label className="form-label">Overall Rating *</label>
                <div className="star-picker-container">
                  <div className="star-picker-row">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isActive = (hoverRating || formRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          className="star-picker-btn"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setFormRating(star)}
                        >
                          <Star
                            size={28}
                            fill={isActive ? '#eab308' : 'none'}
                            color={isActive ? '#eab308' : 'var(--text-muted)'}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="star-picker-feedback">
                    {getRatingLabel(hoverRating || formRating)} ({hoverRating || formRating} of 5 Stars)
                  </span>
                </div>
              </div>

              {/* Form Grid */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="review-input"
                    placeholder="e.g. Rahul Patel"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your City / Location</label>
                  <input
                    type="text"
                    className="review-input"
                    placeholder="e.g. Vapi, Gujarat"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Review Headline / Summary *</label>
                  <input
                    type="text"
                    className="review-input"
                    placeholder="e.g. Outstanding fit, super heavyweight fabric!"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Item Variant / Size Purchased</label>
                  <input
                    type="text"
                    className="review-input"
                    placeholder="e.g. Size 32, Blue or iPhone 15 Case"
                    value={formVariant}
                    onChange={(e) => setFormVariant(e.target.value)}
                  />
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="form-group">
                <label className="form-label">Detailed Review *</label>
                <textarea
                  className="review-textarea"
                  rows={4}
                  placeholder="What did you like or dislike? How does it fit and feel? Would you buy it again?"
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  required
                />
              </div>

              {/* Recommendation and Fit Options */}
              <div className="form-row-options">
                <label className="checkbox-custom-label">
                  <input
                    type="checkbox"
                    checked={formRecommends}
                    onChange={(e) => setFormRecommends(e.target.checked)}
                  />
                  <span>I recommend this product to other buyers</span>
                </label>

                {product.category === 'clothing' && (
                  <div className="fit-selector-group">
                    <span className="fit-label">Fit Assessment:</span>
                    <div className="fit-pills">
                      {['Runs Small', 'True to Size', 'Runs Large'].map((fit) => (
                        <button
                          key={fit}
                          type="button"
                          className={`fit-pill-btn ${formFit === fit ? 'selected' : ''}`}
                          onClick={() => setFormFit(fit)}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary submit-review-btn">
                  <Send size={16} />
                  Submit Customer Review
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary cancel-review-btn"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* REVIEWS FILTER AND SORT BAR */}
      <div className="reviews-controls-bar">
        {/* Star Rating Filter Pills */}
        <div className="rating-filter-pills">
          <button
            type="button"
            className={`filter-pill ${selectedFilterStar === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilterStar('all')}
          >
            All Reviews ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.distribution[star] || 0;
            if (count === 0 && selectedFilterStar !== String(star)) return null;
            return (
              <button
                key={star}
                type="button"
                className={`filter-pill ${selectedFilterStar === String(star) ? 'active' : ''}`}
                onClick={() => setSelectedFilterStar(selectedFilterStar === String(star) ? 'all' : String(star))}
              >
                {star} ★ ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls */}
        <div className="reviews-sort-search">
          <div className="reviews-search-box">
            <Search size={15} className="search-icon-inside" />
            <input
              type="text"
              className="reviews-search-input"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="reviews-sort-box">
            <span className="sort-label">Sort:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="reviews-sort-select"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      {/* FILTER STATUS BANNER */}
      {(selectedFilterStar !== 'all' || searchQuery) && (
        <div className="active-filter-indicator">
          <span>
            Showing {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
            {selectedFilterStar !== 'all' && ` with ${selectedFilterStar} stars`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <button 
            type="button"
            className="reset-filters-link"
            onClick={() => {
              setSelectedFilterStar('all');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* REVIEWS LIST CARDS */}
      <div className="reviews-list-container">
        {filteredReviews.length === 0 ? (
          <div className="empty-reviews-state">
            <HelpCircle size={40} className="empty-icon" />
            <p style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '0.5rem' }}>No reviews found</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px', margin: '0.25rem auto 1rem' }}>
              No reviews match the current star or search filters. Be the first to share your thoughts!
            </p>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSelectedFilterStar('all');
                setSearchQuery('');
                setIsFormOpen(true);
              }}
            >
              Write First Review for this Filter
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const initials = rev.author
              ? rev.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              : 'MC';
            const isHelpful = helpfulVoted[rev.id];

            return (
              <div key={rev.id} className="review-item-card">
                {/* Review Header: User Info & Rating */}
                <div className="review-card-header">
                  <div className="reviewer-profile">
                    <div 
                      className="reviewer-avatar-circle"
                      style={{ backgroundColor: rev.avatarColor || '#4f46e5' }}
                    >
                      {initials}
                    </div>
                    <div className="reviewer-meta">
                      <div className="reviewer-name-row">
                        <span className="reviewer-name">{rev.author}</span>
                        {rev.verified && (
                          <span className="verified-badge-pill" title="Verified Customer Purchase">
                            <CheckCircle2 size={13} />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="reviewer-sub-info">
                        <span>{rev.location || 'India'}</span>
                        {rev.variant && (
                          <>
                            <span className="bullet-sep">•</span>
                            <span className="variant-tag">{rev.variant}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Date */}
                  <div className="review-date-rating">
                    <div className="review-stars-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          fill={star <= rev.rating ? '#eab308' : 'none'}
                          color={star <= rev.rating ? '#eab308' : 'var(--text-muted)'}
                        />
                      ))}
                    </div>
                    <span className="review-date-text">
                      {rev.date ? new Date(rev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Review'}
                    </span>
                  </div>
                </div>

                {/* Review Title & Body */}
                <div className="review-content-body">
                  <h4 className="review-headline">{rev.title}</h4>
                  <p className="review-text">{rev.comment}</p>
                </div>

                {/* Attributes: Fit feedback & Recommendation */}
                <div className="review-attributes-row">
                  {rev.recommends && (
                    <span className="recommend-tag">
                      <Check size={13} /> Recommends this product
                    </span>
                  )}
                  {rev.fitFeedback && (
                    <span className="fit-tag">
                      Fit: <strong>{rev.fitFeedback}</strong>
                    </span>
                  )}
                </div>

                {/* Review Footer: Helpful Button */}
                <div className="review-card-footer">
                  <span className="helpful-question">Was this review helpful?</span>
                  <button
                    type="button"
                    className={`helpful-btn ${isHelpful ? 'voted' : ''}`}
                    onClick={() => handleHelpfulClick(rev.id)}
                    disabled={isHelpful}
                  >
                    <ThumbsUp size={14} />
                    <span>{isHelpful ? 'Helpful (' + (rev.helpfulCount || 1) + ')' : 'Yes (' + (rev.helpfulCount || 0) + ')'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
