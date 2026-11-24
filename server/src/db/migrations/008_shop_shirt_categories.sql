-- A fresh database gets these categories from the catalog seed.
-- Add them to existing catalogs without changing legacy categories or products.
INSERT INTO categories (key, title, short_title, mobile_title, image, bg_image, sort_order)
SELECT collection.key, collection.title, collection.title, to_jsonb(ARRAY[collection.title]),
       collection.image, collection.image, collection.sort_order
FROM (VALUES
  ('plain-formal-shirts', 'Plain Formal Shirts', '/banners/shop_hero_banner_hd.jpg', 10),
  ('stripe-cotton-shirts', 'Stripe Cotton Shirts', '/bengal_stripe_flatlay_macro.jpg', 11),
  ('executive-linen-shirts', 'Executive Linen Shirts', '/banners/shop_hero_nature_linen.jpg', 12),
  ('handcrafted-shirts', 'Handcrafted Shirts', '/about_atelier_heritage.jpg', 13)
) AS collection(key, title, image, sort_order)
WHERE EXISTS (SELECT 1 FROM categories)
ON CONFLICT (key) DO NOTHING;
