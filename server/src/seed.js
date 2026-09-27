import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { prisma, connectDB } from './config/db.js';

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
      { compatibleModel: 'iPhone 15', color: 'Matte Black', stock: 20 }
    ],
    specifications: [
      { key: 'Compatibility', value: 'iPhone 13 / 14 / 15 series models' },
      { key: 'Drop Protection', value: 'Military-grade certified up to 10ft' }
    ],
    seoTitle: 'Magnet Matte Armor iPhone Case - MagSafe Bumper Case',
    seoDescription: 'Frosted back panel drop-tested hybrid iPhone bumper case.'
  },
  {
    name: 'GaN 65W Triple Port Wall Charger',
    brand: 'Magnet Power',
    slug: 'gan-65w-triple-port-wall-charger',
    sku: 'AC-CH-007',
    category: 'accessories',
    description: 'Compact high-speed adapter equipped with 2 USB-C and 1 USB-A ports. Powered by Gallium Nitride (GaN) tech.',
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
      { specification: 'EU Plug', color: 'Charcoal Grey', stock: 4 }
    ],
    specifications: [
      { key: 'Output Power', value: '65W Max USB-C Power Delivery 3.0' }
    ],
    seoTitle: 'GaN 65W Triple Port Charger - Ultra-compact Wall Adapter',
    seoDescription: 'Fast charge your devices simultaneously with our GaN 65W wall adapter.'
  }
];

const INITIAL_BANNERS = [
  {
    heading: 'Curated Streetwear Launch',
    subtitle: 'Flat 20% OFF on all heavyweight cotton tees and signature hoodies.',
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
    await connectDB();
    console.log('Seeding MySQL database...');

    // Clear tables
    await prisma.wishlistItem.deleteMany();
    await prisma.address.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.banner.deleteMany();
    await prisma.setting.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    const superAdminPassword = await bcrypt.hash('superadmin123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    await prisma.user.create({
      data: {
        name: 'Super Admin Master',
        phone: '9999900000',
        email: 'superadmin@magnet.com',
        password: superAdminPassword,
        role: 'super_admin'
      }
    });

    await prisma.user.create({
      data: {
        name: 'Magnet Admin Staff',
        phone: '9999988888',
        email: 'admin@magnet.com',
        password: adminPassword,
        role: 'admin'
      }
    });

    const customerUser = await prisma.user.create({
      data: {
        name: 'Josh Joshi',
        phone: '9876543210',
        email: 'josh@ecommerce.com',
        password: customerPassword,
        role: 'customer',
        addresses: {
          create: [
            { name: 'Josh Joshi', type: 'Home', address: 'B-102, Silicon Greens, Chala Road', city: 'Vapi', state: 'Gujarat', pincode: '396191', phone: '9876543210', isDefault: true }
          ]
        }
      }
    });

    // Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      await prisma.category.create({ data: cat });
    }

    // Seed Banners
    for (const ban of INITIAL_BANNERS) {
      await prisma.banner.create({ data: ban });
    }

    // Seed Setting
    await prisma.setting.create({ data: {} });

    // Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      await prisma.product.create({ data: prod });
    }

    console.log('✅ MySQL Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedData();
