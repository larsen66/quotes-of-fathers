-- Test Data for "Цитаты Отцов" Project
-- Insert sample fathers and quotes to test the system

-- Insert test fathers
INSERT INTO fathers (id, name_ka, name_ru, bio_ka, bio_ru, avatar_url, profile_image_url, "order", deleted)
VALUES 
  (
    'f1111111-1111-1111-1111-111111111111'::uuid,
    'წმინდა ანტონი დიდი',
    'Антоний Великий',
    'ეგვიპტელი ბერი და მამა',
    'Египетский монах и отец',
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png',
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-1.png',
    1,
    false
  ),
  (
    'f2222222-2222-2222-2222-222222222222'::uuid,
    'წმინდა სერაფიმე სარავალი',
    'Серафим Саровский',
    'რუსი მონაზონი და სულიერი მოძღვარი',
    'Русский монах и духовный наставник',
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-2.png',
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-2.png',
    2,
    false
  ),
  (
    'f3333333-3333-3333-3333-333333333333'::uuid,
    'წმინდა იოანე ოქროპირი',
    'Иоанн Златоуст',
    'კონსტანტინოპოლის პატრიარქი',
    'Патриарх Константинопольский',
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-3.png',
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-3.png',
    3,
    false
  ),
  (
    'f4444444-4444-4444-4444-444444444444'::uuid,
    'ღვთისმშობელი მარიამი',
    'Пресвятая Богородица',
    'ქრისტეს დედა, ყოვლადწმიდა ღვთისმშობელი',
    'Матерь Христа, Пресвятая Богородица',
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-4.png',
    'https://kprqbfxzbclouateifeh.supabase.co/storage/v1/object/public/fathers/father-4.png',
    4,
    false
  )
ON CONFLICT (id) DO UPDATE SET
  name_ka = EXCLUDED.name_ka,
  name_ru = EXCLUDED.name_ru,
  bio_ka = EXCLUDED.bio_ka,
  bio_ru = EXCLUDED.bio_ru,
  avatar_url = EXCLUDED.avatar_url,
  profile_image_url = EXCLUDED.profile_image_url,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- Insert test quotes
INSERT INTO quotes (id, father_id, text_ka, text_ru, source_ka, source_ru, quote_date, tags, is_published, deleted)
VALUES
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'f1111111-1111-1111-1111-111111111111'::uuid,
    'ვინც იცის საკუთარი თავი, იცის ღმერთი',
    'Кто познал себя, тот познал Бога',
    'წერილები',
    'Письма',
    '2024-01-01',
    ARRAY['faith', 'knowledge'],
    true,
    false
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'f1111111-1111-1111-1111-111111111111'::uuid,
    'ლოცვა არის სულის სუნთქვა',
    'Молитва есть дыхание души',
    'მოძღვრებანი',
    'Поучения',
    '2024-01-02',
    ARRAY['prayer'],
    true,
    false
  ),
  (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'f2222222-2222-2222-2222-222222222222'::uuid,
    'მოიპოვე სულიერი მშვიდობა და ათასობით გადაარჩენს შენ გარშემო',
    'Стяжи дух мирен, и тысячи вокруг тебя спасутся',
    'საუბრები',
    'Беседы',
    '2024-01-03',
    ARRAY['peace', 'salvation'],
    true,
    false
  ),
  (
    '44444444-4444-4444-4444-444444444444'::uuid,
    'f2222222-2222-2222-2222-222222222222'::uuid,
    'სიხარული არის ღვთის მადლის ნიშანი',
    'Радость есть признак благодати Божией',
    'დღიური',
    'Дневник',
    '2024-01-04',
    ARRAY['joy'],
    true,
    false
  ),
  (
    '55555555-5555-5555-5555-555555555555'::uuid,
    'f3333333-3333-3333-3333-333333333333'::uuid,
    'არაფერი ისე არ აძლიერებს სიყვარულს, როგორც ლოცვა',
    'Ничто так не укрепляет любовь, как молитва',
    'ქადაგებები',
    'Проповеди',
    '2024-01-05',
    ARRAY['love', 'prayer'],
    true,
    false
  ),
  (
    '66666666-6666-6666-6666-666666666666'::uuid,
    'f3333333-3333-3333-3333-333333333333'::uuid,
    'მოთმინება არის ყველა სათნოების დედა',
    'Терпение есть мать всех добродетелей',
    'წერილები',
    'Письма',
    '2024-01-06',
    ARRAY['patience', 'virtue'],
    true,
    false
  ),
  (
    '77777777-7777-7777-7777-777777777777'::uuid,
    'f1111111-1111-1111-1111-111111111111'::uuid,
    'ეშმაკი ეშინია სავარჯიშო და განდგომილი სული',
    'Дьявол боится трезвой и бодрствующей души',
    'სიტყვები',
    'Слова',
    '2024-01-07',
    ARRAY['vigilance'],
    true,
    false
  ),
  (
    '88888888-8888-8888-8888-888888888888'::uuid,
    'f2222222-2222-2222-2222-222222222222'::uuid,
    'ღმერთი არის სიყვარული',
    'Бог есть любовь',
    'საუბრები',
    'Беседы',
    '2024-01-08',
    ARRAY['love', 'god'],
    true,
    false
  ),
  (
    '99999999-9999-9999-9999-999999999999'::uuid,
    'f3333333-3333-3333-3333-333333333333'::uuid,
    'ნუ განსჯით და არ განიკითხებით',
    'Не судите, да не судимы будете',
    'ქადაგებები',
    'Проповеди',
    NULL,
    ARRAY['judgement'],
    true,
    false
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'f1111111-1111-1111-1111-111111111111'::uuid,
    'ყოველი დღე არის ახალი საჩუქარი ღმერთისგან',
    'Каждый день - новый дар от Бога',
    NULL,
    NULL,
    '2024-01-10',
    ARRAY['gratitude', 'life'],
    true,
    false
  )
ON CONFLICT (id) DO UPDATE SET
  text_ka = EXCLUDED.text_ka,
  text_ru = EXCLUDED.text_ru,
  source_ka = EXCLUDED.source_ka,
  source_ru = EXCLUDED.source_ru,
  quote_date = EXCLUDED.quote_date,
  tags = EXCLUDED.tags,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Update app_settings with subscriber count
UPDATE app_settings
SET subscriber_count = 1000
WHERE id = 1;

-- Verify inserted data
SELECT 'Fathers inserted:' as info, COUNT(*) as count FROM fathers WHERE deleted = false;
SELECT 'Quotes inserted:' as info, COUNT(*) as count FROM quotes WHERE deleted = false AND is_published = true;
SELECT 'Subscriber count:' as info, subscriber_count FROM app_settings WHERE id = 1;
