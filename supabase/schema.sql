-- ============================================================
-- MAMASITA – Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Customers
create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  created_at  timestamptz default now()
);

-- 2. Menu Items (seed below)
create table if not exists menu_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(6,2) not null,
  category    text,        -- 'quick_bite' | 'custom_build' | 'drink'
  image_url   text,
  available   boolean default true
);

-- 3. Orders
create table if not exists orders (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid references customers(id),
  status       text default 'received',  -- received | prepping | cooking | ready | delivered
  subtotal     numeric(8,2) default 0,
  tax          numeric(8,2) default 0,
  total        numeric(8,2) default 0,
  created_at   timestamptz default now()
);

-- 4. Order Line Items
create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid references orders(id) on delete cascade,
  menu_item_id  uuid references menu_items(id),
  quantity      int default 1,
  unit_price    numeric(6,2) not null,
  custom_build  jsonb,   -- { base, protein, sauce } for build-your-own
  created_at    timestamptz default now()
);

-- ============================================================
-- Seed: Quick Bite menu items
-- ============================================================
insert into menu_items (name, description, price, category, image_url) values
  ('Tikka Taco',   'Classic tikka in a crispy taco shell',          5.50, 'quick_bite', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD96K-LW9ZggpCqOkXqCWW8zmLYIn8kpQ0EDr2r18ZPK4wYMY01sba8g4DCBSOvFh_4JbAUFBynmDfxZO945QiNe1UvQSjpF8lSXaJ5jcs-ZW3rr7xooZY7xZna5nB0QK5PYBZQ4qXVRWqVafGRfWeIgWR589X0MucXiEgx7Gb9z1Tmj4-8WlvbJzmqXjDqjzTby3NBpSR8SBoJwwZdHdh4BVNZEMedn9tZO7n8T8P-NItH-i0yv4aYxWTcAWUGCldOT0qPCKjxt5Y'),
  ('Paneer Wrap',  'Spiced paneer in a soft wheat wrap',             8.25, 'quick_bite', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA-FLLU7m5zpzrijtQPalmb1Q1WHEDnhrEZu8Fv5pfZX17dxMGYU3wtTljEyjn7u-la__IkiEw5Zfw6PGUvgJw4v3No9E2WBuDmO61Sd-JPXz9Xue6XwgOogE71A6tErqHppESyCkEjwma8qV6hMsggS-vDJwJ3Mvh5ezeXNnekTv_uFBeK9ep9jwXKc2_Cgs-i94eNNTjX78TAWVgDEaPx7eMVQlUTNSBpoWDKcmp5dgIlACfSbCpP3GT_XQd4eXc1GrAPodIUv4'),
  ('Masala Fries', 'Crispy fries tossed in masala spice blend',     4.00, 'quick_bite', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqf9mytdOJtqf3E-PfPOW7IncJ_yJsjKbeaClrJc0rJ9B-kJyrZzqhqAiGzGcyW9sFt51u3qjeFUNQzd1xkRbxPoWxnvobwnzKHUqCB-akjZ1O83ZhW_X2dAKsb7t5zAJCBvXe1-xks_KOE9VQRmjhsC208aSA8hbWBKLnU3hML-71b2ZNPuZva3rXaw-x8mqlqYza1fRjUYsEIAOPCvV5bl5sGqDVTeW27CKQJ_ylro83fJ1EjtYqDAXxWxwKkPfVCb5r58lruyI'),
  ('Mango Lassi',  'Sweet & creamy mango yogurt drink',              3.50, 'drink',      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZPx7x66yPkqSbnCb5F-1D7PlFrGxYJ9fO2Pwd8ng_AwMX6pdaiBrFeqNhUAgLYa4pDv6TelrQPkRpy7vg-QHRTbfPUqnL_DP59K7Ju-4Anw9ySuURPBj1yR8Ii7jdTZFW3cWoHzo3UVk6tbs4l3Mz5qlrz2ujVJCjy1YhQdQdtRiOMJfpnmLFHCYYKMoQe2NjIbmo-i7UuKiYFjS2PGdIvbW-y12qY3Rp43g0aqZx3IvN7TO0fMjoJVFmwWtSK0h73AfN-YeRBxI'),
  ('Custom Build', 'Build your own taco — base, protein & sauce',   9.00, 'custom_build', null)
on conflict do nothing;

-- Enable Row Level Security (open read for menu, customer can only see their orders)
alter table menu_items enable row level security;
alter table customers   enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Public can read menu items
create policy "Public can read menu" on menu_items for select using (true);

-- Anyone can insert a customer (anonymous ordering)
create policy "Anyone can create customer" on customers for insert with check (true);

-- Anyone can create an order
create policy "Anyone can create order" on orders for insert with check (true);

-- Anyone can read orders (needed for order status page)
create policy "Anyone can read orders" on orders for select using (true);

-- Anyone can insert order items
create policy "Anyone can create order items" on order_items for insert with check (true);

-- Anyone can read order items
create policy "Anyone can read order items" on order_items for select using (true);
