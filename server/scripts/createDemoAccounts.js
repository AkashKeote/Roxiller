const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'store_ratings_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  max: 20
});

const createDemoAccounts = async () => {
  try {
    console.log('🚀 Creating demo accounts...');

    // Demo accounts data
    const demoAccounts = [
      {
        name: 'System Administrator Demo Account',
        email: 'admin@store.com',
        password: 'Admin123!',
        address: '123 Admin Street, Admin City, AC 12345',
        role: 'system_admin'
      },
      {
        name: 'Store Owner Demo Account User',
        email: 'owner@store.com',
        password: 'Owner123!',
        address: '456 Owner Street, Owner City, OC 67890',
        role: 'store_owner'
      },
      {
        name: 'Normal User Demo Account User',
        email: 'user@store.com',
        password: 'User123!',
        address: '789 User Street, User City, UC 13579',
        role: 'normal_user'
      }
    ];

    for (const account of demoAccounts) {
      // Check if account already exists
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [account.email]);
      
      if (existingUser.rows.length === 0) {
        // Hash password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(account.password, 10);
        
        // Insert user
        await pool.query(`
          INSERT INTO users (name, email, password_hash, address, role)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          account.name,
          account.email,
          hashedPassword,
          account.address,
          account.role
        ]);
        
        console.log(`✅ Created ${account.role}: ${account.email}`);
      } else {
        console.log(`ℹ️  ${account.email} already exists, skipping...`);
      }
    }

    // Create some sample stores for the store owner
    const storeOwner = await pool.query('SELECT id FROM users WHERE email = $1', ['owner@store.com']);
    
    if (storeOwner.rows.length > 0) {
      const ownerId = storeOwner.rows[0].id;
      
      // Check if stores already exist
      const existingStores = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [ownerId]);
      
      if (existingStores.rows.length === 0) {
        // Create sample stores
        const sampleStores = [
          {
            name: 'EcoMart',
            email: 'ecomart@store.com',
            address: '123 Green Street, Eco City, EC 12345'
          },
          {
            name: 'Organic Foods',
            email: 'organic@store.com',
            address: '456 Nature Road, Organic City, OC 67890'
          },
          {
            name: 'Sustainable Living',
            email: 'sustainable@store.com',
            address: '789 Eco Avenue, Green City, GC 13579'
          }
        ];

        for (const store of sampleStores) {
          await pool.query(`
            INSERT INTO stores (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4)
          `, [store.name, store.email, store.address, ownerId]);
          
          console.log(`🏪 Created store: ${store.name}`);
        }
      }
    }

    console.log('\n🎉 Demo accounts setup completed!');
    console.log('\n📋 Demo Account Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin: admin@store.com / Admin123!');
    console.log('🏪 Store Owner: owner@store.com / Owner123!');
    console.log('👤 User: user@store.com / User123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error creating demo accounts:', error);
  } finally {
    await pool.end();
  }
};

createDemoAccounts();
