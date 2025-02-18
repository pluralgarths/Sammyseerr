DO $$ 
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE ROLE "$DB_USER" WITH LOGIN SUPERUSER PASSWORD '$DB_PASSWORD';
   ELSE
      ALTER USER "$DB_USER" WITH PASSWORD '$DB_PASSWORD';
   END IF;
END $$;


CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE opportunities ALTER COLUMN type SET DEFAULT 'Uncategorized';

-- Create Opportunities Table if not exists
CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    notice_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    solicitation_number VARCHAR(100),
    full_parent_path_name VARCHAR(500),
    posted_date DATE,
    type VARCHAR(50) NOT NULL,  -- Ensure NOT NULL constraint is defined
    base_type VARCHAR(50),
    archive_type VARCHAR(50),
    archive_date DATE,
    response_deadline TIMESTAMP,
    naics_code VARCHAR(20),
    classification_code VARCHAR(20),
    active BOOLEAN,
    description TEXT,
    organization_type VARCHAR(100)
);
