CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    prep_time_minutes INT NOT NULL,
    cook_time_minutes INT NOT NULL,
    servings INT NOT NULL,
    view_count INT NOT NULL DEFAULT 0,
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    status recipe_status DEFAULT 'pending',
    rejection_reason TEXT DEFAULT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_recipes_deleted_at ON recipes (deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_recipes_status
ON recipes(status) WHERE status = 'approved';

CREATE TABLE IF NOT EXISTS ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS instructions (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL,
    image_url VARCHAR(500) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes_categories (
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, category_id) 
);

CREATE TYPE user_role AS ENUM ('user', 'admin')

CREATE TYPE recipe_status AS ENUM ('pending','approved','rejected')

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) DEFAULT NULL,
    role user_role DEFAULT 'user',
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255) DEFAULT NULL,
    email_verification_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    reset_otp_hash VARCHAR(255) DEFAULT NULL,
    reset_otp_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    reset_otp_attempts INT DEFAULT 0,
    reset_otp_locked_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    google_id VARCHAR(255) UNIQUE DEFAULT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    auth_provider VARCHAR(50) DEFAULT 'local',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;

-- Migration for existing database instances:
-- ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE DEFAULT NULL;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500) DEFAULT NULL;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'local';
-- CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;

CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE INDEX IF NOT EXISTS idx_recipes_unaccent_title 
ON recipes (unaccent(LOWER(title)) varchar_pattern_ops);

CREATE INDEX idx_recipes_view_count ON recipes (view_count DESC);