-- Personal profile table schema
-- Use this to create the personal_profile table for individual user registrations

CREATE TABLE IF NOT EXISTS personal_profile (
    personal_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nin_number VARCHAR(255) NOT NULL,
    address TEXT,
    password VARCHAR(255) NOT NULL,  -- For bcrypt hashes (255 characters)
    account_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    activation_code VARCHAR(10) NULL,
    activation_expires DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    personal_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (account_status),
    INDEX idx_nin (nin_number),
    INDEX idx_email (email),
    INDEX idx_phone (phone_number),
    UNIQUE KEY unique_email (email),
    UNIQUE KEY unique_nin (nin_number),
    UNIQUE KEY unique_phone (phone_number)
);

