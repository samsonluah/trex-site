-- ============================================
-- TREX Athletics Club — Initial Database Schema
-- ============================================

-- Products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  price numeric(10,2) not null,
  stripe_price_id text,
  images text[] not null default '{}',
  category text not null check (category in ('apparel', 'accessories')),
  sizes text[] default null,
  in_stock boolean not null default true,
  pre_order boolean not null default false,
  stock_quantity integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  items jsonb not null,
  total_amount numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  stripe_session_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Gallery images table
create table public.gallery_images (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  storage_path text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_products_slug on public.products(slug);
create index idx_products_category on public.products(category);
create index idx_orders_status on public.orders(status);
create index idx_orders_stripe_session on public.orders(stripe_session_id);
create index idx_orders_created_at on public.orders(created_at desc);

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at();

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.update_updated_at();

-- ============================================
-- Row Level Security
-- ============================================

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.gallery_images enable row level security;

-- Products: public read
create policy "Products are viewable by everyone"
  on public.products for select using (true);

-- Orders: public insert (checkout creates orders), service role for everything else
create policy "Orders can be inserted by anyone"
  on public.orders for insert with check (true);

create policy "Orders are readable by service role"
  on public.orders for select using (auth.role() = 'service_role');

create policy "Orders are updatable by service role"
  on public.orders for update using (auth.role() = 'service_role');

-- Gallery: public read
create policy "Gallery images are viewable by everyone"
  on public.gallery_images for select using (true);

-- ============================================
-- Storage buckets
-- ============================================

insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

-- Storage: public read for both buckets
create policy "Gallery images are publicly readable"
  on storage.objects for select using (bucket_id = 'gallery');

create policy "Product images are publicly readable"
  on storage.objects for select using (bucket_id = 'product-images');

-- Storage: service role can upload/delete
create policy "Service role can manage gallery"
  on storage.objects for insert with check (bucket_id = 'gallery');

create policy "Service role can delete gallery"
  on storage.objects for delete using (bucket_id = 'gallery');

create policy "Service role can manage product images"
  on storage.objects for insert with check (bucket_id = 'product-images');

create policy "Service role can delete product images"
  on storage.objects for delete using (bucket_id = 'product-images');

-- ============================================
-- Seed data
-- ============================================

insert into public.products (name, slug, description, long_description, price, stripe_price_id, images, category, sizes, in_stock, pre_order, sort_order)
values
  (
    'ORIGIN T-Shirt',
    'origin-tshirt',
    'Lightweight cotton T-shirt in acid-washed black, with our ORIGIN logo printed on the back.',
    'Our signature ORIGIN T-shirt is made from lightweight cotton for maximum comfort on and off the track. Features the TREX Athletics Club ORIGIN logo on the back.',
    29.99,
    'price_1R6SfLRsScX4UO9PZVpizuTQ',
    ARRAY['/origin1.jpg', '/origin2.jpg', '/origin3.jpg', '/origin4.jpg'],
    'apparel',
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    true,
    true,
    1
  ),
  (
    'Sticker Pack V1',
    'sticker-pack',
    'Set of waterproof vinyl stickers featuring TREX Athletics Club logos and designs.',
    'Add some TREX to your gear. This pack includes waterproof vinyl stickers perfect for water bottles, laptops, and more.',
    6.00,
    'price_1R6TOfRsScX4UO9PPtjyVh7D',
    ARRAY['/sticker1.jpg', '/sticker2.jpg', '/sticker3.jpg', '/sticker4.jpg', '/sticker5.jpg'],
    'accessories',
    null,
    true,
    false,
    2
  );
