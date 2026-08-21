import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

export const StoreContext = createContext();

const INITIAL_CATEGORIES = [
  { id: 'clothing', name: 'Clothing', active: true, slug: 'clothing', image: '/images/clothing.jpg', productCount: 5, sortOrder: 1 },
  { id: 'accessories', name: 'Mobile Accessories', active: true, slug: 'accessories', image: '/images/accessories.jpg', productCount: 5, sortOrder: 2 }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Magnet Signature Hoodie',
    brand: 'Magnet Wear',
    slug: 'magnet-signature-hoodie',
    sku: 'CL-HD-001',
    category: 'clothing',
    description: 'A premium-weight, ultra-soft cotton blend hoodie designed for the perfect streetwear drape. Features double-lined hood, kangaroo pocket, and minimal embroidered branding.',
    price: 1899,
    discountPrice: 1499,
    image: '/images/clothing.jpg',
    active: true,
    featured: true,
    trending: true,
    bestseller: true,
    newArrival: true,
    dealOfTheDay: true,
    dealStockRemaining: 5,
    rating: 4.8,
    reviewsCount: 142,
    variants: [
      { id: 'v1', size: 'S', color: 'Black', stock: 5 },
      { id: 'v2', size: 'M', color: 'Black', stock: 8 },
      { id: 'v3', size: 'L', color: 'Black', stock: 10 },
      { id: 'v4', size: 'XL', color: 'Black', stock: 3 },
      { id: 'v5', size: 'M', color: 'Grey', stock: 4 },
      { id: 'v6', size: 'L', color: 'Grey', stock: 6 }
    ],
    specifications: [
      { key: 'Material', value: '80% Combed Cotton, 20% Polyester' },
      { key: 'Weight', value: '400 GSM Heavyweight Fabric' },
      { key: 'Fit', value: 'Oversized Boxy Silhouette' },
      { key: 'Care', value: 'Machine wash cold, lay flat to dry' }
    ],
    seoTitle: 'Magnet Signature Hoodie - Premium Streetwear',
    seoDescription: 'Shop the official Magnet Signature Hoodie. Premium heavyweight cotton, minimalist styling, designed for comfort.'
  },
  {
    id: 'prod-2',
    name: 'Urban Framework Graphic Tee',
    brand: 'Magnet Wear',
    slug: 'urban-framework-graphic-tee',
    sku: 'CL-TS-002',
    category: 'clothing',
    description: 'Made from 240 GSM heavy combed cotton, this boxy-fit tee features a high-density back print with abstract architectural blueprints. Ribbed crew neck collar and drop shoulder details.',
    price: 999,
    discountPrice: 799,
    image: '/images/clothing.jpg',
    active: true,
    featured: true,
    trending: false,
    bestseller: true,
    newArrival: true,
    rating: 4.6,
    reviewsCount: 88,
    variants: [
      { id: 'v7', size: 'M', color: 'White', stock: 12 },
      { id: 'v8', size: 'L', color: 'White', stock: 15 },
      { id: 'v9', size: 'XL', color: 'White', stock: 8 },
      { id: 'v10', size: 'M', color: 'Black', stock: 10 },
      { id: 'v11', size: 'L', color: 'Black', stock: 12 }
    ],
    specifications: [
      { key: 'Material', value: '100% Combed Cotton' },
      { key: 'Weight', value: '240 GSM Fabric' },
      { key: 'Fit', value: 'Relaxed Drop Shoulder' },
      { key: 'Care', value: 'Machine wash inside out, iron on reverse' }
    ],
    seoTitle: 'Urban Framework Graphic Tee - Heavyweight Cotton',
    seoDescription: 'Heavyweight graphic tee with high-density architectural back print. Premium boxy streetwear fit.'
  },
  {
    id: 'prod-3',
    name: 'Slim Fit Cargo Jeans',
    brand: 'Magnet Denim',
    slug: 'slim-fit-cargo-jeans',
    sku: 'CL-JN-003',
    category: 'clothing',
    description: 'Crafted from premium stretch denim with a mid-wash finish. Equipped with multiple utility cargo pockets, heavy-duty zipper fly, and elasticated hem adjusters for versatile styling.',
    price: 2499,
    discountPrice: 1999,
    image: '/images/clothing.jpg',
    active: true,
    featured: false,
    trending: true,
    bestseller: false,
    newArrival: false,
    rating: 4.4,
    reviewsCount: 56,
    variants: [
      { id: 'v12', size: '30', color: 'Blue', stock: 4 },
      { id: 'v13', size: '32', color: 'Blue', stock: 6 },
      { id: 'v14', size: '34', color: 'Blue', stock: 5 },
      { id: 'v15', size: '32', color: 'Black', stock: 4 }
    ],
    specifications: [
      { key: 'Material', value: '98% Cotton, 2% Elastane' },
      { key: 'Denim Weight', value: '12.5 oz stretch denim' },
      { key: 'Fit', value: 'Slim fit tapered hem' },
      { key: 'Pockets', value: '6-pocket utility setup' }
    ],
    seoTitle: 'Slim Fit Cargo Jeans - Premium Stretch Denim',
    seoDescription: 'Multi-pocket cargo jeans crafted from premium wash denim. Durable utility styling.'
  },
  {
    id: 'prod-4',
    name: 'Vintage Oversized T-Shirt',
    brand: 'Magnet Vintage',
    slug: 'vintage-oversized-t-shirt',
    sku: 'CL-TS-004',
    category: 'clothing',
    description: 'Throwback retro aesthetics combined with modern construction. Features custom pigment wash for a worn-in feel, raw hem details, and comfortable relaxed neck opening.',
    price: 899,
    discountPrice: 699,
    image: '/images/clothing.jpg',
    active: true,
    featured: false,
    trending: false,
    bestseller: false,
    newArrival: true,
    rating: 4.7,
    reviewsCount: 114,
    variants: [
      { id: 'v16', size: 'S', color: 'Beige', stock: 6 },
      { id: 'v17', size: 'M', color: 'Beige', stock: 10 },
      { id: 'v18', size: 'L', color: 'Beige', stock: 12 },
      { id: 'v19', size: 'M', color: 'Olive', stock: 8 },
      { id: 'v20', size: 'L', color: 'Olive', stock: 8 }
    ],
    specifications: [
      { key: 'Material', value: '100% Cotton Pigment Wash' },
      { key: 'Weight', value: '220 GSM' },
      { key: 'Features', value: 'Distressed raw-edge details, soft pre-shrunk finish' }
    ],
    seoTitle: 'Vintage Oversized T-Shirt - Pigment Wash Tee',
    seoDescription: 'Worn-in pigment washed oversized t-shirt. Extremely soft finish with casual drop shoulders.'
  },
  {
    id: 'prod-5',
    name: 'Windbreaker Tech Jacket',
    brand: 'Magnet Technical',
    slug: 'windbreaker-tech-jacket',
    sku: 'CL-JK-005',
    category: 'clothing',
    description: 'Water-resistant and windproof, this light outerwear piece features adjustable hood, waterproof zippers, and reflective utility details. Ideal for layering.',
    price: 3499,
    discountPrice: 2799,
    image: '/images/clothing.jpg',
    active: true,
    featured: true,
    trending: true,
    bestseller: false,
    newArrival: false,
    rating: 4.5,
    reviewsCount: 32,
    variants: [
      { id: 'v21', size: 'M', color: 'Black', stock: 3 },
      { id: 'v22', size: 'L', color: 'Black', stock: 5 },
      { id: 'v23', size: 'XL', color: 'Black', stock: 2 }
    ],
    specifications: [
      { key: 'Material', value: '100% Water-repellent Ripstop Nylon' },
      { key: 'Zippers', value: 'YKK Aquaguard waterproof zippers' },
      { key: 'Safety', value: 'Reflective structural branding' }
    ],
    seoTitle: 'Windbreaker Tech Jacket - Weather Resistant Outerwear',
    seoDescription: 'Explore the water-resistant tech windbreaker. Technical details, premium hardware, lightweight protection.'
  },
  {
    id: 'prod-6',
    name: 'Magnet Matte Armor iPhone Case',
    brand: 'Magnet Armor',
    slug: 'magnet-matte-armor-iphone-case',
    sku: 'AC-CS-006',
    category: 'accessories',
    description: 'An impact-absorbing hybrid case combining a frosted semi-translucent back with reinforced tactile bumper edges. Fully supports MagSafe attachments and offers 10ft drop protection.',
    price: 799,
    discountPrice: 499,
    image: '/images/accessories.jpg',
    active: true,
    featured: true,
    trending: true,
    bestseller: true,
    newArrival: true,
    dealOfTheDay: true,
    dealStockRemaining: 8,
    rating: 4.9,
    reviewsCount: 231,
    variants: [
      { id: 'v24', compatibleModel: 'iPhone 13', color: 'Matte Black', stock: 10 },
      { id: 'v25', compatibleModel: 'iPhone 14', color: 'Matte Black', stock: 12 },
      { id: 'v26', compatibleModel: 'iPhone 15', color: 'Matte Black', stock: 15 },
      { id: 'v27', compatibleModel: 'iPhone 15 Pro', color: 'Matte Black', stock: 8 },
      { id: 'v28', compatibleModel: 'iPhone 15 Pro', color: 'Navy Blue', stock: 6 }
    ],
    specifications: [
      { key: 'Drop Safety', value: 'MIL-STD 810G military drop certified (10ft)' },
      { key: 'MagSafe', value: 'Embedded N52 neodymium magnetic ring' },
      { key: 'Thickness', value: '1.5mm thin layout, raised bezel protection' }
    ],
    seoTitle: 'Magnet Matte Armor iPhone Case - MagSafe Compatible',
    seoDescription: 'Buy Magnet Matte Armor iPhone Case with 10ft drop safety and MagSafe compatibility. Sleek frosted finish.'
  },
  {
    id: 'prod-7',
    name: 'GaN 65W Triple Port Wall Charger',
    brand: 'Magnet Power',
    slug: 'gan-65w-triple-port-wall-charger',
    sku: 'AC-CH-007',
    category: 'accessories',
    description: 'Powered by advanced Gallium Nitride (GaN) technology, this compact adapter delivers rapid charging speeds to laptops, tablets, and phones simultaneously. Features 2x USB-C and 1x USB-A ports.',
    price: 2199,
    discountPrice: 1699,
    image: '/images/accessories.jpg',
    active: true,
    featured: true,
    trending: true,
    bestseller: true,
    newArrival: false,
    rating: 4.8,
    reviewsCount: 168,
    variants: [
      { id: 'v29', specification: 'US Plug', color: 'Charcoal Grey', stock: 8 },
      { id: 'v30', specification: 'EU Plug', color: 'Charcoal Grey', stock: 6 },
      { id: 'v31', specification: 'US Plug', color: 'White', stock: 4 }
    ],
    specifications: [
      { key: 'Chipset', value: 'Navitas GaNFast Power IC' },
      { key: 'Output Power', value: '65W Max Power Delivery 3.0' },
      { key: 'Ports', value: '2x USB Type-C, 1x USB Type-A Quick Charge 3.0' }
    ],
    seoTitle: 'GaN 65W Triple Port Fast Charger - Compact Adapter',
    seoDescription: 'Compact GaN fast wall charger with triple output ports. Safely charge laptops and phones together.'
  },
  {
    id: 'prod-8',
    name: 'Braided Nylon USB-C Fast Cable',
    brand: 'Magnet Power',
    slug: 'braided-nylon-usb-c-fast-cable',
    sku: 'AC-CB-008',
    category: 'accessories',
    description: 'Reinforced with dual-braided ballistic nylon and alloy connectors. Supports Power Delivery up to 100W for ultra-fast laptop and smartphone recharge. Certified 30,000+ bend lifespan.',
    price: 599,
    discountPrice: 399,
    image: '/images/accessories.jpg',
    active: true,
    featured: false,
    trending: false,
    bestseller: false,
    newArrival: true,
    rating: 4.5,
    reviewsCount: 94,
    variants: [
      { id: 'v32', specification: '1.2m', color: 'Black', stock: 15 },
      { id: 'v33', specification: '2m', color: 'Black', stock: 20 },
      { id: 'v34', specification: '2m', color: 'Red', stock: 10 }
    ],
    specifications: [
      { key: 'Max Power', value: '100W Power Delivery (20V/5A)' },
      { key: 'Transfer Speed', value: 'USB 2.0 (480 Mbps)' },
      { key: 'Durability', value: 'Double-braided ballistic nylon, reinforced neck' }
    ],
    seoTitle: 'Braided Nylon USB-C to USB-C Cable - 100W PD',
    seoDescription: 'Ultra-durable 100W braided USB-C cable. Heavy-duty charging for all compatible devices.'
  },
  {
    id: 'prod-9',
    name: 'Premium Wireless ANC Earbuds',
    brand: 'Magnet Audio',
    slug: 'premium-wireless-anc-earbuds',
    sku: 'AC-EB-009',
    category: 'accessories',
    description: 'Immersive sound with hybrid Active Noise Cancellation. Custom 10mm dynamic drivers deliver rich bass and crystal clear trebles. Features 30-hour total battery life with wireless charging case.',
    price: 4999,
    discountPrice: 3999,
    image: '/images/accessories.jpg',
    active: true,
    featured: true,
    trending: false,
    bestseller: false,
    newArrival: false,
    rating: 4.6,
    reviewsCount: 77,
    variants: [
      { id: 'v35', color: 'Slate', stock: 5 },
      { id: 'v36', color: 'White', stock: 5 }
    ],
    specifications: [
      { key: 'Drivers', value: '10mm Custom Dynamic Drivers' },
      { key: 'ANC Depth', value: 'Hybrid ANC up to 40dB noise suppression' },
      { key: 'Battery', value: '7h (buds) + 23h (case), wireless charging compatible' }
    ],
    seoTitle: 'Premium Wireless Active Noise Cancelling Earbuds',
    seoDescription: 'Experience immersive audio with hybrid active noise cancellation, custom audio profile, and long battery life.'
  },
  {
    id: 'prod-10',
    name: 'MagSafe Leather Card Wallet',
    brand: 'Magnet Leather',
    slug: 'magsafe-leather-card-wallet',
    sku: 'AC-WT-010',
    category: 'accessories',
    description: 'Crafted from premium top-grain European leather. Built-in strong magnets snap securely onto the back of your iPhone. Shielded pockets to hold up to three credit/ID cards safely.',
    price: 1299,
    discountPrice: 899,
    image: '/images/accessories.jpg',
    active: true,
    featured: false,
    trending: true,
    bestseller: true,
    newArrival: true,
    rating: 4.7,
    reviewsCount: 104,
    variants: [
      { id: 'v37', color: 'Brown', stock: 8 },
      { id: 'v38', color: 'Black', stock: 10 },
      { id: 'v39', color: 'Navy', stock: 5 }
    ],
    specifications: [
      { key: 'Material', value: 'Top-grain European calf leather' },
      { key: 'Magnetic Strength', value: '3x standard magnets' },
      { key: 'Shielding', value: 'RFID blocking inner lining' }
    ],
    seoTitle: 'MagSafe Leather Card Wallet - Top-grain iPhone Accessory',
    seoDescription: 'Snaps magnetically onto your iPhone. Real leather credit card holder with RFID shielding.'
  }
];

