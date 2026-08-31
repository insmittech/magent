import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Category } from './models/Category.js';
import { Banner } from './models/Banner.js';
import { Setting } from './models/Setting.js';

dotenv.config();

const INITIAL_CATEGORIES = [
  { name: 'Clothing', slug: 'clothing', active: true, image: '/images/clothing.jpg', sortOrder: 1 },
  { name: 'Mobile Accessories', slug: 'accessories', active: true, image: '/images/accessories.jpg', sortOrder: 2 }
];

const INITIAL_PRODUCTS = [
  {
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
      { size: 'S', color: 'Black', stock: 5 },
      { size: 'M', color: 'Black', stock: 8 },
      { size: 'L', color: 'Black', stock: 10 },
      { size: 'XL', color: 'Black', stock: 3 },
      { size: 'M', color: 'Grey', stock: 4 },
      { size: 'L', color: 'Grey', stock: 6 }
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
      { size: 'M', color: 'White', stock: 12 },
      { size: 'L', color: 'White', stock: 15 },
      { size: 'XL', color: 'White', stock: 8 },
      { size: 'M', color: 'Black', stock: 10 },
      { size: 'L', color: 'Black', stock: 12 }
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
      { size: '30', color: 'Blue', stock: 4 },
      { size: '32', color: 'Blue', stock: 6 },
      { size: '34', color: 'Blue', stock: 5 },
      { size: '32', color: 'Black', stock: 4 }
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
      { size: 'S', color: 'Beige', stock: 6 },
      { size: 'M', color: 'Beige', stock: 10 },
      { size: 'L', color: 'Beige', stock: 12 },
      { size: 'M', color: 'Olive', stock: 8 },
      { size: 'L', color: 'Olive', stock: 8 }
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
      { size: 'M', color: 'Black', stock: 3 },
      { size: 'L', color: 'Black', stock: 5 },
      { size: 'XL', color: 'Black', stock: 2 }
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
      { compatibleModel: 'iPhone 13', color: 'Matte Black', stock: 10 },
      { compatibleModel: 'iPhone 14', color: 'Matte Black', stock: 15 },
      { compatibleModel: 'iPhone 15', color: 'Matte Black', stock: 20 },
      { compatibleModel: 'iPhone 15 Pro', color: 'Matte Black', stock: 12 },
      { compatibleModel: 'iPhone 15 Pro Max', color: 'Matte Black', stock: 8 },
      { compatibleModel: 'iPhone 15', color: 'Frosted Navy', stock: 5 },
      { compatibleModel: 'iPhone 15 Pro', color: 'Frosted Navy', stock: 6 }
    ],
    specifications: [
      { key: 'Compatibility', value: 'iPhone 13 / 14 / 15 series models' },
      { key: 'Drop Protection', value: 'Military-grade certified up to 10ft' },
      { key: 'MagSafe Support', value: 'Integrated N52 Neodymium magnets' }
    ],
    seoTitle: 'Magnet Matte Armor iPhone Case - MagSafe Bumper Case',
    seoDescription: 'Frosted back panel drop-tested hybrid iPhone bumper case. Support fast MagSafe alignment.'
  },
  {
    name: 'GaN 65W Triple Port Wall Charger',
    brand: 'Magnet Power',
    slug: 'gan-65w-triple-port-wall-charger',
    sku: 'AC-CH-007',
    category: 'accessories',
    description: 'Compact high-speed adapter equipped with 2 USB-C and 1 USB-A ports. Powered by cutting-edge Gallium Nitride (GaN) tech to safely charge laptops, tablets, and phones simultaneously.',
    price: 2499,
    discountPrice: 1699,
    image: '/images/accessories.jpg',
    active: true,
    featured: true,
    trending: false,
    bestseller: true,
    newArrival: false,
    rating: 4.7,
    reviewsCount: 94,
    variants: [
      { specification: 'US Plug', color: 'Charcoal Grey', stock: 8 },
      { specification: 'EU Plug', color: 'Charcoal Grey', stock: 4 },
      { specification: 'US Plug', color: 'White', stock: 6 }
    ],
    specifications: [
      { key: 'Output Power', value: '65W Max USB-C Power Delivery 3.0' },
      { key: 'Ports', value: '2x USB Type-C, 1x USB Type-A' },
      { key: 'Technology', value: 'Gallium Nitride (GaN) Semiconductors' }
    ],
    seoTitle: 'GaN 65W Triple Port Charger - Ultra-compact Wall Adapter',
    seoDescription: 'Fast charge your MacBook, iPad, and iPhone simultaneously with our GaN 65W wall adapter.'
  },
  {
    name: 'Braided Type-C to Lightning Cable',
    brand: 'Magnet Link',
    slug: 'braided-type-c-to-lightning-cable',
    sku: 'AC-CB-008',
    category: 'accessories',
    description: 'Heavy-duty 1.2m nylon-braided cable supporting up to 27W Power Delivery fast charging. Reinforced Kevlar strain relief joints ensure a lifespan of over 20,000 bends.',
    price: 599,
    discountPrice: 349,
    image: '/images/accessories.jpg',
    active: true,
    featured: false,
    trending: true,
    bestseller: false,
    newArrival: true,
    rating: 4.5,
    reviewsCount: 167,
    variants: [
      { specification: '1.2m length', color: 'Space Grey', stock: 30 },
      { specification: '1.2m length', color: 'Gold', stock: 15 },
      { specification: '2.0m length', color: 'Space Grey', stock: 20 }
    ],
    specifications: [
      { key: 'Connector Type', value: 'USB Type-C to Apple Lightning' },
      { key: 'Charging Speed', value: 'Supports up to 27W PD fast charge' },
      { key: 'Material', value: 'Double-braided nylon, aluminum shielding' }
    ],
    seoTitle: 'Braided Type-C to Lightning Cable - Heavy Duty Apple Charger Cable',
    seoDescription: 'Durable nylon-braided charging cable. Kevlar strain relief joints, Apple fast charge compatible.'
  },
  {
    name: 'Premium Wireless ANC Earbuds',
    brand: 'Magnet Audio',
    slug: 'premium-wireless-anc-earbuds',
    sku: 'AC-EB-009',
    category: 'accessories',
    description: 'Equipped with custom 11mm dynamic drivers and hybrid active noise cancellation. Features transparency monitoring mode, dual-device bluetooth pairing, and sweatproof protection.',
    price: 3999,
    discountPrice: 2999,
    image: '/images/accessories.jpg',
    active: true,
    featured: true,
    trending: false,
    bestseller: false,
    newArrival: false,
    rating: 4.3,
    reviewsCount: 42,
    variants: [
      { specification: 'Standard', color: 'Matte White', stock: 6 },
      { specification: 'Standard', color: 'Midnight Black', stock: 10 }
    ],
    specifications: [
      { key: 'Driver Size', value: '11mm High-fidelity dynamic drivers' },
      { key: 'ANC Depth', value: 'Hybrid ANC up to 40dB noise suppression' },
      { key: 'Battery', value: '7h (buds) + 23h (case), wireless charging compatible' }
    ],
    seoTitle: 'Premium Wireless Active Noise Cancelling Earbuds',
    seoDescription: 'Experience immersive audio with hybrid active noise cancellation, custom audio profile, and long battery life.'
  },
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
      { color: 'Brown', stock: 8 },
      { color: 'Black', stock: 10 },
      { color: 'Navy', stock: 5 }
    ],
    specifications: [
      { key: 'Material', value: 'Top-grain European calf leather' },
      { key: 'Magnetic Strength', value: '3x standard magnets' },
      { key: 'Shielding', value: 'RFID blocking inner lining' }
    ],
    seoTitle: 'MagSafe Leather Card Wallet - Top-grain iPhone Accessory',
    seoDescription: 'Snaps magnetically onto your iPhone. Real leather credit card holder with RFID shielding.'
  },
  {
    name: 'Heavyweight Utility Cargo Pants',
    brand: 'Magnet Wear',
    slug: 'heavyweight-utility-cargo-pants',
    sku: 'CL-PT-011',
    category: 'clothing',
    description: 'Made from high-density tactical cotton canvas. Features six utility pockets, double-layer reinforced knees, and adjustable ankle cuffs for customizable style.',
    price: 2999,
    discountPrice: 2299,
    image: '/images/clothing.jpg',
    active: true,
    featured: true,
    trending: true,
    bestseller: false,
    newArrival: true,
    rating: 4.7,
    reviewsCount: 45,
    variants: [
      { size: '30', color: 'Olive Green', stock: 5 },
      { size: '32', color: 'Olive Green', stock: 12 },
      { size: '34', color: 'Olive Green', stock: 8 },
      { size: '32', color: 'Black', stock: 10 }
    ],
    specifications: [
      { key: 'Material', value: '100% Cotton Tactical Canvas' },
      { key: 'Weight', value: '320 GSM' },
      { key: 'Features', value: 'Adjustable drawcords, reinforced seat & knees' }
    ],
    seoTitle: 'Heavyweight Utility Cargo Pants - Tactical Streetwear',
    seoDescription: 'Premium heavyweight cargo pants with six pocket layout and knee reinforcement. Relaxed fit.'
  },
  {
    name: 'Acid Wash Drop Shoulder Tee',
    brand: 'Magnet Vintage',
    slug: 'acid-wash-drop-shoulder-tee',
    sku: 'CL-TS-012',
    category: 'clothing',
    description: 'Each piece features a unique vintage acid-wash pattern. Cut in a heavy 240 GSM combed cotton with a structured drop-shoulder boxy fit.',
    price: 1099,
    discountPrice: 849,
    image: '/images/clothing.jpg',
    active: true,
    featured: false,
    trending: true,
    bestseller: true,
    newArrival: true,
    rating: 4.8,
    reviewsCount: 62,
    variants: [
      { size: 'M', color: 'Charcoal Wash', stock: 15 },
      { size: 'L', color: 'Charcoal Wash', stock: 20 },
      { size: 'XL', color: 'Charcoal Wash', stock: 10 }
    ],
    specifications: [
      { key: 'Material', value: '100% Combed Cotton' },
      { key: 'Fabric weight', value: '240 GSM Heavyweight' },
      { key: 'Finish', value: 'Custom acid wash process' }
    ],
    seoTitle: 'Acid Wash Drop Shoulder Tee - Heavyweight Wash Tee',
    seoDescription: 'Unique vintage acid wash boxy fit drop shoulder tee. Premium heavy combed cotton.'
  },
  {
    name: 'Retro Corduroy Cap',
    brand: 'Magnet Wear',
    slug: 'retro-corduroy-cap',
    sku: 'CL-CP-013',
    category: 'clothing',
    description: 'Classic 6-panel unstructured cap made from durable 8-wale corduroy. Features a pre-curved visor, custom metal slider adjustment, and low-profile shape.',
    price: 799,
    discountPrice: 599,
    image: '/images/clothing.jpg',
    active: true,
    featured: false,
    trending: false,
    bestseller: false,
    newArrival: true,
    rating: 4.4,
    reviewsCount: 29,
    variants: [
      { size: 'One Size', color: 'Mustard Yellow', stock: 15 },
      { size: 'One Size', color: 'Forest Green', stock: 15 },
      { size: 'One Size', color: 'Vintage Black', stock: 25 }
    ],
    specifications: [
      { key: 'Material', value: '100% Cotton 8-Wale Corduroy' },
      { key: 'Structure', value: 'Unstructured 6-Panel Layout' },
      { key: 'Strap', value: 'Self-fabric backstrap with brass clasp' }
    ],
    seoTitle: 'Retro Corduroy Cap - Unstructured 6-Panel Hat',
    seoDescription: 'Classic vintage-style corduroy cap. Unstructured design in rich seasonal colors.'
  },
  {
    name: 'Cyberpunk Graphic Hoodie',
    brand: 'Magnet Wear',
    slug: 'cyberpunk-graphic-hoodie',
    sku: 'CL-HD-014',
    category: 'clothing',
    description: 'Heavyweight graphic hoodie with high-resolution glowing cyberpunk aesthetic backprint. Double layer hood and thick ribbing.',
    price: 2199,
    discountPrice: 1699,
    image: '/images/clothing.jpg',
    active: true,
    featured: true,
    trending: false,
    bestseller: false,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 51,
    variants: [
      { size: 'M', color: 'Black', stock: 8 },
      { size: 'L', color: 'Black', stock: 12 },
      { size: 'XL', color: 'Black', stock: 6 }
    ],
    specifications: [
      { key: 'Material', value: '75% Cotton, 25% Polyester fleece' },
      { key: 'Weight', value: '380 GSM' },
      { key: 'Graphics', value: 'High-density silk screen printing' }
    ],
    seoTitle: 'Cyberpunk Graphic Hoodie - Heavyweight streetwear',
    seoDescription: 'Explore the Cyberpunk Graphic Hoodie. 380 GSM fleece hoodie with glowing retro-future graphics.'
  },
  {
    name: 'Minimalist Coach Jacket',
    brand: 'Magnet Technical',
    slug: 'minimalist-coach-jacket',
    sku: 'CL-JK-015',
    category: 'clothing',
    description: 'Water-resistant nylon shell with matte snap buttons, classic collar, drawcord hem, and elastic cuffs. Lightweight and stylish.',
    price: 3299,
    discountPrice: 2499,
    image: '/images/clothing.jpg',
    active: true,
    featured: false,
    trending: true,
    bestseller: false,
    newArrival: false,
    rating: 4.5,
    reviewsCount: 38,
    variants: [
      { size: 'M', color: 'Dark Navy', stock: 5 },
      { size: 'L', color: 'Dark Navy', stock: 8 },
      { size: 'XL', color: 'Dark Navy', stock: 4 }
    ],
    specifications: [
      { key: 'Material', value: '100% Ripstop Nylon Shell' },
      { key: 'Lining', value: 'Soft Breathable Mesh Lining' },
      { key: 'Hardware', value: 'Premium Matte Black Snap Buttons' }
    ],
    seoTitle: 'Minimalist Coach Jacket - Wind Resistant Outerwear',
    seoDescription: 'Unisex minimalist coach jacket. Waterproof ripstop nylon with adjustable drawstrings.'
  },
  {
    name: 'GaN 100W Desktop Charging Station',
    brand: 'Magnet Power',
    slug: 'gan-100w-desktop-charging-station',
    sku: 'AC-CH-016',
    category: 'accessories',
    description: 'Powerful 100W multi-port charger for your desk. Features 3x USB-C and 1x USB-A ports to charge high-power laptops, tablets, and phones simultaneously.',
    price: 4499,
    discountPrice: 3499,
    image: '/images/accessories.jpg',
    active: true,
    featured: true,
    trending: true,
    bestseller: true,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 88,
    variants: [
      { specification: 'Standard', color: 'Space Grey', stock: 12 },
      { specification: 'Standard', color: 'Matte White', stock: 6 }
    ],
    specifications: [
      { key: 'Max Output', value: '100W Power Delivery 3.0' },
      { key: 'Ports', value: '3x USB Type-C, 1x USB Type-A' },
      { key: 'Cable', value: 'Includes 1.5m AC power extension cord' }
    ],
    seoTitle: 'GaN 100W Desktop Charging Station - 4-Port Fast Charger',
    seoDescription: 'Ultra-fast 100W GaN desktop power hub. Safely power up laptops and smartphones together.'
  },
  {
    name: 'Tactical Tech Pouch Organizer',
    brand: 'Magnet Technical',
    slug: 'tactical-tech-pouch-organizer',
    sku: 'AC-PO-017',
    category: 'accessories',
    description: 'Keep your chargers, cables, and tech gear organized. Water-repellent Cordura fabric with multiple mesh pockets, elastic loops, and soft padding.',
    price: 1499,
    discountPrice: 999,
    image: '/images/accessories.jpg',
    active: true,
    featured: false,
    trending: true,
    bestseller: false,
    newArrival: true,
    rating: 4.6,
    reviewsCount: 39,
    variants: [
      { specification: 'Standard', color: 'Tactical Black', stock: 15 },
      { specification: 'Standard', color: 'Coyote Tan', stock: 10 }
    ],
    specifications: [
      { key: 'Material', value: '1000D Water-resistant Cordura Nylon' },
      { key: 'Dimensions', value: '24cm x 15cm x 7cm' },
      { key: 'Zippers', value: 'YKK heavy-duty dual sliders' }
    ],
    seoTitle: 'Tactical Tech Pouch Organizer - Cordura Cable Organizer',
    seoDescription: 'Durable padded cable organizer pouch. Multi-pocket interior layout for GaN chargers, power banks, and cords.'
  },
  {
    name: 'MagSafe Ring Stand Grip',
    brand: 'Magnet Armor',
    slug: 'magsafe-ring-stand-grip',
    sku: 'AC-RG-018',
    category: 'accessories',
    description: 'Double-duty MagSafe accessory. Snaps onto your phone case to act as a secure finger ring grip or a multi-angle kickstand.',
    price: 899,
    discountPrice: 599,
    image: '/images/accessories.jpg',
    active: true,
    featured: false,
    trending: false,
    bestseller: true,
    newArrival: true,
    rating: 4.5,
    reviewsCount: 112,
    variants: [
      { color: 'Matte Black', stock: 20 },
      { color: 'Titanium Grey', stock: 15 },
      { color: 'Rose Gold', stock: 10 }
    ],
    specifications: [
      { key: 'Magnet', value: 'N52 Ultra-strong neodymium ring' },
      { key: 'Rotation', value: '360 degree rotation, 180 degree fold' },
      { key: 'Material', value: 'Premium zinc alloy construction' }
    ],
    seoTitle: 'MagSafe Ring Stand Grip - Metal Magnetic Kickstand',
    seoDescription: 'Ultra strong magnetic phone ring grip and adjustable table kickstand. Fits all MagSafe cases.'
  },
  {
    name: 'GaN 35W Dual Port Car Charger',
    brand: 'Magnet Power',
    slug: 'gan-35w-dual-port-car-charger',
    sku: 'AC-CC-019',
    category: 'accessories',
    description: 'Super compact mini car charger. Delivers 35W fast charging through dual USB-C and USB-A ports. Sits almost flush in your cigarette lighter socket.',
    price: 999,
    discountPrice: 699,
    image: '/images/accessories.jpg',
    active: true,
    featured: false,
    trending: false,
    bestseller: false,
    newArrival: false,
    rating: 4.7,
    reviewsCount: 73,
    variants: [
      { color: 'Space Black', stock: 18 }
    ],
    specifications: [
      { key: 'Power Output', value: '35W Max Power Delivery 3.0 / QC 3.0' },
      { key: 'Ports', value: '1x USB-C, 1x USB-A' },
      { key: 'Material', value: 'Full fireproof aluminum alloy body' }
    ],
    seoTitle: 'GaN 35W Dual Port Car Charger - Mini Metal Adapter',
    seoDescription: 'Compact car fast charger with dual output ports. Sleek metal shell, high temperature safety protection.'
  },
  {
    name: 'High-Fidelity Wireless Headphones',
    brand: 'Magnet Audio',
    slug: 'high-fidelity-wireless-headphones',
    sku: 'AC-HP-020',
    category: 'accessories',
    description: 'Over-ear studio-quality sound. Features custom 40mm silk-diaphragm drivers, advanced Hybrid Active Noise Cancellation, and 50-hour playback duration.',
    price: 6999,
    discountPrice: 5499,
    image: '/images/accessories.jpg',
    active: true,
    featured: true,
    trending: true,
    bestseller: true,
    newArrival: true,
    rating: 4.8,
    reviewsCount: 95,
    variants: [
      { color: 'Charcoal Black', stock: 8 },
      { color: 'Sand Beige', stock: 5 }
    ],
    specifications: [
      { key: 'Drivers', value: '40mm Silk-diaphragm dynamic drivers' },
      { key: 'ANC Depth', value: 'Up to 38dB hybrid noise cancellation' },
      { key: 'Battery Life', value: '50h (ANC off), 40h (ANC on), USB-C fast charge' }
    ],
    seoTitle: 'High-Fidelity Wireless Over-Ear Headphones - Hybrid ANC',
    seoDescription: 'Premium active noise cancelling over-ear headphones. Studio audio profile, plush memory foam earcups.'
  }
];

