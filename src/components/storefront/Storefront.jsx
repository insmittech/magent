import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { 
  ShoppingBag, Search, X, Plus, Minus, Check, ArrowRight, Phone, 
  MapPin, ShieldCheck, RefreshCw, Truck, Heart, Star, User, 
  Package, MapPinned, History, LogOut, ChevronRight, Percent, Calendar, Home, FolderKanban,
  Lock, Sun, Moon, ChevronLeft
} from 'lucide-react';

export const Storefront = () => {
  const { 
    products, 
    categories, 
    orders,
    cart, 
    wishlist,
    userProfile,
    setUserProfile,
    recentlyViewed,
    settings, 
    banners,
    addToCart, 
    updateCartQty, 
    removeFromCart, 
    toggleWishlist,
    addRecentlyViewed,
    saveAddress,
    deleteAddress,
    placeOrder,
    setIsAdmin 
  } = useContext(StoreContext);

  // Active view routing: 'home' | 'shop' | 'account' | 'wishlist'
  const [activeView, setActiveView] = useState('home');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isAuthFlipped, setIsAuthFlipped] = useState(false);
  const [whoWeAreOpen, setWhoWeAreOpen] = useState(false);
  const [infoPageKey, setInfoPageKey] = useState('contact');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const activeBanners = banners.filter(b => b.active);
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIndex(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Cart & Checkout state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', notes: '', paymentMethod: 'COD'
  });
  
  const [placedOrderId, setPlacedOrderId] = useState(null);
  
  // Product gallery/variant/pincode selection
  const [activeThumb, setActiveThumb] = useState(0);
  const [detailVariant, setDetailVariant] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const [pincodeVal, setPincodeVal] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [pincodeError, setPincodeError] = useState(false);
  const [detailActiveTab, setDetailActiveTab] = useState('desc');

  // Customer Account Active Sub-Tab
  const [accountSubTab, setAccountSubTab] = useState('profile');
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '', type: 'Home', address: '', city: '', state: '', pincode: '', phone: '', isDefault: false
  });

  // Sorting
  const [sortBy, setSortBy] = useState('featured');

  // Load default address into checkout form if available
  useEffect(() => {
    if (userProfile?.addresses?.length > 0) {
      const def = userProfile.addresses.find(a => a.isDefault) || userProfile.addresses[0];
      setSelectedAddressId(def.id);
      setCheckoutForm(prev => ({
        ...prev,
        name: def.name,
        phone: def.phone,
        address: def.address,
        city: def.city,
        state: def.state,
        pincode: def.pincode
      }));
    }
  }, [userProfile]);

  // Autocomplete suggestion generator
  const getSearchSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const suggestions = new Set();
    
    // Check product titles
    products.forEach(p => {
      if (p.name.toLowerCase().includes(query)) {
        suggestions.add(p.name);
      }
      if (p.brand && p.brand.toLowerCase().includes(query)) {
        suggestions.add(p.brand);
      }
      // Check phone compatibility tags
      p.variants.forEach(v => {
        if (v.compatibleModel && v.compatibleModel.toLowerCase().includes(query)) {
          suggestions.add(v.compatibleModel);
        }
      });
    });

    return Array.from(suggestions).slice(0, 5);
  };

  const suggestionsList = getSearchSuggestions();

  // Search execution
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchFocused(false);
    setActiveView('shop');
    setSelectedProduct(null);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (!p.active) return false;
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery.trim() || 
                          p.name.toLowerCase().includes(query) || 
                          p.description.toLowerCase().includes(query) ||
                          p.sku.toLowerCase().includes(query) ||
                          (p.brand && p.brand.toLowerCase().includes(query)) ||
                          p.variants.some(v => 
                            (v.compatibleModel && v.compatibleModel.toLowerCase().includes(query)) ||
                            (v.specification && v.specification.toLowerCase().includes(query)) ||
                            (v.color && v.color.toLowerCase().includes(query))
                          );
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'newest') return b.newArrival ? -1 : 1;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') {
      const discountA = a.discountPrice ? ((a.price - a.discountPrice) / a.price) : 0;
      const discountB = b.discountPrice ? ((b.price - b.discountPrice) / b.price) : 0;
      return discountB - discountA;
    }
    return b.featured ? 1 : -1;
  });

  // Product Selection Details View Navigation
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    addRecentlyViewed(product);
    setDetailQty(1);
    setActiveThumb(0);
    setPincodeVal('');
    setPincodeChecked(false);
    
    const firstAvail = product.variants.find(v => v.stock > 0);
    setDetailVariant(firstAvail || product.variants[0]);
    
    setActiveView('product-detail');
    window.scrollTo(0, 0);
  };

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    const firstAvail = product.variants.find(v => v.stock > 0);
    if (!firstAvail) {
      alert('This product is out of stock.');
      return;
    }
    addToCart(product, firstAvail, 1);
    setCartOpen(true);
  };

  // Checkout Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = cartSubtotal >= 1499 ? 0 : 99;
  const cartTotal = cartSubtotal + shippingCost;

  // Checkout form actions
  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
    const addr = userProfile.addresses.find(a => a.id === id);
    if (addr) {
      setCheckoutForm(prev => ({
        ...prev,
        name: addr.name,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode
      }));
    }
  };

  const handleCheckoutChange = (e) => {
    setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };

  const handlePlaceOrderSubmit = (e) => {
    e.preventDefault();
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address || !checkoutForm.city || !checkoutForm.state || !checkoutForm.pincode) {
      alert('Please fill in all required shipping fields.');
      return;
    }
    const orderId = placeOrder(checkoutForm);
    setPlacedOrderId(orderId);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  const handleWhatsAppConfirm = () => {
    const text = `Hello Magnet Vapi Official! 🌟 I placed an order: ID *${placedOrderId}* totaling *₹${cartTotal}* (COD). Details: Name: ${checkoutForm.name}, Address: ${checkoutForm.address}, Pincode: ${checkoutForm.pincode}. Please verify my delivery!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  // Quick Pincode check
  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincodeVal.trim().length !== 6 || isNaN(pincodeVal)) {
      alert('Please enter a valid 6-digit postal code.');
      return;
    }
    setPincodeChecked(true);
    // Vapi standard pincode checks
    if (pincodeVal.startsWith('396') || pincodeVal.startsWith('395')) {
      setPincodeError(false); // In Service region
    } else {
      setPincodeError(true); // Outside regional COD
    }
  };

  // Address sub form
  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.pincode || !newAddress.phone) {
      alert('Please complete all address fields.');
      return;
    }
    saveAddress(newAddress);
    setAddressFormOpen(false);
    setNewAddress({ name: '', type: 'Home', address: '', city: '', state: 'Gujarat', pincode: '', phone: '', isDefault: false });
  };

  // Render Rating Stars
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={13} 
          fill={i <= floor ? '#ffb800' : 'none'} 
          stroke={i <= floor ? '#ffb800' : 'currentColor'} 
        />
      );
    }
    return <div className="rating-stars-container">{stars}</div>;
  };

  // Tracking Pipeline nodes mapping
  const getTrackingProgressWidth = (status) => {
    if (status === 'Pending') return '0%';
    if (status === 'Confirmed') return '25%';
    if (status === 'Packed') return '50%';
    if (status === 'Shipped') return '75%';
    if (status === 'Delivered') return '100%';
    return '0%';
  };

  return (
    <div className="storefront-root" style={{ paddingBottom: '3.75rem' }}>
      {/* Announcement Bar */}
      {settings.announcement && (
        <div className="announcement-bar">
          {settings.announcement}
        </div>
      )}

      {/* TOP STRIP BAR */}
      <div className="header-top-bar">
        <div className="container header-top-container">
          <div className="header-top-left">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} /> {settings.address.split(',')[0]}, Gujarat
            </span>
            <span>📞 Support: {settings.whatsappNumber}</span>
          </div>
          <div className="header-top-right">
            <a href="#" className="header-top-link" onClick={() => { setActiveView('account'); setAccountSubTab('orders'); }}>Track Order</a>
            <a href="#" className="header-top-link" onClick={() => setIsAdmin(true)}>Admin Panel</a>
          </div>
        </div>
      </div>

      {/* HEADER MAIN ROW */}
      <header className="header-main">
        <div className="container header-main-container">
          <h1 className="logo-h1-wrap" style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
            <a href="#" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }} onClick={() => { setActiveView('home'); setActiveCategory('all'); setSelectedProduct(null); }}>
              <img src="/logo.jpg" alt="Magnet Boutique Logo" style={{ height: '42px', width: '42px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--color-primary)', boxShadow: '0 2px 10px rgba(239, 68, 68, 0.2)' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.45rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
                Magnet<span style={{ color: 'var(--color-primary)' }}>.</span>
              </span>
            </a>
          </h1>

          {/* Large Center Search Bar */}
          <div className="header-search-bar">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-group">
                <Search size={18} className="search-input-icon" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  className="search-main-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)} // delay to allow clicks
                />
                {searchQuery && (
                  <button type="button" style={{ paddingRight: '0.75rem', color: 'var(--text-muted)' }} onClick={() => setSearchQuery('')}>
                    <X size={16} />
                  </button>
                )}
              </div>
              <button type="submit" className="search-btn">Search</button>
            </form>

            {/* Suggestions Overlay */}
            {searchFocused && (searchQuery.trim().length > 0 || recentlyViewed.length > 0) && (
              <div className="autocomplete-dropdown">
                {suggestionsList.length > 0 && (
                  <div className="autocomplete-section">
                    <div className="autocomplete-title">Suggested Searches</div>
                    {suggestionsList.map((s, idx) => (
                      <button 
                        key={idx} 
                        className="autocomplete-item" 
                        onMouseDown={() => { setSearchQuery(s); setActiveView('shop'); setSelectedProduct(null); }}
                      >
                        <Search size={14} style={{ color: 'var(--text-muted)' }} /> {s}
                      </button>
                    ))}
                  </div>
                )}

                {recentlyViewed.length > 0 && (
                  <div className="autocomplete-section">
                    <div className="autocomplete-title">Recently Viewed</div>
                    {recentlyViewed.map(p => (
                      <button 
                        key={p.id} 
                        className="autocomplete-item"
                        onMouseDown={() => handleProductClick(p)}
                      >
                        <History size={14} style={{ color: 'var(--text-muted)' }} /> {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right navigation buttons */}
          <div className="header-action-links">
            <button className="header-nav-btn theme-toggle-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle Light/Dark Mode" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
              <span>Theme</span>
            </button>
            <button className="header-nav-btn" onClick={() => { setActiveView('account'); setAccountSubTab('profile'); }}>
              <User size={19} />
              <span>Account</span>
            </button>
            <button className="header-nav-btn" onClick={() => setActiveView('wishlist')}>
              <Heart size={19} />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
              <span>Wishlist</span>
            </button>
            <button className="header-nav-btn" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={19} />
              {cart.length > 0 && <span className="badge">{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>}
              <span>Cart</span>
            </button>
          </div>
        </div>
      </header>

      {/* DYNAMIC CATEGORY NAVIGATION STRIP */}
      <div className="category-nav-strip">
        <div className="container category-nav-container">
          <a href="#" className={`category-nav-link ${activeView === 'home' ? 'active' : ''}`} onClick={() => { setActiveView('home'); setActiveCategory('all'); setSelectedProduct(null); }}>Home</a>
          <a href="#" className={`category-nav-link ${activeView === 'shop' && activeCategory === 'all' ? 'active' : ''}`} onClick={() => { setActiveView('shop'); setActiveCategory('all'); setSelectedProduct(null); }}>All Shop</a>
          {categories.filter(c => c.active).map(cat => (
            <a 
              key={cat.id} 
              href="#" 
              className={`category-nav-link ${activeView === 'shop' && activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => { setActiveView('shop'); setActiveCategory(cat.id); setSelectedProduct(null); }}
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {/* Main Pages router */}
      {placedOrderId ? (
        /* Order Success Page */
        <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card success-card" style={{ width: '100%', maxWidth: '520px' }}>
            <div className="success-icon">
              <Check size={32} />
            </div>
            <h2>Order Placed (COD)!</h2>
            <p className="detail-sku" style={{ margin: '0.25rem 0 1rem' }}>ID: <strong>{placedOrderId}</strong></p>
            
            <p>
              Your Cash on Delivery order has been registered in our system. To confirm shipment details immediately, please send a verification to our WhatsApp line below.
            </p>
            
            <button className="btn btn-primary" onClick={handleWhatsAppConfirm} style={{ backgroundColor: '#25D366', borderColor: '#25D366', width: '100%', marginTop: '1rem' }}>
              <Phone size={18} /> Confirm on WhatsApp
            </button>
            <button className="btn btn-secondary" onClick={() => { setPlacedOrderId(null); setActiveView('home'); }} style={{ width: '100%', marginTop: '0.5rem' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      ) : activeView === 'account' ? (
        !isUserLoggedIn ? (
          /* Customer Login / Register Page */
          <div className="container" style={{ padding: '3rem 0', display: 'flex', justifyContent: 'center' }}>
            <div className="auth-3d-container">
              <div className={`auth-3d-card ${isAuthFlipped ? 'flipped' : ''}`}>
                
                {/* FRONT SIDE: LOGIN */}
                <div className="auth-card-front">
                  <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>Welcome Back</span>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '0.25rem' }}>Customer Login</h2>
                  </div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (loginPhone.length < 10) {
                      alert('Please enter a valid 10-digit mobile number.');
                      return;
                    }
                    if (userProfile.phone !== loginPhone) {
                      setUserProfile({
                        name: 'Magnet Club Member',
                        phone: loginPhone,
                        email: `user_${loginPhone}@magnet.com`,
                        addresses: []
                      });
                    }
                    setIsUserLoggedIn(true);
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    <div className="input-group-3d">
                      <label className="input-label-3d">Mobile Number</label>
                      <div className="input-wrapper-3d">
                        <Phone size={16} className="input-icon-3d" />
                        <input 
                          type="text" 
                          maxLength={10}
                          className="input-field-3d"
                          placeholder="10-digit Phone"
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          required 
                        />
                      </div>
                    </div>

                    <div className="input-group-3d">
                      <label className="input-label-3d">Password</label>
                      <div className="input-wrapper-3d">
                        <Lock size={16} className="input-icon-3d" />
                        <input 
                          type="password" 
                          className="input-field-3d"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <button type="submit" className="admin-submit-btn" style={{ marginTop: '0.5rem' }}>
                      Sign In
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => setIsAuthFlipped(true)}
                      style={{ color: 'var(--color-primary)', fontWeight: 700 }}
                    >
                      Register Now
                    </button>
                  </div>
                </div>

                {/* BACK SIDE: REGISTER */}
                <div className="auth-card-back">
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.1em' }}>Join the Club</span>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '0.25rem' }}>Create Account</h2>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (regPhone.length < 10) {
                      alert('Please enter a valid 10-digit mobile number.');
                      return;
                    }
                    setUserProfile({
                      name: regName,
                      phone: regPhone,
                      email: regEmail,
                      addresses: []
                    });
                    setIsUserLoggedIn(true);
                  }} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    
                    <div className="input-group-3d">
                      <label className="input-label-3d">Full Name</label>
                      <div className="input-wrapper-3d">
                        <User size={16} className="input-icon-3d" />
                        <input 
                          type="text" 
                          className="input-field-3d"
                          placeholder="Your Name"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="input-group-3d">
                      <label className="input-label-3d">Mobile Number</label>
                      <div className="input-wrapper-3d">
                        <Phone size={16} className="input-icon-3d" />
                        <input 
                          type="text" 
                          maxLength={10}
                          className="input-field-3d"
                          placeholder="10-digit Phone"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value.replace(/[^0-9]/g, ''))}
                          required 
                        />
                      </div>
                    </div>

                    <div className="input-group-3d">
                      <label className="input-label-3d">Email Address</label>
                      <div className="input-wrapper-3d">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon-3d" style={{ width: '16px', height: '16px' }}>
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <input 
                          type="email" 
                          className="input-field-3d"
                          placeholder="email@example.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="input-group-3d">
                      <label className="input-label-3d">Password</label>
                      <div className="input-wrapper-3d">
                        <Lock size={16} className="input-icon-3d" />
                        <input 
                          type="password" 
                          className="input-field-3d"
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <button type="submit" className="admin-submit-btn" style={{ marginTop: '0.4rem' }}>
                      Create Account
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <button 
                      onClick={() => setIsAuthFlipped(false)}
                      style={{ color: 'var(--color-primary)', fontWeight: 700 }}
                    >
                      Login Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Customer Account Dashboard */
          <div className="container">
          <div className="account-layout">
            {/* Sidebar */}
            <aside className="account-menu-sidebar">
              {/* Avatar hero card */}
              <div className="account-hero-card">
                <div className="account-avatar">
                  {(userProfile.name || 'U').charAt(0)}
                </div>
                <div>
                  <div className="account-hero-name">{userProfile.name || 'Guest Customer'}</div>
                  <div className="account-hero-phone">+91 {userProfile.phone || '—'}</div>
                </div>
              </div>

              <button className={`account-menu-btn ${accountSubTab === 'profile' ? 'active' : ''}`} onClick={() => { setAccountSubTab('profile'); setSelectedTrackingOrder(null); }}>
                <User size={15} /> My Profile
              </button>
              <button className={`account-menu-btn ${accountSubTab === 'orders' ? 'active' : ''}`} onClick={() => { setAccountSubTab('orders'); setSelectedTrackingOrder(null); }}>
                <Package size={15} /> My Orders
              </button>
              <button className={`account-menu-btn ${accountSubTab === 'addresses' ? 'active' : ''}`} onClick={() => { setAccountSubTab('addresses'); setSelectedTrackingOrder(null); }}>
                <MapPinned size={15} /> Saved Addresses
              </button>
              <button className={`account-menu-btn ${accountSubTab === 'wishlist' ? 'active' : ''}`} onClick={() => { setActiveView('wishlist'); setSelectedTrackingOrder(null); }}>
                <Heart size={15} /> My Wishlist
                {wishlist.length > 0 && <span className="badge" style={{ marginLeft: 'auto' }}>{wishlist.length}</span>}
              </button>
              <button className="account-menu-btn danger" style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }} onClick={() => { setIsUserLoggedIn(false); setActiveView('home'); }}>
                <LogOut size={15} /> Exit Account
              </button>
            </aside>

            {/* Main Content Pane */}
            <main className="account-content-pane">
              {/* PROFILE TAB */}
              {accountSubTab === 'profile' && (
                <div>
                  <div className="account-section-header">
                    <h3 className="account-section-title">
                      <User size={18} /> Profile Details
                    </h3>
                  </div>
                  <div className="profile-info-grid">
                    <div className="profile-info-card">
                      <div className="profile-info-label">Full Name</div>
                      <div className="profile-info-value">
                        <User size={14} style={{ color: 'var(--color-primary)' }} />
                        {userProfile.name || '—'}
                      </div>
                    </div>
                    <div className="profile-info-card">
                      <div className="profile-info-label">Mobile Phone</div>
                      <div className="profile-info-value">
                        <Phone size={14} style={{ color: 'var(--color-primary)' }} />
                        +91 {userProfile.phone || '—'}
                      </div>
                    </div>
                    <div className="profile-info-card">
                      <div className="profile-info-label">Email Address</div>
                      <div className="profile-info-value" style={{ fontSize: '0.9rem' }}>
                        {userProfile.email || '—'}
                      </div>
                    </div>
                    <div className="profile-info-card">
                      <div className="profile-info-label">Account Status</div>
                      <div className="profile-info-value">
                        <span style={{ fontSize: '0.8rem', background: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 700 }}>
                          ✓ Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick navigation tiles */}
                  <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                    <button className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} onClick={() => setAccountSubTab('orders')}>
                      <Package size={22} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>My Orders</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{orders.filter(o => o.customer?.phone === userProfile.phone).length} placed</span>
                    </button>
                    <button className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} onClick={() => setAccountSubTab('addresses')}>
                      <MapPinned size={22} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Addresses</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{userProfile.addresses?.length || 0} saved</span>
                    </button>
                    <button className="glass-card" style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} onClick={() => setActiveView('wishlist')}>
                      <Heart size={22} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Wishlist</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{wishlist.length} items</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ORDERS TAB */}
              {accountSubTab === 'orders' && !selectedTrackingOrder && (
                <div>
                  <div className="account-section-header">
                    <h3 className="account-section-title">
                      <Package size={18} /> Order History
                    </h3>
                  </div>

                  {orders.filter(o => o.customer?.phone === userProfile.phone).length === 0 ? (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Package size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                      <h4 style={{ marginBottom: '0.5rem' }}>No orders yet</h4>
                      <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>You have not placed any orders yet. Explore our collection!</p>
                      <button className="btn btn-primary" onClick={() => setActiveView('shop')}>Browse Products</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {orders.filter(o => o.customer?.phone === userProfile.phone).map(o => (
                        <div key={o.id} className="order-card-premium">
                          <div className="order-card-header">
                            <div>
                              <div className="order-card-meta-label">Order ID</div>
                              <div className="order-card-meta-value">{o.id}</div>
                            </div>
                            <div>
                              <div className="order-card-meta-label">Placed On</div>
                              <div className="order-card-meta-value">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            </div>
                            <div>
                              <div className="order-card-meta-label">Total</div>
                              <div className="order-card-meta-value" style={{ color: 'var(--color-primary)' }}>₹{o.total?.toLocaleString('en-IN')}</div>
                            </div>
                            <span className={`status-badge ${o.status?.toLowerCase()}`}>{o.status}</span>
                          </div>
                          <div className="order-card-body">
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {o.items?.length} item{o.items?.length !== 1 ? 's' : ''} · {o.paymentMethod || 'COD'}
                            </span>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => setSelectedTrackingOrder(o)}>
                              Track Order →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {accountSubTab === 'orders' && selectedTrackingOrder && (
                <div>
                  <div className="account-section-header">
                    <h3 className="account-section-title">
                      <Package size={18} /> Order Tracking
                    </h3>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }} onClick={() => setSelectedTrackingOrder(null)}>
                      ← All Orders
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="profile-info-card">
                      <div className="profile-info-label">Order ID</div>
                      <div className="profile-info-value" style={{ fontSize: '0.9rem' }}>{selectedTrackingOrder.id}</div>
                    </div>
                    <div className="profile-info-card">
                      <div className="profile-info-label">Status</div>
                      <div className="profile-info-value"><span className={`status-badge ${selectedTrackingOrder.status?.toLowerCase()}`}>{selectedTrackingOrder.status}</span></div>
                    </div>
                    <div className="profile-info-card">
                      <div className="profile-info-label">Total Paid</div>
                      <div className="profile-info-value" style={{ color: 'var(--color-primary)' }}>₹{selectedTrackingOrder.total?.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="profile-info-card">
                      <div className="profile-info-label">Payment</div>
                      <div className="profile-info-value" style={{ fontSize: '0.9rem' }}>{selectedTrackingOrder.paymentMethod || 'COD'}</div>
                    </div>
                  </div>

                  {/* Real-time 3D Order Tracking System */}
                  <div className="tracking-road-3d-wrap">
                    {/* Header bar of 3D tracking */}
                    <div className="tracker-3d-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="live-status-pulse"></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>Real-time 3D Tracker</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: <strong style={{ color: '#ef4444' }}>{selectedTrackingOrder.status}</strong></span>
                    </div>

                    <div className="road-3d-scene">
                      <div className="road-3d">
                        <div className={`road-line ${selectedTrackingOrder.status !== 'Delivered' ? 'driving' : ''}`}></div>
                        
                        {/* 5 Checkpoints along the road */}
                        {['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                          const statuses = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
                          const currentIdx = statuses.indexOf(selectedTrackingOrder.status);
                          const isDone = idx <= currentIdx;
                          const isActive = idx === currentIdx;
                          const positions = ['12%', '32%', '52%', '72%', '92%'];
                          
                          // Checkpoint Icon
                          let icon = idx + 1;
                          if (step === 'Pending') icon = '📦';
                          if (step === 'Confirmed') icon = '✓';
                          if (step === 'Shipped') icon = '🚚';
                          if (step === 'Out for Delivery') icon = '🛵';
                          if (step === 'Delivered') icon = '🏠';

                          return (
                            <div key={step} className={`checkpoint-3d ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`} style={{ left: positions[idx] }}>
                              <div className={`pin-card ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                                {step}
                              </div>
                              <div className={`pin-dot ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                                {icon}
                              </div>
                              <div className={`pin-stem ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}></div>
                            </div>
                          );
                        })}

                        {/* The 3D Rider (Scooter / Car) */}
                        {(() => {
                          const statuses = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
                          const currentIdx = statuses.indexOf(selectedTrackingOrder.status);
                          const positions = ['12%', '32%', '52%', '72%', '92%'];
                          const riderPos = positions[currentIdx >= 0 ? currentIdx : 0];
                          
                          // Render bike/scooter with dynamic details
                          return (
                            <div className="bike-3d" style={{ left: riderPos }}>
                              <div className="bike-shadow"></div>
                              <div className="bike-body-container">
                                <svg className="bike-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {/* Scooter Frame */}
                                  <path d="M12 42h14l4-8h10v8h10" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M40 34l6-16h-4" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M42 18h6" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"/>
                                  {/* Seat & Box */}
                                  <path d="M18 34h12v3H18z" fill="#1e293b"/>
                                  <rect x="8" y="22" width="12" height="12" rx="2" fill="#ef4444"/>
                                  {/* Text on Box */}
                                  <text x="11" y="31" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">M</text>
                                  {/* Rider Helmet */}
                                  <circle cx="34" cy="22" r="5" fill="#ef4444" />
                                  <path d="M34 22h5v3h-5z" fill="#0f172a" />
                                  {/* Rider Body */}
                                  <path d="M30 27c2-3 4-4 7-4s5 2 5 5v6H30v-7z" fill="#3b82f6" />
                                  {/* Wheels */}
                                  <circle cx="16" cy="46" r="6" stroke="#0f172a" strokeWidth="3" fill="#64748b"/>
                                  <circle cx="16" cy="46" r="2" fill="#ffffff"/>
                                  <circle cx="46" cy="46" r="6" stroke="#0f172a" strokeWidth="3" fill="#64748b"/>
                                  <circle cx="46" cy="46" r="2" fill="#ffffff"/>
                                  {/* Headlight Ray */}
                                  {selectedTrackingOrder.status !== 'Delivered' && (
                                    <path d="M46 20l10 3m-10-3l8-1" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                                  )}
                                </svg>
                              </div>
                            </div>
                          );
                        })()}

                      </div>
                    </div>
                  </div>

                  <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Items in this Order</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedTrackingOrder.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {Object.entries(item.variant || {}).filter(([k]) => k !== 'id' && k !== 'stock').map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700 }}>₹{item.price}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>×{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ADDRESSES TAB */}
              {accountSubTab === 'addresses' && (
                <div>
                  <div className="account-section-header">
                    <h3 className="account-section-title">
                      <MapPinned size={18} /> Saved Addresses
                    </h3>
                    <button className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }} onClick={() => setAddressFormOpen(true)}>
                      + Add New
                    </button>
                  </div>

                  {addressFormOpen && (
                    <form onSubmit={handleAddAddressSubmit} className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                      <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>New Shipping Address</h4>
                      <div className="form-grid">
                        <div className="form-group">
                          <label className="form-label">Address Name *</label>
                          <input type="text" required className="form-input" placeholder="e.g. Home" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Type</label>
                          <select className="form-input" value={newAddress.type} onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}>
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                          </select>
                        </div>
                        <div className="form-group full">
                          <label className="form-label">Full Address *</label>
                          <input type="text" required className="form-input" placeholder="House/Flat No, Street, Landmark" value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">City *</label>
                          <input type="text" required className="form-input" placeholder="e.g. Vapi" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pincode *</label>
                          <input type="text" required className="form-input" placeholder="6-digit PIN" value={newAddress.pincode} onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Phone *</label>
                          <input type="text" required className="form-input" placeholder="10-digit number" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setAddressFormOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Address</button>
                      </div>
                    </form>
                  )}

                  {userProfile.addresses?.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <MapPinned size={40} strokeWidth={1} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                      <p>No saved addresses. Add one to speed up checkout!</p>
                    </div>
                  ) : (
                    <div className="address-grid">
                      {userProfile.addresses.map(a => (
                        <div key={a.id || a._id} className={`address-box-card ${a.isDefault ? 'default' : ''}`}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <span className="address-tag">{a.type}</span>
                            {a.isDefault && <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, background: 'var(--color-primary-light)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>Default</span>}
                          </div>
                          <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{a.name}</h4>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', flexGrow: 1, lineHeight: 1.6 }}>
                            {a.address}, {a.city}{a.state ? `, ${a.state}` : ''} — {a.pincode}<br />
                            📞 {a.phone}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'center' }}>
                            {!a.isDefault && (
                              <button style={{ fontSize: '0.75rem', textDecoration: 'underline', color: 'var(--text-muted)' }} onClick={() => saveAddress({ ...a, isDefault: true })}>Set as Default</button>
                            )}
                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', marginLeft: 'auto', color: 'var(--color-primary)', borderColor: 'rgba(239,68,68,0.3)' }} onClick={() => deleteAddress(a.id || a._id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
        )
      ) : activeView === 'info' ? (
        <div className="container" style={{ padding: '2rem 0' }}>
          
          {/* Breadcrumbs */}
          <div className="breadcrumb-container" style={{ marginBottom: '2rem' }}>
            <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Home</a>
            <span>/</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {infoPageKey === 'contact' && 'Contact Us'}
              {infoPageKey === 'returns' && 'Returns & Refunds'}
              {infoPageKey === 'faq' && 'FAQs'}
              {infoPageKey === 'about' && 'About Us'}
              {infoPageKey === 'investors' && 'Investor Relations'}
              {infoPageKey === 'careers' && 'Careers'}
              {infoPageKey === 'vouchers' && 'Gift Vouchers'}
              {infoPageKey === 'community' && 'Community Initiatives'}
              {infoPageKey === 'terms' && 'T&C'}
              {infoPageKey === 'privacy' && 'Privacy Policy'}
              {infoPageKey === 'sitemap' && 'Sitemap'}
              {infoPageKey === 'notified' && 'Get Notified'}
              {infoPageKey === 'blogs' && 'Blogs'}
            </span>
          </div>

          <div className="account-layout">
            
            {/* Sidebar menu */}
            <aside className="account-menu-sidebar">
              <div style={{ padding: '1.25rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                Info Directory
              </div>
              <button className={`account-menu-btn ${infoPageKey === 'contact' ? 'active' : ''}`} onClick={() => setInfoPageKey('contact')}>Contact Us</button>
              <button className={`account-menu-btn ${infoPageKey === 'returns' ? 'active' : ''}`} onClick={() => setInfoPageKey('returns')}>Returns & Refunds</button>
              <button className={`account-menu-btn ${infoPageKey === 'faq' ? 'active' : ''}`} onClick={() => setInfoPageKey('faq')}>FAQs</button>
              <button className={`account-menu-btn ${infoPageKey === 'about' ? 'active' : ''}`} onClick={() => setInfoPageKey('about')}>About Us</button>
              <button className={`account-menu-btn ${infoPageKey === 'investors' ? 'active' : ''}`} onClick={() => setInfoPageKey('investors')}>Investor Relations</button>
              <button className={`account-menu-btn ${infoPageKey === 'careers' ? 'active' : ''}`} onClick={() => setInfoPageKey('careers')}>Careers</button>
              <button className={`account-menu-btn ${infoPageKey === 'vouchers' ? 'active' : ''}`} onClick={() => setInfoPageKey('vouchers')}>Gift Vouchers</button>
              <button className={`account-menu-btn ${infoPageKey === 'community' ? 'active' : ''}`} onClick={() => setInfoPageKey('community')}>Community Initiatives</button>
              <button className={`account-menu-btn ${infoPageKey === 'terms' ? 'active' : ''}`} onClick={() => setInfoPageKey('terms')}>T&C</button>
              <button className={`account-menu-btn ${infoPageKey === 'privacy' ? 'active' : ''}`} onClick={() => setInfoPageKey('privacy')}>Privacy Policy</button>
              <button className={`account-menu-btn ${infoPageKey === 'sitemap' ? 'active' : ''}`} onClick={() => setInfoPageKey('sitemap')}>Sitemap</button>
              <button className={`account-menu-btn ${infoPageKey === 'notified' ? 'active' : ''}`} onClick={() => setInfoPageKey('notified')}>Get Notified</button>
              <button className={`account-menu-btn ${infoPageKey === 'blogs' ? 'active' : ''}`} onClick={() => setInfoPageKey('blogs')}>Blogs</button>
            </aside>

            {/* Main pane content */}
            <main className="account-content-pane">
              
              {/* CONTACT US */}
              {infoPageKey === 'contact' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Contact Us</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Get in touch with the official Magnet crew. We are here to assist with size fittings, returns, order track updates, or wholesale queries.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="detail-split-grid">
                    
                    <form onSubmit={(e) => { e.preventDefault(); alert('Message successfully sent! Our crew will WhatsApp/email you shortly.'); e.target.reset(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div className="input-group-3d">
                        <label className="input-label-3d">Full Name</label>
                        <input type="text" required placeholder="John Doe" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                      </div>
                      <div className="input-group-3d">
                        <label className="input-label-3d">Email Address</label>
                        <input type="email" required placeholder="john@example.com" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                      </div>
                      <div className="input-group-3d">
                        <label className="input-label-3d">Message Subject</label>
                        <input type="text" required placeholder="Size Exchange / Adapter Issue" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                      </div>
                      <div className="input-group-3d">
                        <label className="input-label-3d">Your Message</label>
                        <textarea required placeholder="Write your message here..." className="input-field-3d" style={{ paddingLeft: '1rem', height: '100px', resize: 'none' }}></textarea>
                      </div>
                      <button type="submit" className="admin-submit-btn">Send Message</button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: '#ef4444', fontWeight: 800 }}>Retail Outlet</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                          {settings.address}
                        </p>
                      </div>
                      <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: '#ef4444', fontWeight: 800 }}>WhatsApp Hotline</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                          {settings.whatsappNumber} (Direct Store Desk)
                        </p>
                      </div>
                      <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                        <h4 style={{ margin: '0 0 0.5rem', color: '#ef4444', fontWeight: 800 }}>Email Support</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                          support@magnetvapi.com (Replies in 24 hours)
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* RETURNS & REFUNDS */}
              {infoPageKey === 'returns' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Returns & Refund Policy</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Hassle-free regional exchanges and size swaps for all customers in Vapi, Surat, and Mumbai.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontWeight: 800 }}>7 Days Easy Replacement</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>If the streetwear fit isn't right, or the mobile accessory has functional issues, request an exchange within 7 days of package delivery.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <div style={{ fontSize: '1.5rem' }}>🚚</div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontWeight: 800 }}>Free Reverse Pickup</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Our courier partners will arrange reverse pickup directly from your saved address at zero extra cost.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <div style={{ fontSize: '1.5rem' }}>💳</div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontWeight: 800 }}>Store Credit or Bank Refunds</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Once inspected at our Vapi store, refunds are instantly disbursed as store codes or bank transfers within 48 hours.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQS */}
              {infoPageKey === 'faq' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Quick answers to commonly asked questions about our streetwear collection and logistics support.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Q: Do you ship outside Vapi and southern Gujarat?</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Yes, we ship nationwide. Regional deliveries (Vapi, Valsad, Silvassa, Surat, Mumbai) arrive in 24-48 hours. Other cities take 3-5 days.</p>
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Q: What is the quality and fit of the oversized t-shirts?</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>All graphic tees are heavy-duty 240 GSM 100% premium combed cotton. They feature a relaxed drop shoulder silhouette with high-density puff or screen print details.</p>
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Q: How can I track my COD order?</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Once confirmed via WhatsApp or phone, you can track it in the customer account orders tab using our live 3D shipping timeline dashboard.</p>
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Q: Can I check my phone cover or adapter model before paying for COD?</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Yes. Our delivery partner supports basic box inspection on request before collection of COD payments to ensure you receive the correct specification.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ABOUT US */}
              {infoPageKey === 'about' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>About Us</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Discover the history, design philosophy, and retail goals behind Magnet.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <p>Established in 2026, <strong>Magnet Vapi Official</strong> bridges the gap between modern streetwear aesthetics and next-generation mobile armor. We believe that what you wear and the tech armor you carry are extensions of your creative identity.</p>
                    <p>We work directly with premium yarn spinning mills to weave 240 GSM heavy cotton loopknit fabrics. Simultaneously, our tech arm works with premium suppliers to craft dual-layer shockproof MagSafe covers, Gallium Nitride (GaN) fast wall chargers, and carbon fiber accessories.</p>
                    <p>By bypassing traditional distributor markups and operating out of Vapi, Gujarat, we offer boutique, state-of-the-art designs directly to customers across India at fair prices.</p>
                  </div>
                </div>
              )}

              {/* INVESTOR RELATION */}
              {infoPageKey === 'investors' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Investor Relations</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Magnet corporate updates, financial performance indices, and expansion schedules.</p>
                  
                  <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', marginBottom: '1.5rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Corporate Structure</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Magnet is an independent privately-held fashion and consumer electronics retail brand based in Vapi. We are self-funded and operating with high year-over-year organic growth across offline store counters and online drop sales.</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="detail-split-grid">
                    <button className="btn btn-secondary" onClick={() => alert('Downloading Q1 2026 Brand deck...')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                      📥 Q1 2026 Earnings (PDF)
                    </button>
                    <button className="btn btn-secondary" onClick={() => alert('Downloading annual brand pitch deck...')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                      📥 Annual Brand Deck 2026 (PDF)
                    </button>
                  </div>
                </div>
              )}

              {/* CAREERS */}
              {infoPageKey === 'careers' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Careers</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Join the Magnet retail and design crew. Build the next wave of apparel culture.</p>
                  
                  <h4 style={{ fontWeight: 800, marginBottom: '1rem' }}>Current Openings:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h5 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800 }}>Retail Store Associate (Vapi Outlet)</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Full-time. Guide store walk-ins, manage inventory logs, and coordinate customer sizing advice.</p>
                    </div>
                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h5 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 800 }}>Graphic Designer — Streetwear & Puff Print (Hybrid)</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Contract / Drop-based. Design premium vector assets, typography layouts, and puff print dimensions.</p>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); alert('Application successfully received! Our HR team will call you back.'); e.target.reset(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Apply Now:</h4>
                    <div className="input-group-3d">
                      <label className="input-label-3d">Full Name</label>
                      <input type="text" required placeholder="Your Name" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                    </div>
                    <div className="input-group-3d">
                      <label className="input-label-3d">Select Position</label>
                      <select className="input-field-3d" style={{ paddingLeft: '0.75rem', backgroundColor: 'var(--bg-input)' }}>
                        <option>Retail Store Associate</option>
                        <option>Graphic Designer</option>
                        <option>Other / Open Application</option>
                      </select>
                    </div>
                    <div className="input-group-3d">
                      <label className="input-label-3d">Portfolio or Resume Link</label>
                      <input type="url" required placeholder="https://linkedin.com/in/username" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                    </div>
                    <button type="submit" className="admin-submit-btn">Submit Application</button>
                  </form>
                </div>
              )}

              {/* GIFT VOUCHERS */}
              {infoPageKey === 'vouchers' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Gift Vouchers</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Gift streetwear drop shopping vouchers to your friends and family.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="detail-split-grid">
                    
                    <form onSubmit={(e) => { e.preventDefault(); alert('Gift voucher successfully added to checkout! Complete payment to dispatch code.'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Purchase Voucher:</h4>
                      <div className="input-group-3d">
                        <label className="input-label-3d">Select Amount</label>
                        <select className="input-field-3d" style={{ paddingLeft: '0.75rem', backgroundColor: 'var(--bg-input)' }}>
                          <option>₹500 Voucher</option>
                          <option>₹1000 Voucher</option>
                          <option>₹2000 Voucher</option>
                          <option>₹5000 Voucher</option>
                        </select>
                      </div>
                      <div className="input-group-3d">
                        <label className="input-label-3d">Recipient Mobile Number</label>
                        <input type="text" maxLength={10} required placeholder="Recipient's Phone" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                      </div>
                      <button type="submit" className="admin-submit-btn">Buy Gift Voucher</button>
                    </form>

                    <form onSubmit={(e) => { e.preventDefault(); alert('Voucher code verification: Valid. Current balance: ₹0.00.'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', height: 'fit-content' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800 }}>Verify Voucher Code:</h4>
                      <div className="input-group-3d">
                        <label className="input-label-3d">Enter 16-digit Code</label>
                        <input type="text" required placeholder="MGT-XXXX-XXXX-XXXX" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                      </div>
                      <button type="submit" className="admin-submit-btn">Verify Balance</button>
                    </form>

                  </div>
                </div>
              )}

              {/* COMMUNITY INITIATIVES */}
              {infoPageKey === 'community' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Community Initiatives</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>How Magnet supports local communities, youth cultures, and green production.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Sponsorship of Local Skate/Hip-hop Tournaments</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>We regularly fund regional skateboard gatherings and hip-hop cypher events in Surat and Vapi, fostering self-expression and street artistry amongst local youth.</p>
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>100% Biodegradable Packaging Armor</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>To combat plastic waste, all items are shipped in cornstarch-based compostable polymers. They disintegrate in home compost piles within 180 days.</p>
                    </div>

                    <div style={{ padding: '1.25rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>Clothing Recycle drop Program</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>Bring your pre-loved Magnet oversized shirts back to our physical store counter in Vapi. We recycle the yarn and give you a flat 15% discount code for your next purchase.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* T&C */}
              {infoPageKey === 'terms' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Terms & Conditions</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Please read the following guidelines regulating product availability, deliveries, and payment methods.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p><strong>1. Product Specifications:</strong> Magnet oversized streetwear apparel is manufactured using heavy-duty loops. Fits are intentionally relaxed. Tech cases must match the selected mobile phone model.</p>
                    <p><strong>2. COD Purchase Limits:</strong> COD orders are subjected to phone validation. Magnet reserves the right to cancel packages if customer coordinates are suspicious or unverifiable.</p>
                    <p><strong>3. Intellectual Property:</strong> All designs, puff print vectors, and website branding belong exclusively to Magnet Vapi Official. Re-distribution or copying of graphic materials is legally prohibited.</p>
                  </div>
                </div>
              )}

              {/* PRIVACY POLICY */}
              {infoPageKey === 'privacy' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Privacy Policy</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>How we handle user information, cookie caches, and payment security details.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <p><strong>1. Personal Data:</strong> We collect only necessary details (shipping address, email, phone number) required to coordinate delivery schedules and verify COD shipments.</p>
                    <p><strong>2. Data Encryption:</strong> Account passcodes are encrypted. Credit card and digital payment integrations are fully managed via secure PCI-DSS verified partner gateways.</p>
                    <p><strong>3. Cookie Storage:</strong> We cache session preferences in browser localStorage to save theme modes (Dark/Light) and active shopping cart items.</p>
                  </div>
                </div>
              )}

              {/* SITEMAP */}
              {infoPageKey === 'sitemap' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Sitemap</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Direct links to navigate all public sections of the Magnet portal.</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="detail-split-grid">
                    <div>
                      <h4 style={{ color: '#ef4444', fontWeight: 800, marginBottom: '0.75rem' }}>Storefront Views</h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('home'); }} style={{ color: 'var(--text-secondary)' }}>🏠 Homepage / Drop Row</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('shop'); setActiveCategory('all'); }} style={{ color: 'var(--text-secondary)' }}>🛍️ All Shop Collection</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('wishlist'); }} style={{ color: 'var(--text-secondary)' }}>❤️ Customer Wishlist</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('account'); }} style={{ color: 'var(--text-secondary)' }}>👤 Customer Account Pane</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ color: '#ef4444', fontWeight: 800, marginBottom: '0.75rem' }}>Main Categories</h4>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('shop'); setActiveCategory('clothing'); }} style={{ color: 'var(--text-secondary)' }}>👕 Oversized Streetwear</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('shop'); setActiveCategory('accessories'); }} style={{ color: 'var(--text-secondary)' }}>🔌 Chargers & Protective Tech</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* GET NOTIFIED */}
              {infoPageKey === 'notified' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Get Notified</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Subscribe to SMS, WhatsApp, and email alerts for limited apparel drops and restock alerts.</p>
                  
                  <form onSubmit={(e) => { e.preventDefault(); alert('Successfully registered for drop alerts! You will receive restock notifications on your phone.'); e.target.reset(); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', maxWidth: '480px', margin: '0 auto' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontWeight: 800, textAlign: 'center' }}>Restock Register:</h4>
                    <div className="input-group-3d">
                      <label className="input-label-3d">Mobile Number</label>
                      <input type="text" maxLength={10} required placeholder="10-digit Mobile" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                    </div>
                    <div className="input-group-3d">
                      <label className="input-label-3d">Email Address</label>
                      <input type="email" required placeholder="email@example.com" className="input-field-3d" style={{ paddingLeft: '1rem' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" defaultChecked /> Send me WhatsApp alerts
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" defaultChecked /> Send me SMS alerts
                      </label>
                    </div>
                    <button type="submit" className="admin-submit-btn">Subscribe to Alerts</button>
                  </form>
                </div>
              )}

              {/* BLOGS */}
              {infoPageKey === 'blogs' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Magnet Stories & Blogs</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Stay updated with current fashion trends, mobile specs guides, and local culture drops.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Fashion & Styling</span>
                      <h4 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>Oversized Tees: The Style and Sizing Guide</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.5 }}>Uncover how to layer drop shoulder shirts, balance silhouettes with wide-fit utility pants, and choose between puff print designs.</p>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => alert('Full article coming soon!')}>Read Article</button>
                    </div>

                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Tech & Armor Specs</span>
                      <h4 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>GaN Chargers vs Traditional Adapters: The Real Performance</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.5 }}>Gallium Nitride (GaN) allows fast wall adaptors to output 65W power with half the volume of old silicon bricks. Understand how temperature defense protects batteries.</p>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => alert('Full article coming soon!')}>Read Article</button>
                    </div>

                    <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Local Scene</span>
                      <h4 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.15rem', fontWeight: 800 }}>Vapi Streetwear: The Evolution of local fashion hubs</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem', lineHeight: 1.5 }}>A look inside Valsad and Vapi’s growing fashion circles and how drop shoulder silhouettes are replacing standard slim-fit retail clothing.</p>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => alert('Full article coming soon!')}>Read Article</button>
                    </div>
                  </div>
                </div>
              )}

            </main>

          </div>
        </div>
      ) : activeView === 'product-detail' && selectedProduct ? (
        /* Product Detail page */
        <div className="container" style={{ padding: '1.5rem 0' }}>
          {/* Breadcrumbs / Back button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="breadcrumb-container">
              <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Home</a>
              <span>/</span>
              <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setActiveView('shop'); setActiveCategory('all'); }}>Shop</a>
              <span>/</span>
              <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setActiveView('shop'); setActiveCategory(selectedProduct.category); }}>
                {selectedProduct.category === 'clothing' ? 'Clothing' : 'Accessories'}
              </a>
              <span>/</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedProduct.name}</span>
            </div>
            
            <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => { setActiveView('shop'); }}>
              ← Back to Shop
            </button>
          </div>

          {/* Product main split layout card */}
          <div className="glass-card" style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
            <div className="product-detail-grid">
              {/* LEFT COLUMN: Gallery & Zoom */}
              <div className="detail-gallery-box">
                <div className="gallery-thumbnails-strip">
                  <div className={`gallery-thumbnail-card ${activeThumb === 0 ? 'active' : ''}`} onClick={() => setActiveThumb(0)}>
                    <img src={selectedProduct.image} className="gallery-thumbnail-img" />
                  </div>
                  {/* Mock multiple thumbnails using standard default or variant pics */}
                  <div className={`gallery-thumbnail-card ${activeThumb === 1 ? 'active' : ''}`} onClick={() => setActiveThumb(1)}>
                    <img src={selectedProduct.image} className="gallery-thumbnail-img" style={{ filter: 'hue-rotate(45deg)' }} />
                  </div>
                </div>
                
                <div className="gallery-zoom-box">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="gallery-zoom-img" 
                    style={{ filter: activeThumb === 1 ? 'hue-rotate(45deg)' : 'none' }}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Details & Purchase actions */}
              <div className="details-info">
                <span className="detail-sku">{selectedProduct.brand || 'Magnet'} | SKU: {selectedProduct.sku}</span>
                <h2 className="detail-title">{selectedProduct.name}</h2>
                
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="rating-badge">{selectedProduct.rating} ★</span>
                  <span className="reviews-count">({selectedProduct.reviewsCount} customer reviews)</span>
                </div>

                <div className="detail-price-row">
                  <span className="detail-price">₹{selectedProduct.discountPrice || selectedProduct.price}</span>
                  {selectedProduct.discountPrice && (
                    <>
                      <span className="detail-original">₹{selectedProduct.price}</span>
                      <span className="discount-percentage" style={{ fontSize: '1.1rem' }}>
                        ({Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)}% OFF)
                      </span>
                    </>
                  )}
                </div>

                <p className="detail-desc">{selectedProduct.description}</p>

                {/* Variant selection */}
                <div className="variants-section">
                  {selectedProduct.category === 'clothing' ? (
                    <>
                      <div>
                        <span className="variant-label">Size</span>
                        <div className="variant-options" style={{ marginTop: '0.4rem' }}>
                          {Array.from(new Set(selectedProduct.variants.map(v => v.size))).map(size => {
                            const isSel = detailVariant?.size === size;
                            const isAvail = selectedProduct.variants.some(v => v.size === size && v.stock > 0);
                            return (
                              <button
                                key={size}
                                className={`variant-opt ${isSel ? 'selected' : ''} ${!isAvail ? 'disabled' : ''}`}
                                onClick={() => {
                                  const matching = selectedProduct.variants.find(v => v.size === size && (detailVariant?.color ? v.color === detailVariant.color : true));
                                  setDetailVariant(matching || selectedProduct.variants.find(v => v.size === size));
                                }}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="variant-label">Color</span>
                        <div className="variant-options" style={{ marginTop: '0.4rem' }}>
                          {Array.from(new Set(selectedProduct.variants.map(v => v.color))).map(color => {
                            const isSel = detailVariant?.color === color;
                            const isAvail = selectedProduct.variants.some(v => v.color === color && v.stock > 0);
                            return (
                              <button
                                key={color}
                                className={`variant-opt ${isSel ? 'selected' : ''} ${!isAvail ? 'disabled' : ''}`}
                                onClick={() => {
                                  const matching = selectedProduct.variants.find(v => v.color === color && (detailVariant?.size ? v.size === detailVariant.size : true));
                                  setDetailVariant(matching || selectedProduct.variants.find(v => v.color === color));
                                }}
                              >
                                {color}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {selectedProduct.variants.some(v => v.compatibleModel) && (
                        <div>
                          <span className="variant-label">Compatible Model</span>
                          <div className="variant-options" style={{ marginTop: '0.4rem' }}>
                            {Array.from(new Set(selectedProduct.variants.map(v => v.compatibleModel))).map(model => {
                              const isSel = detailVariant?.compatibleModel === model;
                              const isAvail = selectedProduct.variants.some(v => v.compatibleModel === model && v.stock > 0);
                              return (
                                <button
                                  key={model}
                                  className={`variant-opt ${isSel ? 'selected' : ''} ${!isAvail ? 'disabled' : ''}`}
                                  onClick={() => {
                                    const matching = selectedProduct.variants.find(v => v.compatibleModel === model && (detailVariant?.color ? v.color === detailVariant.color : true));
                                    setDetailVariant(matching || selectedProduct.variants.find(v => v.compatibleModel === model));
                                  }}
                                >
                                  {model}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {selectedProduct.variants.some(v => v.specification) && (
                        <div>
                          <span className="variant-label">Specification</span>
                          <div className="variant-options" style={{ marginTop: '0.4rem' }}>
                            {Array.from(new Set(selectedProduct.variants.map(v => v.specification))).map(spec => {
                              const isSel = detailVariant?.specification === spec;
                              const isAvail = selectedProduct.variants.some(v => v.specification === spec && v.stock > 0);
                              return (
                                <button
                                  key={spec}
                                  className={`variant-opt ${isSel ? 'selected' : ''} ${!isAvail ? 'disabled' : ''}`}
                                  onClick={() => {
                                    const matching = selectedProduct.variants.find(v => v.specification === spec && (detailVariant?.color ? v.color === detailVariant.color : true));
                                    setDetailVariant(matching || selectedProduct.variants.find(v => v.specification === spec));
                                  }}
                                >
                                  {spec}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {selectedProduct.variants.some(v => v.color) && (
                        <div>
                          <span className="variant-label">Color</span>
                          <div className="variant-options" style={{ marginTop: '0.4rem' }}>
                            {Array.from(new Set(selectedProduct.variants.map(v => v.color))).map(color => {
                              const isSel = detailVariant?.color === color;
                              const isAvail = selectedProduct.variants.some(v => v.color === color && v.stock > 0);
                              return (
                                <button
                                  key={color}
                                  className={`variant-opt ${isSel ? 'selected' : ''} ${!isAvail ? 'disabled' : ''}`}
                                  onClick={() => {
                                    const matching = selectedProduct.variants.find(v => v.color === color && 
                                      (detailVariant?.compatibleModel ? v.compatibleModel === detailVariant.compatibleModel : true) &&
                                      (detailVariant?.specification ? v.specification === detailVariant.specification : true)
                                    );
                                    setDetailVariant(matching || selectedProduct.variants.find(v => v.color === color));
                                  }}
                                >
                                  {color}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Stock status indicator */}
                <div style={{ margin: '0.25rem 0' }}>
                  {detailVariant ? (
                    <span className={`stock-status ${detailVariant.stock > 0 ? 'in' : 'out'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: detailVariant.stock > 0 ? '#10b981' : '#ef4444' }}></span>
                      {detailVariant.stock > 0 
                        ? detailVariant.stock <= 3 
                          ? `Only ${detailVariant.stock} items left (Low Stock)`
                          : `In Stock (${detailVariant.stock} available)`
                        : 'Temporarily Out of Stock'}
                    </span>
                  ) : (
                    <span className="stock-status out">Out of Stock</span>
                  )}
                </div>

                {/* PINCODE DELIVERY CHECKER */}
                <div className="pincode-validator-card">
                  <span className="variant-label" style={{ fontSize: '0.75rem' }}>Delivery & Cod Availability</span>
                  <form onSubmit={handlePincodeCheck} className="pincode-input-row">
                    <input 
                      type="text" 
                      maxLength={6} 
                      className="pincode-textbox" 
                      placeholder="Enter 6-digit Pincode"
                      value={pincodeVal}
                      onChange={(e) => setPincodeVal(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    <button type="submit" className="btn btn-secondary" style={{ padding: '0 1rem', height: 'auto', fontSize: '0.85rem' }}>Check</button>
                  </form>

                  {pincodeChecked && (
                    <div className="pincode-feedback-box">
                      {!pincodeError ? (
                        <>
                          <span style={{ color: '#059669', fontWeight: 700 }}>✓ Delivery Available</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Express Delivery by <strong>Tomorrow</strong> (COD eligible)</span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: '#4f46e5', fontWeight: 700 }}>✓ Domestic Delivery Available</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Estimated Delivery in <strong>4-6 business days</strong> (Prepayment COD)</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Purchase buttons */}
                <div className="qty-purchase-row" style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="qty-selector">
                    <button className="qty-btn" type="button" onClick={() => setDetailQty(prev => Math.max(1, prev - 1))} disabled={!detailVariant || detailVariant.stock === 0}>
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{detailQty}</span>
                    <button className="qty-btn" type="button" onClick={() => setDetailQty(prev => Math.min(detailVariant?.stock || 1, prev + 1))} disabled={!detailVariant || detailQty >= (detailVariant?.stock || 0)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: '120px' }}
                    onClick={() => {
                      addToCart(selectedProduct, detailVariant, detailQty);
                      setCartOpen(true);
                    }}
                    disabled={!detailVariant || detailVariant.stock === 0}
                  >
                    Add to Cart
                  </button>

                  <button 
                    className="btn btn-primary buy-now-btn"
                    style={{ 
                      flex: 1, 
                      minWidth: '120px', 
                      backgroundColor: '#f97316', 
                      borderColor: '#f97316',
                      color: '#ffffff',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => {
                      addToCart(selectedProduct, detailVariant, detailQty);
                      setCheckoutOpen(true);
                    }}
                    disabled={!detailVariant || detailVariant.stock === 0}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            {/* BELOW: ACCORDIONS SPECS */}
            <div className="detail-info-tabs" style={{ paddingBottom: '0.5rem' }}>
              <div className="tabs-strip">
                <button className={`tab-btn ${detailActiveTab === 'desc' ? 'active' : ''}`} onClick={() => setDetailActiveTab('desc')}>Description</button>
                <button className={`tab-btn ${detailActiveTab === 'specs' ? 'active' : ''}`} onClick={() => setDetailActiveTab('specs')}>Specifications</button>
              </div>

              {detailActiveTab === 'desc' && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <p>{selectedProduct.description}</p>
                  <p style={{ marginTop: '0.5rem' }}>
                    All products sold on Magnet are verified and sourced directly from authentic retail distributions. Buy with confidence.
                  </p>
                </div>
              )}

              {detailActiveTab === 'specs' && (
                <div>
                  <table className="specs-table">
                    <tbody>
                      {selectedProduct.specifications?.map((s, idx) => (
                        <tr key={idx}>
                          <td>{s.key}</td>
                          <td>{s.value}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No specifications provided.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Related Products Showcase */}
          <div style={{ marginTop: '3.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem' }}>
            <h3 className="related-products-header">Related Products</h3>
            {products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No related products found in this category.</p>
            ) : (
              <div className="product-grid">
                {products
                  .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
                  .slice(0, 5) // Display up to 5 items like Amazon/Flipkart
                  .map(product => {
                    const isDiscounted = !!product.discountPrice;
                    const discountPct = isDiscounted ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
                    const inWishlist = wishlist.some(w => w.id === product.id);

                    return (
                      <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                        <div className="card-image-box">
                          <img src={product.image} alt={product.name} className="card-image-main" />
                          <button 
                            className={`card-wishlist-btn ${inWishlist ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                          >
                            <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                          </button>
                          {isDiscounted && <span className="badge-tag discount">-{discountPct}%</span>}
                        </div>
                        <div className="card-info-box">
                          <span className="card-brand-label">{product.brand || 'Magnet'}</span>
                          <h3 className="card-title-label">{product.name}</h3>
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                            <span className="rating-badge">{product.rating} ★</span>
                            <span className="reviews-count">({product.reviewsCount})</span>
                          </div>
                          <div className="card-price-container">
                            <span className="price">₹{product.discountPrice || product.price}</span>
                            {isDiscounted && <span className="original-price">₹{product.price}</span>}
                          </div>
                          <button className="card-cta-btn" onClick={(e) => { e.stopPropagation(); handleQuickAdd(product, e); }}>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      ) : activeView === 'wishlist' ? (
        /* Wishlist View */
        <div className="container" style={{ padding: '2rem 0' }}>
          <h2>My Wishlist ({wishlist.length})</h2>
          
          {wishlist.length === 0 ? (
            <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
              <Heart size={48} strokeWidth={1.5} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3>Your wishlist is empty</h3>
              <p style={{ margin: '0.5rem 0 1rem' }}>Discover trending streetwear and mobile accessory items.</p>
              <button className="btn btn-primary" onClick={() => setActiveView('home')}>Shop Now</button>
            </div>
          ) : (
            <div className="product-grid" style={{ marginTop: '1.5rem' }}>
              {wishlist.map(product => {
                const isDiscounted = !!product.discountPrice;
                const hasStock = product.variants.some(v => v.stock > 0);
                const discountPct = isDiscounted ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

                return (
                  <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                    <div className="card-image-box">
                      <img src={product.image} alt={product.name} className="card-image-main" />
                      <button 
                        className="card-wishlist-btn active"
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                      >
                        <Heart size={16} fill="currentColor" />
                      </button>
                      {isDiscounted && <span className="badge-tag discount">-{discountPct}%</span>}
                    </div>

                    <div className="card-info-box">
                      <span className="card-brand-label">{product.brand || 'Magnet'}</span>
                      <h4 className="card-title-label">{product.name}</h4>
                      <div className="card-price-container">
                        <span className="price">₹{product.discountPrice || product.price}</span>
                        {isDiscounted && <span className="original-price">₹{product.price}</span>}
                      </div>
                      
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="card-cta-btn" 
                          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const first = product.variants.find(v => v.stock > 0);
                            if (first) {
                              addToCart(product, first, 1);
                              toggleWishlist(product);
                              setCartOpen(true);
                            } else {
                              alert('Product out of stock.');
                            }
                          }}
                          disabled={!hasStock}
                        >
                          Move to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeView === 'shop' ? (
        /* Marketplace Catalog page */
        <div className="container" style={{ padding: '2rem 0' }}>
          <div className="admin-header" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2>{activeCategory === 'all' ? 'All Curated Store' : categories.find(c => c.id === activeCategory)?.name}</h2>
              <span className="reviews-count" style={{ fontSize: '0.85rem' }}>{sortedProducts.length} items available</span>
            </div>
            
            <div className="filter-selects">
              <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Sort: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Sort: New Arrivals</option>
                <option value="rating">Sort: Customer Rating</option>
                <option value="discount">Sort: Deepest Discount</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {sortedProducts.map(product => {
              const isDiscounted = !!product.discountPrice;
              const hasStock = product.variants.some(v => v.stock > 0);
              const discountPct = isDiscounted ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
              const inWishlist = wishlist.some(w => w.id === product.id);

              return (
                <div key={product.id} className="product-card" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                  <div className="card-image-box">
                    <img src={product.image} alt={product.name} className="card-image-main" />
                    
                    <button 
                      className={`card-wishlist-btn ${inWishlist ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    >
                      <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                    
                    {product.newArrival && <span className="badge-tag">New</span>}
                    {isDiscounted && <span className="badge-tag discount">-{discountPct}%</span>}
                  </div>

                  <div className="card-info-box">
                    <span className="card-brand-label">{product.brand || 'Magnet'}</span>
                    <h3 className="card-title-label">{product.name}</h3>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className="rating-badge">{product.rating} ★</span>
                      <span className="reviews-count">({product.reviewsCount})</span>
                    </div>

                    <div className="card-price-container">
                      <span className="price">₹{product.discountPrice || product.price}</span>
                      {isDiscounted && <span className="original-price">₹{product.price}</span>}
                      {isDiscounted && <span className="discount-percentage">{discountPct}% OFF</span>}
                    </div>

                    <div className="card-shipping-tag">Free Delivery eligible</div>

                    <button 
                      className="card-cta-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(product, e);
                      }}
                      disabled={!hasStock}
                    >
                      {hasStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* commerce-first structure homepage */
        <>
          {/* Hero slider */}
          <section className="hero-slider-section" style={{ position: 'relative' }}>
            <div className="container">
              {activeBanners.length > 0 && (() => {
                const b = activeBanners[activeBannerIndex] || activeBanners[0];
                return (
                  <div key={b.id} className="hero-slider-card" style={{ position: 'relative' }}>
                    <div className="hero-slide-grid">
                      <div className="hero-slide-content">
                        <span className="hero-tag">Best Offers</span>
                        <h2 className="hero-slide-heading">{b.heading}</h2>
                        <p className="hero-slide-subtitle">{b.subtitle}</p>
                        <div className="hero-actions">
                          <button className="btn btn-primary" onClick={() => { setActiveView('shop'); setActiveCategory('all'); }}>
                            Shop Now <ArrowRight size={16} />
                          </button>
                          <button className="btn btn-secondary" onClick={() => { setActiveView('shop'); setSortBy('discount'); }}>
                            View Deals
                          </button>
                        </div>
                      </div>
                      <div className="hero-slide-image-wrapper">
                        <img src={b.image} alt={b.heading} className="hero-slide-img" />
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {activeBanners.length > 1 && (
                      <>
                        <button 
                          className="banner-nav-arrow left" 
                          onClick={(e) => { e.stopPropagation(); setActiveBannerIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length); }}
                          style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.4)',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10
                          }}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          className="banner-nav-arrow right" 
                          onClick={(e) => { e.stopPropagation(); setActiveBannerIndex(prev => (prev + 1) % activeBanners.length); }}
                          style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0,0,0,0.4)',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10
                          }}
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Bottom Slide Dots */}
                        <div style={{
                          position: 'absolute',
                          bottom: '1rem',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          gap: '0.5rem',
                          zIndex: 10
                        }}>
                          {activeBanners.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); setActiveBannerIndex(idx); }}
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                border: 'none',
                                background: idx === activeBannerIndex ? '#ef4444' : 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          </section>

          {/* SHOP BY CATEGORY CIRCLES STRIP */}
          <section style={{ padding: '1rem 0' }}>
            <div className="container">
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.02em', textAlign: 'center' }}>Shop by Category</h3>
              <div className="category-circle-grid">
                {categories.filter(c => c.active).map(cat => {
                  const count = products.filter(p => p.category === cat.id && p.active).length;
                  return (
                    <div 
                      key={cat.id} 
                      className="category-circle-card" 
                      onClick={() => { setActiveView('shop'); setActiveCategory(cat.id); }} 
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="category-circle-img-wrapper">
                        <img src={cat.image || '/images/clothing.jpg'} alt={cat.name} className="category-circle-img" />
                      </div>
                      <span className="category-circle-name">{cat.name}</span>
                      <span className="category-circle-count">{count} products</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* DEALS OF THE DAY / TRENDING SECTION */}
          <section style={{ padding: '2rem 0' }}>
            <div className="container">
              <div className="deals-container">
                {/* Deal of the Day main card */}
                <div className="deal-banner" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <span className="deal-badge"><Percent size={12} /> Deal of the Day</span>
                    <h2 style={{ fontSize: '2rem', lineHeight: '1.2' }}>GaN Fast Charger Adapter</h2>
                    <p style={{ opacity: 0.9 }}>Ultra-efficient 65W GaN fast wall charger at a historic low price. Limited quantity available!</p>
                    
                    <div style={{ display: 'flex', gap: '2rem', margin: '0.5rem 0' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Deal Price</span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹1699 <span style={{ textDecoration: 'line-through', fontSize: '1.1rem', opacity: 0.7 }}>₹2199</span></h3>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Stocks Left</span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Only 8 items</h3>
                      </div>
                    </div>

                    <button className="btn btn-primary" style={{ background: '#ffffff', color: '#10141f', width: 'fit-content', padding: '0.85rem 2.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(255,255,255,0.2)' }} onClick={() => {
                      const prod = products.find(p => p.id === 'prod-7');
                      if (prod) handleProductClick(prod);
                    }}>
                      Grab Deal
                    </button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }} className="deal-image-wrapper">
                    <img 
                      src="/images/accessories.jpg" 
                      alt="GaN Fast Charger Adapter" 
                      style={{ width: '100%', maxWidth: '280px', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                    />
                  </div>
                </div>

                {/* Right Quick Deal Product */}
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
                  <span className="deal-badge" style={{ backgroundColor: 'var(--color-discount)' }}>Featured</span>
                  <img src="/images/featured-hoodie.jpg" alt="Magnet Signature Hoodie" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <h4 style={{ fontSize: '1rem', lineHeight: 1.3 }}>Magnet Signature Hoodie</h4>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-primary)' }}>₹1499</span>
                    <span style={{ textDecoration: 'line-through', fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>₹1899</span>
                    <span style={{ color: 'var(--color-discount)', fontSize: '0.85rem', fontWeight: 700, backgroundColor: 'var(--color-primary-light)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>21% OFF</span>
                  </div>
                  <button className="card-cta-btn" style={{ margin: 0 }} onClick={(e) => {
                    e.stopPropagation();
                    const prod = products.find(p => p.id === 'prod-1');
                    if (prod) handleQuickAdd(prod, e);
                  }}>Add to Cart</button>
                </div>
              </div>
            </div>
          </section>

          {/* TRENDING / GRID SHOWCASE */}
          <section className="catalog-section" style={{ padding: '1.5rem 0' }}>
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Trending Now</h2>
                  <p className="section-subtitle">Most popular items in Vapi this week</p>
                </div>
                <button className="nav-link" onClick={() => { setActiveView('shop'); setActiveCategory('all'); }}>View All &rarr;</button>
              </div>

              <div className="product-grid">
                {products.filter(p => p.trending).slice(0, 4).map(product => {
                  const isDiscounted = !!product.discountPrice;
                  const discountPct = isDiscounted ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
                  const inWishlist = wishlist.some(w => w.id === product.id);

                  return (
                    <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                      <div className="card-image-box">
                        <img src={product.image} alt={product.name} className="card-image-main" />
                        <button 
                          className={`card-wishlist-btn ${inWishlist ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        >
                          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                        </button>
                        {isDiscounted && <span className="badge-tag discount">-{discountPct}%</span>}
                      </div>
                      <div className="card-info-box">
                        <span className="card-brand-label">{product.brand || 'Magnet'}</span>
                        <h3 className="card-title-label">{product.name}</h3>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span className="rating-badge">{product.rating} ★</span>
                          <span className="reviews-count">({product.reviewsCount})</span>
                        </div>
                        <div className="card-price-container">
                          <span className="price">₹{product.discountPrice || product.price}</span>
                          {isDiscounted && <span className="original-price">₹{product.price}</span>}
                        </div>
                        <button className="card-cta-btn" onClick={(e) => { e.stopPropagation(); handleQuickAdd(product, e); }}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CLOTHING COLLECTION */}
          <section className="catalog-section" style={{ padding: '1.5rem 0' }}>
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Clothing & Streetwear</h2>
                  <p className="section-subtitle">240 GSM drop shoulder tees, cargo pants, and hoodies</p>
                </div>
                <button className="nav-link" onClick={() => { setActiveView('shop'); setActiveCategory('clothing'); }}>View All &rarr;</button>
              </div>

              <div className="product-grid">
                {products.filter(p => p.category === 'clothing').slice(0, 4).map(product => {
                  const isDiscounted = !!product.discountPrice;
                  const discountPct = isDiscounted ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
                  const inWishlist = wishlist.some(w => w.id === product.id);

                  return (
                    <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                      <div className="card-image-box">
                        <img src={product.image} alt={product.name} className="card-image-main" />
                        <button 
                          className={`card-wishlist-btn ${inWishlist ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        >
                          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <div className="card-info-box">
                        <span className="card-brand-label">{product.brand || 'Magnet'}</span>
                        <h3 className="card-title-label">{product.name}</h3>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span className="rating-badge">{product.rating} ★</span>
                          <span className="reviews-count">({product.reviewsCount})</span>
                        </div>
                        <div className="card-price-container">
                          <span className="price">₹{product.discountPrice || product.price}</span>
                          {isDiscounted && <span className="original-price">₹{product.price}</span>}
                        </div>
                        <button className="card-cta-btn" onClick={(e) => { e.stopPropagation(); handleQuickAdd(product, e); }}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ACCESSORIES COLLECTION */}
          <section className="catalog-section" style={{ padding: '1.5rem 0' }}>
            <div className="container">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Premium Accessories & Tech</h2>
                  <p className="section-subtitle">Impact iPhone cases, GaN fast wall adapters, and sleek tech organizers</p>
                </div>
                <button className="nav-link" onClick={() => { setActiveView('shop'); setActiveCategory('accessories'); }}>View All &rarr;</button>
              </div>

              <div className="product-grid">
                {products.filter(p => p.category === 'accessories').slice(0, 4).map(product => {
                  const isDiscounted = !!product.discountPrice;
                  const discountPct = isDiscounted ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
                  const inWishlist = wishlist.some(w => w.id === product.id);

                  return (
                    <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                      <div className="card-image-box">
                        <img src={product.image} alt={product.name} className="card-image-main" />
                        <button 
                          className={`card-wishlist-btn ${inWishlist ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                        >
                          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                        </button>
                        {isDiscounted && <span className="badge-tag discount">-{discountPct}%</span>}
                      </div>
                      <div className="card-info-box">
                        <span className="card-brand-label">{product.brand || 'Magnet'}</span>
                        <h3 className="card-title-label">{product.name}</h3>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span className="rating-badge">{product.rating} ★</span>
                          <span className="reviews-count">({product.reviewsCount})</span>
                        </div>
                        <div className="card-price-container">
                          <span className="price">₹{product.discountPrice || product.price}</span>
                          {isDiscounted && <span className="original-price">₹{product.price}</span>}
                        </div>
                        <button className="card-cta-btn" onClick={(e) => { e.stopPropagation(); handleQuickAdd(product, e); }}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* LOOKBOOK / LIFESTYLE PROMO */}
          <section style={{ padding: '3.5rem 0', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderRadius: 'var(--radius-lg)', margin: '2rem 1.25rem', overflow: 'hidden' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.04em' }}>New Season Lookbook</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.15, fontFamily: 'var(--font-display)', margin: 0 }}>Elevate Your Everyday Vibe</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Our latest drops blend heavy-duty tech security with raw streetwear aesthetics. Made for those who navigate the urban landscape of Vapi and beyond with style and confidence.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-primary" style={{ backgroundColor: '#ffffff', color: '#0f172a', borderColor: '#ffffff' }} onClick={() => { setActiveView('shop'); setActiveCategory('clothing'); }}>Explore Clothing</button>
                  <button className="btn btn-secondary" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }} onClick={() => { setActiveView('shop'); setActiveCategory('accessories'); }}>Explore Accessories</button>
                </div>
              </div>
              <div style={{ flex: '1 1 300px', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', transform: 'translateY(-1rem)' }}>
                  <img src="/images/clothing.jpg" style={{ width: '140px', height: '190px', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }} />
                  <img src="/images/clothing.jpg" style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', filter: 'hue-rotate(90deg)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', transform: 'translateY(1rem)' }}>
                  <img src="/images/clothing.jpg" style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', filter: 'hue-rotate(180deg)' }} />
                  <img src="/images/clothing.jpg" style={{ width: '140px', height: '190px', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', filter: 'hue-rotate(270deg)' }} />
                </div>
              </div>
            </div>
          </section>

          {/* TRUST VALUES STRIP */}
          <section style={{ padding: '3rem 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', margin: '2rem 0' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--color-primary)', padding: '0.75rem', background: 'var(--color-primary-light)', borderRadius: '50%' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>Secure COD Purchases</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pay cash only when products are safely inspected at door.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--color-primary)', padding: '0.75rem', background: 'var(--color-primary-light)', borderRadius: '50%' }}>
                    <RefreshCw size={28} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>7-Day Replacements</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hassle-free replacement for sizing problems or product issues.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--color-primary)', padding: '0.75rem', background: 'var(--color-primary-light)', borderRadius: '50%' }}>
                    <Truck size={28} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>Fast Regional Shipping</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Express delivery to Vapi, Surat, and Mumbai regions in 24-48 hours.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ color: 'var(--color-primary)', padding: '0.75rem', background: 'var(--color-primary-light)', borderRadius: '50%' }}>
                    <Phone size={28} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>Direct WhatsApp Help</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Talk to the retail store staff directly for any customized query.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="footer-souled-style" style={{ borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', padding: '3rem 0 2rem', color: 'var(--text-primary)' }}>
            <div className="container">
              
              {/* Four Main Link Columns */}
              <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
                
                {/* Column 1: NEED HELP */}
                <div className="footer-col-souled">
                  <h4 style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Need Help</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('contact'); setSelectedProduct(null); }}>Contact Us</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('account'); setAccountSubTab('orders'); setSelectedProduct(null); }}>Track Order</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('returns'); setSelectedProduct(null); }}>Returns & Refunds</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('faq'); setSelectedProduct(null); }}>FAQs</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('account'); setSelectedProduct(null); }}>My Account</a></li>
                  </ul>
                  
                  {/* Info Labels */}
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 700 }}>₹</div>
                      <span>COD Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>🔄</div>
                      <span>30 Days Easy Returns & Exchanges</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: COMPANY */}
                <div className="footer-col-souled">
                  <h4 style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Company</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('about'); setSelectedProduct(null); }}>About Us</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('investors'); setSelectedProduct(null); }}>Investor Relation</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('careers'); setSelectedProduct(null); }}>Careers</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('vouchers'); setSelectedProduct(null); }}>Gift Vouchers</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('community'); setSelectedProduct(null); }}>Community Initiatives</a></li>
                  </ul>
                </div>

                {/* Column 3: MORE INFO */}
                <div className="footer-col-souled">
                  <h4 style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>More Info</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('terms'); setSelectedProduct(null); }}>T&C</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('privacy'); setSelectedProduct(null); }}>Privacy Policy</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('sitemap'); setSelectedProduct(null); }}>Sitemap</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('notified'); setSelectedProduct(null); }}>Get Notified</a></li>
                    <li><a href="#" className="footer-souled-link" onClick={(e) => { e.preventDefault(); setActiveView('info'); setInfoPageKey('blogs'); setSelectedProduct(null); }}>Blogs</a></li>
                  </ul>
                </div>

                {/* Column 4: STORE NEAR ME */}
                <div className="footer-col-souled">
                  <h4 style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Store Near Me</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    <li><a href="#" className="footer-souled-link">Mumbai</a></li>
                    <li><a href="#" className="footer-souled-link">Pune</a></li>
                    <li><a href="#" className="footer-souled-link">Bangalore</a></li>
                    <li><a href="#" className="footer-souled-link">Gandhinagar</a></li>
                    <li>
                      <a href="#" className="footer-souled-link" style={{ color: '#0055ff', fontWeight: 800 }}>View More</a>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Responsive App Download & Follow Us Subrow */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', padding: '1.5rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                {/* App Download Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                    📱 EXPERIENCE THE MAGNET APP
                  </span>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {/* Google Play Button */}
                    <a href="#" className="app-badge-btn" onClick={(e) => { e.preventDefault(); alert('Magnet Mobile App is coming soon!'); }}>
                      <svg viewBox="0 0 24 24" className="app-badge-icon" fill="currentColor">
                        <path d="M17.5 18H6.5c-1.38 0-2.5-1.12-2.5-2.5V8.5C4 7.12 5.12 6 6.5 6h11c1.38 0 2.5 1.12 2.5 2.5v7c0 1.38-1.12 2.5-2.5 2.5zM6.5 7C5.67 7 5 7.67 5 8.5v7c0 .83.67 1.5 1.5 1.5h11c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5h-11z" opacity="0.3"/>
                        <path d="M12.5 12l-6-4.5v9l6-4.5z" fill="#00e676"/>
                        <path d="M18.5 12l-6-4.5v9l6-4.5z" fill="#00b0ff"/>
                      </svg>
                      <div className="app-badge-text">
                        <span className="app-badge-subtitle">GET IT ON</span>
                        <span className="app-badge-title">Google Play</span>
                      </div>
                    </a>

                    {/* App Store Button */}
                    <a href="#" className="app-badge-btn" onClick={(e) => { e.preventDefault(); alert('Magnet Mobile App is coming soon!'); }}>
                      <svg viewBox="0 0 24 24" className="app-badge-icon" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-.1 3.81.47 1.25.5 2.23 1.48 2.76 2.65-2.58 1.55-2.17 4.9.46 5.96-.8 2.01-1.63 3.99-3.43 3.67zM15.97 4.17c.84-1.02 1.41-2.4 1.25-3.77-1.17.05-2.59.78-3.43 1.77-.76.88-1.42 2.28-1.24 3.63 1.3.1 2.62-.64 3.42-1.63z" />
                      </svg>
                      <div className="app-badge-text">
                        <span className="app-badge-subtitle">Download on the</span>
                        <span className="app-badge-title">App Store</span>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Follow Us Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Follow Us:</span>
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <a href="#" className="social-circle-btn facebook" style={{ backgroundColor: '#3b5998' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/magnet_vapi_officialll/" target="_blank" rel="noopener noreferrer" className="social-circle-btn instagram" style={{ backgroundColor: '#c13584' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a href="#" className="social-circle-btn snapchat" style={{ backgroundColor: '#fffc00' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                        <path d="M12 2a9 9 0 0 0-9 9c0 1.5.5 2.5 1 3.5.5.8.5 1.5 0 2.2a2 2 0 0 1-1 1c-1 .2-1.5.7-1 1.8.3.8 1 1.5 2.5 1.5.8 0 1.5.5 2.2 1a8.38 8.38 0 0 0 3.8.9c3 0 5-1.5 5.5-3 .5-.8 1-1 1.8-1 1.5 0 2.2-.7 2.5-1.5.5-1.1 0-1.6-1-1.8a2 2 0 0 1-1-1c-.5-.7-.5-1.4 0-2.2.5-1 1-2 1-3.5a9 9 0 0 0-9-9z"></path>
                      </svg>
                    </a>
                    <a href="#" className="social-circle-btn twitter" style={{ backgroundColor: '#000000' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Who We Are Accordion Block */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', width: 'fit-content', minWidth: '280px' }}>
                <button 
                  onClick={() => setWhoWeAreOpen(!whoWeAreOpen)}
                  style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: '2.5rem',
                    padding: '1rem 1.5rem', 
                    backgroundColor: 'var(--bg-input)', 
                    color: '#ef4444', 
                    fontSize: '0.9rem', 
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    textAlign: 'left'
                  }}
                >
                  <span>Who we are</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 400 }}>{whoWeAreOpen ? '−' : '+'}</span>
                </button>
                
                {whoWeAreOpen && (
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong>Magnet Vapi Official</strong> is the ultimate destination for street culture, oversized clothing, and mobile accessories. Born out of a passion for local fashion and phone customization, we offer high-spec protective phone covers, GaN fast wall adapters, Bluetooth headphones, and heavy-duty 240 GSM drop shoulder streetwear graphic tees. Visit our retail hub in Vapi, Gujarat, or shop online with secure COD regional delivery. All products sold on Magnet are verified and inspected for maximum quality.
                  </div>
                )}
              </div>

            </div>
          </footer>
        </>
      )}

      {/* MOBILE PERSISTENT BOTTOM NAVIGATION BAR */}
      <div className="mobile-bottom-nav">
        <a href="#" className={`mobile-nav-link ${activeView === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('home'); setActiveCategory('all'); setSelectedProduct(null); }}>
          <User size={18} style={{ display: 'none' }} /> {/* dummy */}
          <History size={18} style={{ display: 'none' }} />
          <Star size={18} style={{ display: 'none' }} />
          <Home size={18} />
          <span>Home</span>
        </a>
        <a href="#" className={`mobile-nav-link ${activeView === 'shop' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('shop'); setActiveCategory('all'); setSelectedProduct(null); }}>
          <FolderKanban size={18} style={{ display: 'none' }} />
          <Package size={18} />
          <span>Shop</span>
        </a>
        <a href="#" className={`mobile-nav-link ${activeView === 'wishlist' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('wishlist'); setSelectedProduct(null); }}>
          <Heart size={18} />
          <span>Wishlist</span>
        </a>
        <a href="#" className="mobile-nav-link" style={{ position: 'relative' }} onClick={(e) => { e.preventDefault(); setCartOpen(true); }}>
          <ShoppingBag size={18} />
          {cart.length > 0 && <span className="badge" style={{ position: 'absolute', top: '-4px', right: '12px' }}>{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>}
          <span>Cart</span>
        </a>
        <a href="#" className={`mobile-nav-link ${activeView === 'account' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveView('account'); setAccountSubTab('profile'); setSelectedProduct(null); }}>
          <User size={18} />
          <span>Account</span>
        </a>
      </div>



      {/* CART DRAWER PANEL */}
      {cartOpen && (
        <div className="drawer-overlay" onClick={() => setCartOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</h3>
              <button className="drawer-close" onClick={() => setCartOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="drawer-body">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={48} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                  <p>Your cart is empty.</p>
                  <button className="btn btn-primary" onClick={() => { setCartOpen(false); setActiveView('shop'); }}>
                    Browse Products
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <div>
                        <span className="card-brand-label">{item.brand || 'Magnet'}</span>
                        <h4 className="cart-item-name" style={{ fontSize: '0.9rem' }}>{item.name}</h4>
                        <span className="cart-item-variant">
                          {Object.entries(item.variant)
                            .filter(([k]) => k !== 'id' && k !== 'stock')
                            .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
                            .join(', ')}
                        </span>
                      </div>
                      <div className="cart-item-price-row" style={{ marginTop: '0.5rem' }}>
                        <span className="price" style={{ fontSize: '1rem' }}>₹{item.price * item.quantity}</span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="cart-item-qty">
                            <button className="qty-btn" onClick={() => updateCartQty(item.cartId, item.quantity - 1)}>
                              <Minus size={12} />
                            </button>
                            <span className="qty-value">{item.quantity}</span>
                            <button className="qty-btn" onClick={() => updateCartQty(item.cartId, item.quantity + 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                          
                          <button className="btn-icon danger" style={{ width: '2rem', height: '2rem' }} onClick={() => removeFromCart(item.cartId)}>
                            <X size={14} style={{ color: 'var(--color-primary)' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="subtotal-row" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  <span>Shipping & Handling</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                </div>
                <div className="subtotal-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span>Order Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{cartTotal}</span>
                </div>
                
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => setCheckoutOpen(true)}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL WINDOW */}
      {checkoutOpen && (
        <div className="modal-overlay" onClick={() => setCheckoutOpen(false)}>
          <div className="modal-content checkout-modal" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setCheckoutOpen(false)}>
              <X size={20} />
            </button>
            
            <div style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>Secure Checkout (COD)</h2>
              
              {/* Predefined Address Selection */}
              {userProfile.addresses.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Select Delivery Address</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {userProfile.addresses.map(a => (
                      <label 
                        key={a.id} 
                        className="glass-card" 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '0.75rem', 
                          padding: '0.85rem', 
                          cursor: 'pointer',
                          borderColor: selectedAddressId === a.id ? 'var(--color-primary)' : 'var(--border-color)',
                          backgroundColor: selectedAddressId === a.id ? 'var(--color-primary-light)' : 'transparent'
                        }}
                      >
                        <input 
                          type="radio" 
                          name="selected_address" 
                          checked={selectedAddressId === a.id} 
                          onChange={() => handleAddressSelect(a.id)}
                          style={{ marginTop: '3px' }}
                        />
                        <span style={{ fontSize: '0.85rem' }}>
                          <strong>{a.name} ({a.type})</strong> — {a.address}, {a.city}, {a.pincode}. Phone: {a.phone}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handlePlaceOrderSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Receiver Name *</label>
                    <input 
                      type="text" required name="name" className="form-input"
                      value={checkoutForm.name} onChange={handleCheckoutChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp Contact *</label>
                    <input 
                      type="tel" required name="phone" className="form-input"
                      value={checkoutForm.phone} onChange={handleCheckoutChange}
                    />
                  </div>

                  <div className="form-group full">
                    <label className="form-label">Shipping Address Details *</label>
                    <input 
                      type="text" required name="address" className="form-input"
                      value={checkoutForm.address} onChange={handleCheckoutChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input 
                      type="text" required name="city" className="form-input"
                      value={checkoutForm.city} onChange={handleCheckoutChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input 
                      type="text" required name="pincode" className="form-input"
                      value={checkoutForm.pincode} onChange={handleCheckoutChange}
                    />
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1rem', margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Subtotal:</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Shipping:</span>
                    <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.4rem', marginTop: '0.4rem' }}>
                    <span>Amount to Pay (COD):</span>
                    <span>₹{cartTotal}</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                  Place Cash on Delivery Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
