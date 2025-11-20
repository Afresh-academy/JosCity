const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true // Allow multiple statements
    });

    console.log('Connected to database');
    console.log('Starting migration...\n');

    // Step 1: Check if full_name column exists in users table
    console.log('Step 1: Checking users table structure...');
    const [usersColumns] = await connection.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'full_name'`,
      [process.env.DB_NAME]
    );

    if (usersColumns.length > 0) {
      console.log('full_name column exists in users table');

      // Step 2: Add new columns to users table
      console.log('\nStep 2: Adding firstname, lastname, and gender columns to users table...');
      try {
        await connection.execute(
          `ALTER TABLE users 
           ADD COLUMN firstname VARCHAR(255) NULL AFTER full_name,
           ADD COLUMN lastname VARCHAR(255) NULL AFTER firstname,
           ADD COLUMN gender ENUM('male', 'female', 'other') NULL AFTER lastname`
        );
        console.log('✓ Added firstname, lastname, and gender columns to users table');
      } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
          console.log('⚠ Columns already exist, skipping...');
        } else {
          throw error;
        }
      }

      // Step 3: Migrate existing data from full_name to firstname and lastname
      console.log('\nStep 3: Migrating existing data from full_name to firstname and lastname...');
      const [updateResult] = await connection.execute(
        `UPDATE users 
         SET firstname = SUBSTRING_INDEX(TRIM(full_name), ' ', 1), 
             lastname = CASE 
               WHEN LOCATE(' ', TRIM(full_name)) > 0 
               THEN SUBSTRING_INDEX(TRIM(full_name), ' ', -1) 
               ELSE '' 
             END
         WHERE full_name IS NOT NULL AND full_name != '' 
           AND (firstname IS NULL OR firstname = '')`
      );
      console.log(`✓ Migrated ${updateResult.affectedRows} records`);

      // Step 4: Drop full_name column from users table
      console.log('\nStep 4: Dropping full_name column from users table...');
      await connection.execute('ALTER TABLE users DROP COLUMN full_name');
      console.log('✓ Dropped full_name column from users table');
    } else {
      console.log('⚠ full_name column does not exist in users table, skipping users table migration');
      
      // Check if new columns exist, if not add them
      const [newColumns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' 
         AND COLUMN_NAME IN ('firstname', 'lastname', 'gender')`,
        [process.env.DB_NAME]
      );

      if (newColumns.length < 3) {
        console.log('\nAdding firstname, lastname, and gender columns to users table...');
        try {
          await connection.execute(
            `ALTER TABLE users 
             ADD COLUMN firstname VARCHAR(255) NULL,
             ADD COLUMN lastname VARCHAR(255) NULL,
             ADD COLUMN gender ENUM('male', 'female', 'other') NULL`
          );
          console.log('✓ Added firstname, lastname, and gender columns to users table');
        } catch (error) {
          console.error('Error adding columns:', error.message);
        }
      }
    }

    // Step 5: Check if pending_approvals table exists and has full_name
    console.log('\nStep 5: Checking pending_approvals table...');
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'pending_approvals'`,
      [process.env.DB_NAME]
    );

    if (tables.length > 0) {
      console.log('✓ pending_approvals table exists');

      const [pendingColumns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'pending_approvals' AND COLUMN_NAME = 'full_name'`,
        [process.env.DB_NAME]
      );

      if (pendingColumns.length > 0) {
        console.log('✓ full_name column exists in pending_approvals table');

        // Add new columns to pending_approvals
        console.log('\nStep 6: Adding firstname and lastname columns to pending_approvals table...');
        try {
          await connection.execute(
            `ALTER TABLE pending_approvals 
             ADD COLUMN firstname VARCHAR(255) NULL AFTER full_name,
             ADD COLUMN lastname VARCHAR(255) NULL AFTER firstname`
          );
          console.log('✓ Added firstname and lastname columns to pending_approvals table');
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠ Columns already exist, skipping...');
          } else {
            throw error;
          }
        }

        // Migrate existing data
        console.log('\nStep 7: Migrating existing data in pending_approvals table...');
        const [pendingUpdateResult] = await connection.execute(
          `UPDATE pending_approvals 
           SET firstname = SUBSTRING_INDEX(TRIM(full_name), ' ', 1), 
               lastname = CASE 
                 WHEN LOCATE(' ', TRIM(full_name)) > 0 
                 THEN SUBSTRING_INDEX(TRIM(full_name), ' ', -1) 
                 ELSE '' 
               END
           WHERE full_name IS NOT NULL AND full_name != '' 
             AND (firstname IS NULL OR firstname = '')`
        );
        console.log(`✓ Migrated ${pendingUpdateResult.affectedRows} records in pending_approvals`);

        // Drop full_name column from pending_approvals
        console.log('\nStep 8: Dropping full_name column from pending_approvals table...');
        await connection.execute('ALTER TABLE pending_approvals DROP COLUMN full_name');
        console.log('✓ Dropped full_name column from pending_approvals table');
      } else {
        console.log('⚠ full_name column does not exist in pending_approvals table, skipping');
        
        // Check if new columns exist, if not add them
        const [pendingNewColumns] = await connection.execute(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'pending_approvals' 
           AND COLUMN_NAME IN ('firstname', 'lastname')`,
          [process.env.DB_NAME]
        );

        if (pendingNewColumns.length < 2) {
          console.log('\nAdding firstname and lastname columns to pending_approvals table...');
          try {
            await connection.execute(
              `ALTER TABLE pending_approvals 
               ADD COLUMN firstname VARCHAR(255) NULL,
               ADD COLUMN lastname VARCHAR(255) NULL`
            );
            console.log('✓ Added firstname and lastname columns to pending_approvals table');
          } catch (error) {
            console.error('Error adding columns:', error.message);
          }
        }
      }
    } else {
      console.log('⚠ pending_approvals table does not exist, skipping');
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the migration
runMigration();