const INITIAL_SETTINGS = {
  storeName: 'Magnet Vapi Official',
  whatsappNumber: '+919999988888',
  address: 'Shop 12, High Street Galleria, Vapi, Gujarat, 396191',
  email: 'contact@magnetstore.com',
  announcement: '🔥 Deals of the Day: Flat 20% off on premium Graphic Tees! Free Delivery on orders above ₹1499',
  brandColor: '#ef4444',
  brandFont: 'Plus Jakarta Sans'
};

const INITIAL_BANNERS = [
  {
    id: 'b-1',
    heading: 'Curated Streetwear Launch',
    subtitle: 'Flat 20% OFF on all heavyweight cotton tees and signature hoodies. Upgrade your look now.',
    image: '/images/clothing.jpg',
    ctaText: 'Shop Streetwear',
    ctaUrl: '#clothing',
    active: true,
    startDate: '2026-08-01',
    endDate: '2026-09-01'
  },
  {
    id: 'b-2',
    heading: 'GaN Power Chargers & Cases',
    subtitle: 'Secure your devices with military drop armor cases and fast GaN wall adapters.',
    image: '/images/accessories.jpg',
    ctaText: 'Explore Gear',
    ctaUrl: '#accessories',
    active: true,
    startDate: '2026-08-01',
    endDate: '2026-09-01'
  }
];

