-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Seed Admin User with bcrypt-hashed password
INSERT INTO users (username, password)
VALUES 
  ('', crypt('', gen_salt('bf')));
  
-- Seed Sample Opportunities
INSERT INTO opportunities (
    notice_id, title, solicitation_number, full_parent_path_name, posted_date, 
    type, base_type, archive_type, archive_date, response_deadline, 
    naics_code, classification_code, active, description, organization_type
) 
VALUES 
  ('123456', 'Cloud Services Contract', 'SOL123', '/IT Services/Cloud', '2025-02-15', 
   'Solicitation', 'Opportunity', 'Manual', '2025-04-30', '2025-03-15 17:00:00', 
   '541512', 'D', TRUE, 'Cloud infrastructure services for federal agency.', 'Federal');

-- Seed Sample Contacts
INSERT INTO contacts (opportunity_id, type, full_name, email, phone, fax)
VALUES 
  (1, 'Primary', 'John Doe', 'john.doe@example.gov', '+1-202-555-1234', '+1-202-555-5678');

-- Seed Sample Awards
INSERT INTO awards (
    opportunity_id, award_date, award_number, amount, 
    awardee_name, awardee_city, awardee_state_code, 
    awardee_state_name, awardee_zip, awardee_country_code, 
    awardee_country_name, awardee_uei_sam, awardee_cage_code
) 
VALUES 
  (1, '2025-03-01', 'AWD-2025-001', 1500000.00, 
   'Tech Solutions LLC', 'Arlington', 'VA', 
   'Virginia', '22201', 'US', 
   'United States', 'UEI12345', 'CAGE1234');

-- Seed Sample Opportunity Links
INSERT INTO opportunity_links (opportunity_id, link_type, url)
VALUES 
  (1, 'Solicitation', 'https://sam.gov/opp/123456/details'),
  (1, 'Questions and Answers', 'https://sam.gov/opp/123456/qna');
