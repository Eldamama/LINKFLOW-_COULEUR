DROP TABLE IF EXISTS user_opportunity_links CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (

 id BIGSERIAL PRIMARY KEY,

 email VARCHAR(255)
 UNIQUE NOT NULL,

 password_hash TEXT NOT NULL,

 invitation_code VARCHAR(20)
 UNIQUE NOT NULL,

 sponsor_id BIGINT
 REFERENCES users(id)
 ON DELETE SET NULL,

 preferred_language VARCHAR(5)
 DEFAULT 'fr',

 is_root BOOLEAN
 DEFAULT false,

 created_at TIMESTAMP
 DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE opportunities (

 id BIGSERIAL PRIMARY KEY,

 name VARCHAR(255) NOT NULL,

 base_url TEXT NOT NULL,

 status VARCHAR(20)
 DEFAULT 'active'

);

CREATE TABLE user_opportunity_links (

 id BIGSERIAL PRIMARY KEY,

 user_id BIGINT
 REFERENCES users(id)
 ON DELETE CASCADE,

 opportunity_id BIGINT
 REFERENCES opportunities(id)
 ON DELETE CASCADE,

 target_wallet TEXT,

 payment_hash TEXT UNIQUE,

 payment_network VARCHAR(20)
 DEFAULT 'BEP20',

 payment_amount DECIMAL(10,2)
 DEFAULT 2.03,

 payment_verified BOOLEAN
 DEFAULT false,

 personal_link TEXT,

 validated BOOLEAN
 DEFAULT false,

 approved_by_genealogy BOOLEAN
 DEFAULT false,

 created_at TIMESTAMP
 DEFAULT CURRENT_TIMESTAMP

);

INSERT INTO users(

 email,
 password_hash,
 invitation_code,
 is_root

)

VALUES(

 'root@pointfocal.app',
 'ROOT_PASSWORD',
 'ABCD1000',
 true

);

INSERT INTO opportunities(

 name,
 base_url,
 status

)

VALUES

(
 'Victory Automatic',
 'https://victoryautomatic.com',
 'active'
),

(
 'Victory World Club',
 'https://victoryworld.club',
 'active'
);