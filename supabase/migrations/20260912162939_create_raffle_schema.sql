/*
# Etaye Raffle Platform Schema

Creates the core database tables for the Etaye premium raffle platform where users
can browse luxury car and house raffles, select their lucky numbers, and view
winners of closed raffles.

1. New Tables
- `raffles`: Stores all raffle listings (cars and houses)
  - id (uuid, primary key)
  - title (text, not null) — raffle title
  - subtitle (text) — short tagline
  - description (text) — detailed description
  - image_url (text, not null) — main listing image
  - category (text, not null) — 'car' or 'house'
  - ticket_price (numeric, not null) — price per number entry
  - max_numbers (int, not null) — total available numbers
  - status (text, not null) — 'open' or 'closed'
  - end_date (timestamptz) — when raffle closes for entries
  - draw_date (timestamptz) — when winner is drawn
  - winner_name (text) — winner's name (set when closed)
  - winner_number (int) — winning number (set when closed)
  - prize_value (text) — display value of the prize
  - specs (jsonb) — specifications (year/make/model for cars; beds/baths/sqft for houses)
  - created_at (timestamptz)

- `tickets`: Stores number selections per raffle
  - id (uuid, primary key)
  - raffle_id (uuid, foreign key to raffles, cascade delete)
  - number (int, not null) — selected number
  - buyer_name (text) — name of entrant
  - buyer_email (text) — email of entrant
  - purchased_at (timestamptz)
  - Unique constraint on (raffle_id, number) — no duplicate numbers per raffle

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD — single-tenant public app (no sign-in screen).
  Data is intentionally shared/public so anyone can browse raffles and claim numbers.
*/

CREATE TABLE IF NOT EXISTS raffles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  image_url text NOT NULL,
  category text NOT NULL DEFAULT 'car',
  ticket_price numeric(10,2) NOT NULL DEFAULT 10,
  max_numbers int NOT NULL DEFAULT 1000,
  status text NOT NULL DEFAULT 'open',
  end_date timestamptz,
  draw_date timestamptz,
  winner_name text,
  winner_number int,
  prize_value text,
  specs jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE raffles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_raffles" ON raffles;
CREATE POLICY "anon_select_raffles" ON raffles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_raffles" ON raffles;
CREATE POLICY "anon_insert_raffles" ON raffles FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_raffles" ON raffles;
CREATE POLICY "anon_update_raffles" ON raffles FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_raffles" ON raffles;
CREATE POLICY "anon_delete_raffles" ON raffles FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raffle_id uuid REFERENCES raffles(id) ON DELETE CASCADE,
  number int NOT NULL,
  buyer_name text,
  buyer_email text,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(raffle_id, number)
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tickets" ON tickets;
CREATE POLICY "anon_select_tickets" ON tickets FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tickets" ON tickets;
CREATE POLICY "anon_insert_tickets" ON tickets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tickets" ON tickets;
CREATE POLICY "anon_update_tickets" ON tickets FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tickets" ON tickets;
CREATE POLICY "anon_delete_tickets" ON tickets FOR DELETE
  TO anon, authenticated USING (true);
