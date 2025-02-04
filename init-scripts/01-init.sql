-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Opportunities Table
CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    notice_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    solicitation_number TEXT,
    full_parent_path_name TEXT,
    posted_date DATE NOT NULL,
    type TEXT NOT NULL,
    base_type TEXT NOT NULL,
    archive_type TEXT,
    archive_date DATE,
    response_deadline TIMESTAMP,
    naics_code TEXT,
    classification_code TEXT,
    active BOOLEAN DEFAULT TRUE,
    description TEXT,
    organization_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Addresses Table (Office & Performance Locations)
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    zipcode TEXT,
    city TEXT,
    state_code TEXT,
    state_name TEXT,
    country_code TEXT,
    country_name TEXT
);

-- Create Contacts Table (Primary & Secondary Contacts)
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE CASCADE,
    type TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    fax TEXT
);

-- Create Awards Table (Awarded Contractors)
CREATE TABLE IF NOT EXISTS awards (
    id SERIAL PRIMARY KEY,
    opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE CASCADE,
    award_date DATE,
    award_number TEXT,
    amount NUMERIC(15,2),
    awardee_name TEXT,
    awardee_city TEXT,
    awardee_state_code TEXT,
    awardee_state_name TEXT,
    awardee_zip TEXT,
    awardee_country_code TEXT,
    awardee_country_name TEXT,
    awardee_uei_sam TEXT,
    awardee_cage_code TEXT
);

-- Create Links Table (Related URLs)
CREATE TABLE IF NOT EXISTS opportunity_links (
    id SERIAL PRIMARY KEY,
    opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE CASCADE,
    link_type TEXT,
    url TEXT NOT NULL
);