const INITIAL_BANNERS = [
  {
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

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Banner.deleteMany();
    await Setting.deleteMany();

    // Create Admin user
    await User.create({
      name: 'Magnet Admin Staff',
      phone: '9999988888',
      email: 'admin@magnet.com',
      password: 'admin123',
      role: 'admin',
      addresses: []
    });
    console.log('Admin user seeded: admin@magnet.com / admin123');

    // Create Customer user
    await User.create({
      name: 'Josh Joshi',
      phone: '9876543210',
      email: 'josh@ecommerce.com',
      password: 'customer123',
      role: 'customer',
      addresses: [
        { name: 'Josh Joshi', type: 'Home', address: 'B-102, Silicon Greens, Chala Road', city: 'Vapi', state: 'Gujarat', pincode: '396191', phone: '9876543210', isDefault: true },
        { name: 'Josh Joshi', type: 'Office', address: 'TechHub Solutions, GIDC Sector 2', city: 'Vapi', state: 'Gujarat', pincode: '396195', phone: '9876543212', isDefault: false }
      ]
    });
    console.log('Customer user seeded: josh@ecommerce.com / customer123');

    // Seed Categories
    await Category.insertMany(INITIAL_CATEGORIES);
    console.log('Categories seeded.');

    // Seed Banners
    await Banner.insertMany(INITIAL_BANNERS);
    console.log('Hero Banners seeded.');

    // Seed Settings
    await Setting.create({});
    console.log('Store Settings seeded.');

    // Seed Products
    await Product.insertMany(INITIAL_PRODUCTS);
    console.log('Products seeded.');

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

seedData();
