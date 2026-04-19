import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local");
  console.error("   Add them to your frontend/.env.local file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ─── RETAILER DATA ───────────────────────────────────────
const RETAILERS = [
  { name: "TechZone", email: "retailer_techzone@nexgen.test", store_description: "Premium electronics and cutting-edge gadgets for the modern lifestyle." },
  { name: "StyleHub", email: "retailer_stylehub@nexgen.test", store_description: "Curated fashion and accessories with global trends and local craftsmanship." },
  { name: "FreshMart", email: "retailer_freshmart@nexgen.test", store_description: "Farm-to-table organic produce and artisanal food products." },
  { name: "GadgetKing", email: "retailer_gadgetking@nexgen.test", store_description: "Your one-stop destination for smart home, wearables, and tech accessories." },
  { name: "HomeNest", email: "retailer_homenest@nexgen.test", store_description: "Elegant home décor, furniture, and living essentials." },
];

// ─── CUSTOMER DATA ───────────────────────────────────────
const CUSTOMERS = [
  { name: "Aarav Patel", email: "aarav.patel@nexgen.test" },
  { name: "Priya Sharma", email: "priya.sharma@nexgen.test" },
  { name: "Rohan Mehta", email: "rohan.mehta@nexgen.test" },
  { name: "Ananya Gupta", email: "ananya.gupta@nexgen.test" },
  { name: "Vikram Singh", email: "vikram.singh@nexgen.test" },
  { name: "Neha Kapoor", email: "neha.kapoor@nexgen.test" },
  { name: "Arjun Reddy", email: "arjun.reddy@nexgen.test" },
  { name: "Kavya Nair", email: "kavya.nair@nexgen.test" },
  { name: "Rahul Joshi", email: "rahul.joshi@nexgen.test" },
  { name: "Meera Desai", email: "meera.desai@nexgen.test" },
];

// ─── PRODUCT CATALOG ─────────────────────────────────────
// Each product will be assigned a random retailer_id after retailer creation
const PRODUCTS = [
  // Electronics
  { name: "AirPods Pro Max 2026", description: "Premium noise-cancelling earbuds with spatial audio, adaptive EQ, and 30-hour battery life.", price: 5999, original_price: 7499, category: "Electronics", image_url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop", stock_count: 35, rating: 4.8, review_count: 1247 },
  { name: "MagSafe Charging Stand Pro", description: "3-in-1 magnetic charging dock for phone, watch, and earbuds. Sleek aluminum design.", price: 2499, original_price: 3199, category: "Electronics", image_url: "https://images.unsplash.com/photo-1610438235354-a6ae5528385c?w=400&h=400&fit=crop", stock_count: 50, rating: 4.6, review_count: 823 },
  { name: "Smart Home Hub — Matter", description: "Universal smart home controller supporting Matter, Zigbee, and Thread protocols.", price: 4999, original_price: 6499, category: "Electronics", image_url: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=400&fit=crop", stock_count: 22, rating: 4.5, review_count: 456 },
  { name: "Mechanical Keyboard — Tactile 75%", description: "Hot-swappable tactile switches, RGB backlit, CNC aluminum frame. USB-C.", price: 8999, original_price: 10999, category: "Electronics", image_url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop", stock_count: 18, rating: 4.9, review_count: 672 },
  { name: "4K Portable Monitor (15.6\")", description: "Ultra-slim 4K OLED portable monitor with USB-C. Weight: 680g.", price: 18999, original_price: 22999, category: "Electronics", image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop", stock_count: 12, rating: 4.7, review_count: 389 },

  // Fashion
  { name: "Heritage Linen Blazer", description: "Breathable Italian linen blazer with subtle texture. Tailored modern fit.", price: 4599, original_price: 5999, category: "Fashion", image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop", stock_count: 28, rating: 4.4, review_count: 234 },
  { name: "Minimalist Canvas Backpack", description: "Water-resistant waxed canvas with leather accents. 25L capacity, laptop sleeve.", price: 2799, original_price: 3499, category: "Fashion", image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", stock_count: 45, rating: 4.6, review_count: 567 },
  { name: "Artisan Leather Belt", description: "Hand-stitched full-grain vegetable-tanned leather belt. Brass hardware.", price: 1899, original_price: 2399, category: "Fashion", image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", stock_count: 60, rating: 4.5, review_count: 312 },
  { name: "Performance Running Shoes", description: "Carbon-plated midsole, engineered mesh upper. Race-day ready.", price: 7999, original_price: 9999, category: "Fashion", image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", stock_count: 38, rating: 4.8, review_count: 891 },
  { name: "Cashmere Blend Scarf", description: "Ultra-soft cashmere-silk blend wrap scarf. Handwoven in Kashmir.", price: 3299, original_price: 4199, category: "Fashion", image_url: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop", stock_count: 20, rating: 4.7, review_count: 178 },

  // Groceries
  { name: "Organic Alphonso Mangoes (1kg)", description: "Hand-picked premium Ratnagiri Alphonso mangoes, naturally ripened for peak sweetness.", price: 450, original_price: 599, category: "Groceries", image_url: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop", stock_count: 80, rating: 4.8, review_count: 1024 },
  { name: "A2 Desi Cow Ghee (500ml)", description: "Bilona method A2 cow ghee from grass-fed desi cows. Rich aroma.", price: 890, original_price: 1099, category: "Groceries", image_url: "https://images.unsplash.com/photo-1631209121750-a9f656d28f7a?w=400&h=400&fit=crop", stock_count: 42, rating: 4.9, review_count: 756 },
  { name: "Japanese Matcha Powder (100g)", description: "Ceremonial grade Uji matcha from Kyoto. Stone-ground for smoothness.", price: 599, original_price: 799, category: "Groceries", image_url: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop", stock_count: 55, rating: 4.7, review_count: 432 },
  { name: "Manuka Honey UMF 15+ (250g)", description: "Authentic New Zealand Manuka honey. Raw & unfiltered. UMF-certified.", price: 2499, original_price: 2999, category: "Groceries", image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop", stock_count: 15, rating: 4.9, review_count: 289 },
  { name: "Single Origin Coffee Beans (250g)", description: "Ethiopian Yirgacheffe single-origin. Light roast with floral & citrus notes.", price: 495, original_price: 649, category: "Groceries", image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", stock_count: 65, rating: 4.8, review_count: 567 },

  // Home & Living
  { name: "Ceramic Pour-Over Coffee Set", description: "Hand-glazed ceramic dripper with carafe. Makes 4 cups of perfection.", price: 1999, original_price: 2599, category: "Home & Living", image_url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop", stock_count: 30, rating: 4.6, review_count: 345 },
  { name: "Eucalyptus Linen Bedsheet Set", description: "Tencel eucalyptus fiber sheets. Silky smooth, temperature regulating. Queen size.", price: 3499, original_price: 4499, category: "Home & Living", image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", stock_count: 25, rating: 4.7, review_count: 478 },
  { name: "Japanese Incense — Hinoki Cedar", description: "Low-smoke hinoki cypress incense sticks. 40 sticks, burns 25 min each.", price: 799, original_price: 999, category: "Home & Living", image_url: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&h=400&fit=crop", stock_count: 70, rating: 4.5, review_count: 234 },
  { name: "Handblown Glass Vase", description: "Artisan handblown borosilicate glass vase. Unique smoke gradient finish.", price: 1599, original_price: 1999, category: "Home & Living", image_url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop", stock_count: 18, rating: 4.8, review_count: 156 },
  { name: "Smart Aroma Diffuser (200ml)", description: "WiFi-enabled ultrasonic diffuser with app control, mood lighting & timer.", price: 2299, original_price: 2899, category: "Home & Living", image_url: "https://images.unsplash.com/photo-1602178506690-8eb18cdfb55b?w=400&h=400&fit=crop", stock_count: 40, rating: 4.4, review_count: 567 },
];

// ─── MAIN SEED FUNCTION ──────────────────────────────────
async function seed() {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   🚀 NexGen Retail OS — Database Seeder     ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  // ── Step 1: Create Retailers ──
  console.log('📦 Step 1/3: Creating retailers...');
  const retailerIds: string[] = [];

  for (const retailer of RETAILERS) {
    console.log(`   → ${retailer.name} (${retailer.email})`);
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: retailer.email,
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        role: 'retailer',
        full_name: `${retailer.name} Admin`,
        store_name: retailer.name,
        store_description: retailer.store_description
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`     ⚠ Already exists, fetching ID...`);
        // List users to find existing
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existing = listData?.users?.find(u => u.email === retailer.email);
        if (existing) retailerIds.push(existing.id);
      } else {
        console.error(`     ✗ Error: ${authError.message}`);
      }
      continue;
    }
    if (authUser.user) {
      retailerIds.push(authUser.user.id);
      console.log(`     ✓ Created (ID: ${authUser.user.id.slice(0, 8)}...)`);
    }
  }
  console.log(`   ✅ ${retailerIds.length} retailers ready\n`);

  // ── Step 2: Create Customers ──
  console.log('👥 Step 2/3: Creating customers...');
  let customerCount = 0;

  for (const customer of CUSTOMERS) {
    const { error: authError } = await supabase.auth.admin.createUser({
      email: customer.email,
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        role: 'customer',
        full_name: customer.name
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`   → ${customer.name} — already exists`);
        customerCount++;
      } else {
        console.error(`   ✗ ${customer.name}: ${authError.message}`);
      }
      continue;
    }
    customerCount++;
    console.log(`   → ${customer.name} — created`);
  }
  console.log(`   ✅ ${customerCount} customers ready\n`);

  // ── Step 3: Create Products ──
  console.log('🛍️  Step 3/3: Seeding product catalog...');

  if (retailerIds.length === 0) {
    console.error('   ✗ No retailer IDs available. Cannot seed products.');
    console.error('   → Make sure the profiles trigger is set up in Supabase.');
    process.exit(1);
  }

  // Clear existing products (optional — remove this block for append mode)
  console.log('   → Clearing existing products...');
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
  
  if (deleteError) {
    console.log(`     ⚠ Could not clear: ${deleteError.message} (continuing anyway)`);
  }

  let productCount = 0;
  for (const product of PRODUCTS) {
    // Round-robin assign to retailers
    const retailerId = retailerIds[productCount % retailerIds.length];

    const { error: productError } = await supabase.from('products').insert({
      retailer_id: retailerId,
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      category: product.category,
      image_url: product.image_url,
      stock_count: product.stock_count,
      rating: product.rating,
      review_count: product.review_count,
      is_active: true
    });

    if (productError) {
      console.error(`   ✗ ${product.name}: ${productError.message}`);
    } else {
      productCount++;
      console.log(`   → ${product.name} (₹${product.price}) ✓`);
    }
  }

  console.log(`   ✅ ${productCount} products seeded\n`);

  // ── Summary ──
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   ✅ Seeding Complete!                       ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║   Retailers:  ${retailerIds.length.toString().padEnd(30)}║`);
  console.log(`║   Customers:  ${customerCount.toString().padEnd(30)}║`);
  console.log(`║   Products:   ${productCount.toString().padEnd(30)}║`);
  console.log('╠══════════════════════════════════════════════╣');
  console.log('║   🔑 Login Credentials:                     ║');
  console.log('║   Email: retailer_techzone@nexgen.test       ║');
  console.log('║   Pass:  password123                         ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
}

seed().catch((err) => {
  console.error('💥 Seed process failed:', err);
  process.exit(1);
});