const INITIAL_USER = {
  name: 'Josh Joshi',
  phone: '9876543210',
  email: 'josh@ecommerce.com',
  addresses: [
    { id: 'adr-1', name: 'Josh Joshi', type: 'Home', address: 'B-102, Silicon Greens, Chala Road', city: 'Vapi', state: 'Gujarat', pincode: '396191', phone: '9876543210', isDefault: true },
    { id: 'adr-2', name: 'Josh Joshi', type: 'Office', address: 'TechHub Solutions, GIDC Sector 2', city: 'Vapi', state: 'Gujarat', pincode: '396195', phone: '9876543212', isDefault: false }
  ]
};

const INITIAL_ORDERS = [
  {
    id: 'MGT-9481',
    createdAt: '2026-08-18T10:15:30Z',
    customer: {
      name: 'Josh Joshi',
      phone: '9876543210',
      email: 'josh@ecommerce.com',
      address: 'B-102, Silicon Greens, Chala Road',
      city: 'Vapi',
      state: 'Gujarat',
      pincode: '396191',
      notes: 'Call before delivery'
    },
    items: [
      {
        productId: 'prod-1',
        name: 'Magnet Signature Hoodie',
        price: 1499,
        quantity: 1,
        variant: { size: 'L', color: 'Black' }
      },
      {
        productId: 'prod-6',
        name: 'Magnet Matte Armor iPhone Case',
        price: 499,
        quantity: 2,
        variant: { compatibleModel: 'iPhone 15 Pro', color: 'Matte Black' }
      }
    ],
    total: 2497,
    paymentMethod: 'COD',
    status: 'Pending'
  },
  {
    id: 'MGT-9482',
    createdAt: '2026-08-17T14:22:00Z',
    customer: {
      name: 'Aditi Patel',
      phone: '8765432109',
      email: 'aditi.patel@outlook.com',
      address: 'Flat 12B, Vasant Kunj',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395007',
      notes: ''
    },
    items: [
      {
        productId: 'prod-7',
        name: 'GaN 65W Triple Port Wall Charger',
        price: 1699,
        quantity: 1,
        variant: { specification: 'US Plug', color: 'Charcoal Grey' }
      }
    ],
    total: 1699,
    paymentMethod: 'COD',
    status: 'Shipped'
  }
];

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('magnet_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('magnet_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('magnet_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('magnet_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('magnet_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('magnet_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('magnet_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('magnet_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('magnet_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState(false);

  // Load initial data from backend API with fallback
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('Attempting to fetch products from API...');
        const apiProds = await api.products.getAll();
        setProducts(apiProds);
      } catch (err) {
        console.warn('API error loading products, using localStorage fallback:', err.message);
      }

      try {
        console.log('Attempting to fetch categories from API...');
        const apiCats = await api.categories.getAll();
        setCategories(apiCats);
      } catch (err) {
        console.warn('API error loading categories, using localStorage fallback:', err.message);
      }

      try {
        console.log('Attempting to fetch banners from API...');
        const apiBanners = await api.banners.getAll();
        setBanners(apiBanners);
      } catch (err) {
        console.warn('API error loading banners, using localStorage fallback:', err.message);
      }

      try {
        console.log('Attempting to fetch settings from API...');
        const apiSettings = await api.settings.get();
        setSettings(apiSettings);
      } catch (err) {
        console.warn('API error loading settings, using localStorage fallback:', err.message);
      }

      // Check active user session
      const token = localStorage.getItem('magnet_token');
      if (token) {
        try {
          console.log('Attempting to restore user session from token...');
          const apiMe = await api.auth.getMe();
          setUserProfile(apiMe);
          if (apiMe.role === 'admin') {
            setIsAdmin(true);
          }
        } catch (err) {
          console.warn('Session restoration failed:', err.message);
          localStorage.removeItem('magnet_token');
        }
      }
    };

    loadInitialData();
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('magnet_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('magnet_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('magnet_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('magnet_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('magnet_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('magnet_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('magnet_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('magnet_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('magnet_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Product Actions
  const addProduct = async (product) => {
    try {
      const formData = new FormData();
      Object.keys(product).forEach(key => {
        if (key === 'variants' || key === 'specifications') {
          formData.append(key, JSON.stringify(product[key]));
        } else {
          formData.append(key, product[key]);
        }
      });
      const created = await api.products.create(formData);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.warn('API addProduct failed, saving locally:', err.message);
      const newProduct = {
        ...product,
        id: `prod-${Date.now()}`,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        rating: product.rating || 4.5,
        reviewsCount: product.reviewsCount || Math.floor(10 + Math.random() * 200)
      };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const formData = new FormData();
      Object.keys(updatedProduct).forEach(key => {
        if (key === 'variants' || key === 'specifications') {
          formData.append(key, JSON.stringify(updatedProduct[key]));
        } else {
          formData.append(key, updatedProduct[key]);
        }
      });
      const updated = await api.products.update(id, formData);
      setProducts((prev) =>
        prev.map((p) => (p.id === id || p._id === id ? { ...p, ...updated, id } : p))
      );
      return updated;
    } catch (err) {
      console.warn('API updateProduct failed, saving locally:', err.message);
      setProducts((prev) =>
        prev.map((p) => (p.id === id || p._id === id ? { ...p, ...updatedProduct, id } : p))
      );
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.products.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    } catch (err) {
      console.warn('API deleteProduct failed, deleting locally:', err.message);
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    }
  };

  // Category Actions
  const addCategory = async (category) => {
    try {
      const created = await api.categories.create(category);
      setCategories((prev) => [...prev, created]);
      return created;
    } catch (err) {
      console.warn('API addCategory failed, saving locally:', err.message);
      const newCategory = {
        ...category,
        id: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        productCount: 0,
        sortOrder: categories.length + 1
      };
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    try {
      const updated = await api.categories.update(id, updatedCategory);
      setCategories((prev) =>
        prev.map((c) => (c.id === id || c._id === id ? { ...c, ...updated, id } : c))
      );
      return updated;
    } catch (err) {
      console.warn('API updateCategory failed, saving locally:', err.message);
      setCategories((prev) =>
        prev.map((c) => (c.id === id || c._id === id ? { ...c, ...updatedCategory, id } : c))
      );
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.categories.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
    } catch (err) {
      console.warn('API deleteCategory failed, deleting locally:', err.message);
      setCategories((prev) => prev.filter((c) => c.id !== id && c._id !== id));
    }
  };

  // Banner Actions
  const addBanner = async (banner) => {
    try {
      const created = await api.banners.create(banner);
      setBanners((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.warn('API addBanner failed, saving locally:', err.message);
      const newBanner = {
        ...banner,
        id: `banner-${Date.now()}`
      };
      setBanners((prev) => [newBanner, ...prev]);
      return newBanner;
    }
  };

  const updateBanner = async (id, updatedBanner) => {
    try {
      const updated = await api.banners.update(id, updatedBanner);
      setBanners((prev) =>
        prev.map((b) => (b.id === id || b._id === id ? { ...b, ...updated, id } : b))
      );
      return updated;
    } catch (err) {
      console.warn('API updateBanner failed, saving locally:', err.message);
      setBanners((prev) =>
        prev.map((b) => (b.id === id || b._id === id ? { ...b, ...updatedBanner, id } : b))
      );
    }
  };

  const deleteBanner = async (id) => {
    try {
      await api.banners.delete(id);
      setBanners((prev) => prev.filter((b) => b.id !== id && b._id !== id));
    } catch (err) {
      console.warn('API deleteBanner failed, deleting locally:', err.message);
      setBanners((prev) => prev.filter((b) => b.id !== id && b._id !== id));
    }
  };

  // Cart Actions
  const addToCart = (product, variant, quantity) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => {
        if (item.productId !== product.id) return false;
        const keys = Object.keys(variant).filter(k => k !== 'id' && k !== 'stock');
        return keys.every(key => item.variant[key] === variant[key]);
      });

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        const newQty = newCart[existingItemIndex].quantity + quantity;
        const maxStock = variant.stock;
        newCart[existingItemIndex].quantity = Math.min(newQty, maxStock);
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            productId: product.id,
            brand: product.brand || 'Magnet',
            name: product.name,
            price: product.discountPrice || product.price,
            image: product.image,
            quantity: quantity,
            variant: variant
          }
        ];
      }
    });
  };

  const updateCartQty = (cartId, quantity) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const prod = products.find((p) => p.id === item.productId);
          if (prod) {
            const matchedVar = prod.variants.find((v) => {
              const keys = Object.keys(item.variant).filter(k => k !== 'id' && k !== 'stock');
              return keys.every(key => v[key] === item.variant[key]);
            });
            if (matchedVar) {
              const maxStock = matchedVar.stock;
              return { ...item, quantity: Math.max(1, Math.min(quantity, maxStock)) };
            }
          }
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Actions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Recently Viewed Actions
  const addRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 5); // Store top 5
    });
  };

  // Address Actions
  const saveAddress = async (address) => {
    try {
      const addresses = await api.users.saveAddress(address);
      setUserProfile((prev) => ({ ...prev, addresses }));
      return addresses;
    } catch (err) {
      console.warn('API saveAddress failed, saving locally:', err.message);
      setUserProfile((prev) => {
        const isEdit = !!address.id;
        let updatedAddresses = [];

        if (isEdit) {
          updatedAddresses = prev.addresses.map((a) => (a.id === address.id || a._id === address.id ? address : a));
        } else {
          const newAddr = { ...address, id: `adr-${Date.now()}` };
          updatedAddresses = [...prev.addresses, newAddr];
        }

        // If set to default, unset others
        if (address.isDefault) {
          updatedAddresses = updatedAddresses.map((a) => ({
            ...a,
            isDefault: a.id === address.id || a._id === address.id || (!address.id && a.id === `adr-${Date.now()}`)
          }));
        }

        return { ...prev, addresses: updatedAddresses };
      });
    }
  };

  const deleteAddress = async (id) => {
    try {
      const addresses = await api.users.deleteAddress(id);
      setUserProfile((prev) => ({ ...prev, addresses }));
    } catch (err) {
      console.warn('API deleteAddress failed, deleting locally:', err.message);
      setUserProfile((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== id && a._id !== id)
      }));
    }
  };

  // Order Actions
  const placeOrder = async (customerInfo, customCart = null) => {
    const orderItems = customCart || cart;
    try {
      const response = await api.orders.place({
        customer: customerInfo,
        items: orderItems,
        paymentMethod: customerInfo.paymentMethod || 'COD'
      });

      const order = response.order;
      setOrders((prev) => [order, ...prev]);
      if (!customCart) clearCart();
      return order.id;
    } catch (err) {
      console.warn('API placeOrder failed, falling back to local state:', err.message);
      const resolvedItems = orderItems.map(item => {
        const dbProd = products.find(p => p.id === item.productId || p._id === item.productId);
        const securePrice = dbProd ? (dbProd.discountPrice || dbProd.price) : item.price;
        return {
          ...item,
          price: securePrice
        };
      });

      const orderId = `MGT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: customerInfo,
        items: [...resolvedItems],
        total: resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod: customerInfo.paymentMethod || 'COD',
        status: 'Pending'
      };

      // Deduct stock
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const itemsForProd = resolvedItems.filter((item) => item.productId === p.id || item.productId === p._id);
          if (itemsForProd.length === 0) return p;

          const updatedVariants = p.variants.map((v) => {
            const matchedItem = itemsForProd.find((ci) => {
              const keys = Object.keys(ci.variant).filter(k => k !== 'id' && k !== 'stock');
              return keys.every(key => v[key] === ci.variant[key]);
            });
            if (matchedItem) {
              return { ...v, stock: Math.max(0, v.stock - matchedItem.quantity) };
            }
            return v;
          });

          return { ...p, variants: updatedVariants };
        })
      );

      setOrders((prev) => [newOrder, ...prev]);
      if (!customCart) clearCart();
      return orderId;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const updated = await api.orders.updateStatus(orderId, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
      );
    } catch (err) {
      console.warn('API updateOrderStatus failed, updating locally:', err.message);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    }
  };

  // KPI Calculations
  const getKPIs = () => {
    const activeOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalSales = activeOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;

    let lowStockCount = 0;
    products.forEach((p) => {
      const hasLow = p.variants.some((v) => v.stock <= 3 && v.stock > 0);
      if (hasLow) lowStockCount++;
    });

    let outOfStockCount = 0;
    products.forEach((p) => {
      const allOut = p.variants.every((v) => v.stock === 0);
      if (allOut) outOfStockCount++;
    });

    // Calculate customer count
    const uniqueCustomers = new Set(orders.map((o) => o.customer.phone)).size;

    return {
      totalSales,
      totalOrders,
      lowStockCount,
      outOfStockCount,
      activeProductsCount: products.filter((p) => p.active).length,
      customersCount: uniqueCustomers || 1
    };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        banners,
        cart,
        wishlist,
        userProfile,
        setUserProfile,
        recentlyViewed,
        isAdmin,
        setIsAdmin,
        setSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addBanner,
        updateBanner,
        deleteBanner,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        addRecentlyViewed,
        saveAddress,
        deleteAddress,
        placeOrder,
        updateOrderStatus,
        getKPIs
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
