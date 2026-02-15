-- Seed Categories and Subcategories
-- We use fixed UUIDs so that references (like in products) don't break when we reset.

-- 1. Smart Phone
INSERT INTO public.categories (id, name_key, icon_name, slug) 
VALUES ('10000000-0000-0000-0000-000000000001', 'smart_phone', 'DeviceMobile', 'smart-phone');

INSERT INTO public.categories (name_key, icon_name, parent_id, slug) VALUES
('Phone', 'DeviceMobile', '10000000-0000-0000-0000-000000000001', 'phone'),
('Tablet', 'DeviceTablet', '10000000-0000-0000-0000-000000000001', 'tablet'),
('Smart Watch', 'Watch', '10000000-0000-0000-0000-000000000001', 'smart-watch'),
('Phone Accessories', 'Headphones', '10000000-0000-0000-0000-000000000001', 'phone-accessories');

-- 2. Vehicles
INSERT INTO public.categories (id, name_key, icon_name, slug) 
VALUES ('20000000-0000-0000-0000-000000000001', 'vehicles', 'Car', 'vehicles');

INSERT INTO public.categories (name_key, icon_name, parent_id, slug) VALUES
('Car', 'Car', '20000000-0000-0000-0000-000000000001', 'car'),
('Bicycle', 'Bicycle', '20000000-0000-0000-0000-000000000001', 'bicycle'),
('Motorcycle', 'Motorcycle', '20000000-0000-0000-0000-000000000001', 'motorcycle');

-- 3. Beauty
INSERT INTO public.categories (id, name_key, icon_name, slug) 
VALUES ('30000000-0000-0000-0000-000000000001', 'beauty', 'Sparkle', 'beauty');

INSERT INTO public.categories (name_key, icon_name, parent_id, slug) VALUES
('Skin Care', 'Drop', '30000000-0000-0000-0000-000000000001', 'skin-care'),
('Hair Care', 'Scissors', '30000000-0000-0000-0000-000000000001', 'hair-care');

-- 4. Furniture
INSERT INTO public.categories (id, name_key, icon_name, slug) 
VALUES ('40000000-0000-0000-0000-000000000001', 'furniture', 'Armchair', 'furniture');

INSERT INTO public.categories (name_key, icon_name, parent_id, slug) VALUES
('Tables & Desks', 'Desk', '40000000-0000-0000-0000-000000000001', 'tables-desks'),
('Chairs & Sofas', 'Armchair', '40000000-0000-0000-0000-000000000001', 'chairs-sofas'),
('Beds & Mattresses', 'Bed', '40000000-0000-0000-0000-000000000001', 'beds-mattresses');

-- 5. Clothing
INSERT INTO public.categories (id, name_key, icon_name, slug) 
VALUES ('50000000-0000-0000-0000-000000000001', 'clothing', 'TShirt', 'clothing');

INSERT INTO public.categories (name_key, icon_name, parent_id, slug) VALUES
('Women''s Fashion', 'Dress', '50000000-0000-0000-0000-000000000001', 'womens-fashion'),
('Men''s Fashion', 'TShirt', '50000000-0000-0000-0000-000000000001', 'mens-fashion');

-- 6. Computer
INSERT INTO public.categories (id, name_key, icon_name, slug) 
VALUES ('60000000-0000-0000-0000-000000000001', 'computer', 'Laptop', 'computer');

INSERT INTO public.categories (name_key, icon_name, parent_id, slug) VALUES
('Laptop', 'Laptop', '60000000-0000-0000-0000-000000000001', 'laptop'),
('Desktop', 'Desktop', '60000000-0000-0000-0000-000000000001', 'desktop');

-- 7. Real Estate
INSERT INTO public.categories (id, name_key, icon_name, slug) 
VALUES ('70000000-0000-0000-0000-000000000001', 'real_estates', 'House', 'real-estate');

INSERT INTO public.categories (name_key, icon_name, parent_id, slug) VALUES
('Land', 'MapPin', '70000000-0000-0000-0000-000000000001', 'land'),
('House', 'House', '70000000-0000-0000-0000-000000000001', 'house-for-sale');

-- 8. Electronic
INSERT INTO public.categories (id, name_key, icon_name, slug) 
VALUES ('80000000-0000-0000-0000-000000000001', 'electronic', 'Lightning', 'electronic');

INSERT INTO public.categories (name_key, icon_name, parent_id, slug) VALUES
('Washing Machines', 'WashingMachine', '80000000-0000-0000-0000-000000000001', 'washing-machines'),
('TVs & Audio', 'Television', '80000000-0000-0000-0000-000000000001', 'tv-audio');
