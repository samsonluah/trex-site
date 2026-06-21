-- Add storefront visibility and delivery fields used by checkout fulfillment.

alter table public.products
  add column if not exists visible boolean not null default true;

alter table public.orders
  add column if not exists shipping_name text,
  add column if not exists shipping_address jsonb;
