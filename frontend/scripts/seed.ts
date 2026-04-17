import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseServiceRoleKey) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY is required in .env.local to seed auth users.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const CATEGORIES = ['Electronics', 'Fashion', 'Groceries', 'Home & Living'];
const RETAILER_NAMES = ["TechZone", "StyleHub", "FreshMart", "GadgetKing", "HomeNest"];

async function seed() {
  console.log('🚀 Starting seed process...');

  // 1. Create Retailers
  const retailerIds: string[] = [];
  for (const name of RETAILER_NAMES) {
    const email = `retailer_${name.toLowerCase().replace(/\s/g, '')}@test.com`;
    console.log(`Creating retailer: ${name} (${email})...`);
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        role: 'retailer',
        full_name: `${name} Admin`,
        store_name: name,
        store_description: `Official store for ${name}. Quality products guaranteed.`
      }
    });

    if (authError) {
      console.error(`Error creating retailer ${name}:`, authError.message);
      continue;
    }
    if (authUser.user) retailerIds.push(authUser.user.id);
  }

  // 2. Create Customers
  console.log('Creating 10 customers...');
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email();
    await supabase.auth.admin.createUser({
      email,
      password: 'password123',
      email_confirm: true,
      user_metadata: {
        role: 'customer',
        full_name: faker.person.fullName()
      }
    });
  }

  // 3. Create Products
  console.log('Creating 20 products...');
  for (let i = 0; i < 20; i++) {
    const retailerId = faker.helpers.arrayElement(retailerIds);
    const category = faker.helpers.arrayElement(CATEGORIES);
    const price = parseFloat(faker.commerce.price({ min: 199, max: 9999 }));
    const originalPrice = price + parseFloat(faker.commerce.price({ min: 50, max: 2000 }));
    const name = faker.commerce.productName();

    const { error: productError } = await supabase.from('products').insert({
      retailer_id: retailerId,
      name,
      description: faker.commerce.productDescription(),
      price,
      original_price: originalPrice,
      category,
      image_url: `https://picsum.photos/seed/${faker.string.uuid()}/400/300`,
      stock_count: faker.number.int({ min: 0, max: 50 }),
      rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
      review_count: faker.number.int({ min: 5, max: 500 }),
      is_active: true
    });

    if (productError) {
      console.error(`Error creating product ${name}:`, productError.message);
    }
  }

  console.log('✅ Seeding complete!');
}

seed().catch(console.error);
