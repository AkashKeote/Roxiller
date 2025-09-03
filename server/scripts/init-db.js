const pool = require('../config/database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    console.log('✅ Database schema created successfully');
    
    // Create default admin user with proper password hash
    const adminPassword = 'Admin@123'; // Change this in production
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
    
    await pool.query(`
      UPDATE users 
      SET password_hash = $1 
      WHERE email = 'admin@system.com'
    `, [passwordHash]);
    
    console.log('✅ Default admin user created');
    console.log('📧 Admin Email: admin@system.com');
    console.log('🔑 Admin Password: Admin@123');
    
    // Insert some sample data for testing
    await insertSampleData();
    
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  try {
    // Insert sample normal users
    const userPassword = await bcrypt.hash('User@123', 10);
    await pool.query(`
      INSERT INTO users (name, email, password_hash, address, role) VALUES 
      ('John Doe - Normal User Example', 'user@example.com', $1, '123 Main Street, Example City, EC 12345', 'normal_user'),
      ('Jane Smith - Another Normal User', 'jane@example.com', $1, '456 Oak Avenue, Sample Town, ST 67890', 'normal_user')
      ON CONFLICT (email) DO NOTHING
    `, [userPassword]);
    
    // Insert sample store owners
    const storeOwnerPassword = await bcrypt.hash('Store@123', 10);
    await pool.query(`
      INSERT INTO users (name, email, password_hash, address, role) VALUES 
      ('Mike Johnson - Store Owner Example', 'store@example.com', $1, '789 Business Blvd, Commerce City, CC 11111', 'store_owner'),
      ('Sarah Wilson - Another Store Owner', 'sarah@example.com', $1, '321 Retail Road, Market Town, MT 22222', 'store_owner')
      ON CONFLICT (email) DO NOTHING
    `, [storeOwnerPassword]);
    
    // Insert sample stores
    await pool.query(`
      INSERT INTO stores (name, email, address, owner_id) VALUES 
      ('Green Grocery Store', 'green@store.com', '100 Eco Street, Green City, GC 33333', 
       (SELECT id FROM users WHERE email = 'store@example.com')),
      ('Organic Market', 'organic@market.com', '200 Nature Way, Organic Town, OT 44444', 
       (SELECT id FROM users WHERE email = 'sarah@example.com'))
      ON CONFLICT (email) DO NOTHING
    `;
    
    // Insert sample ratings
    await pool.query(`
      INSERT INTO ratings (user_id, store_id, rating, comment) VALUES 
      ((SELECT id FROM users WHERE email = 'user@example.com'), 
       (SELECT id FROM stores WHERE email = 'green@store.com'), 5, 'Great eco-friendly products!'),
      ((SELECT id FROM users WHERE email = 'jane@example.com'), 
       (SELECT id FROM stores WHERE email = 'green@store.com'), 4, 'Good selection of organic items'),
      ((SELECT id FROM users WHERE email = 'user@example.com'), 
       (SELECT id FROM stores WHERE email = 'organic@market.com'), 5, 'Excellent quality and service')
      ON CONFLICT (user_id, store_id) DO NOTHING
    `;
    
    console.log('✅ Sample data inserted successfully');
    
  } catch (error) {
    console.error('❌ Sample data insertion failed:', error);
  }
}

// Run initialization
initializeDatabase();
