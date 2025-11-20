-- Corrected business_profile table schema
-- Use this if you need to recreate the table from scratch

CREATE TABLE IF NOT EXISTS business_profile (
    business_id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    business_location VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,  -- Fixed: was 225, now 255
    CAC_number VARCHAR(255) NOT NULL,
    business_type VARCHAR(255) NOT NULL,
    address TEXT,
    password VARCHAR(255) NOT NULL,  -- Fixed: was 50, now 255 for bcrypt hashes
    account_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    activation_code VARCHAR(10) NULL,
    activation_expires DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    business_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (account_status),
    INDEX idx_cac (CAC_number),
    INDEX idx_email (email)  -- Added index for email lookups
);

