-- Test Data for "Цитаты Отцов" Project
-- Insert sample fathers and quotes to test the system

-- Clear existing test data (optional - uncomment if needed)
-- DELETE FROM quotes;
-- DELETE FROM fathers;

-- Insert test fathers
INSERT INTO fathers (id, name_ka, name_ru, bio_ka, bio_ru, avatar_url, profile_image_url, "order", deleted)
VALUES 
  (
    'f1111111-1111-1111-1111-111111111111',
    'წმინდა ანტონი დიდი',
    'Антоний Великий',
    'ეგვიპტელი ბერი და მამა',
    'Египетский монах и отец',
    'https://via.placeholder.com/150/0000FF/FFFFFF?text=Father+1',
    'https://via.placeholder.com/300/0000FF/FFFFFF?text=Profile+1',
    1,
    false
  ),
  (
    'f2222222-2222-2222-2222-222222222222',
    'წმინდა სერაფიმე სარავალი',
    'Серафим Саровский',
    'რუსი მონაზონი და სულიერი მოძღვარი',
    'Русский монах и духовный наставник',
    'https://via.placeholder.com/150/FF0000/FFFFFF?text=Father+2',
    'https://via.placeholder.com/300/FF0000/FFFFFF?text=Profile+2',
    2,
    false
  ),
  (
    'f3333333-3333-3333-3333-333333333333',
    'წმინდა იოანე ოქროპირი',
    'Иоанн Златоуст',
    'კონსტანტინოპოლის პატრიარქი',
    'Патриарх Константинопольский',
    'https://via.placeholder.com/150/00FF00/FFFFFF?text=Father+3',
    'https://via.placeholder.com/300/00FF00/FFFFFF?text=Profile+3',
    3,
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
    'q1111111-1111-1111-1111-111111111111',
    'f1111111-1111-1111-1111-111111111111',
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
    'q2222222-2222-2222-2222-222222222222',
    'f1111111-1111-1111-1111-111111111111',
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
    'q3333333-3333-3333-3333-333333333333',
    'f2222222-2222-2222-2222-222222222222',
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
    'q4444444-4444-4444-4444-444444444444',
    'f2222222-2222-2222-2222-222222222222',
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
    'q5555555-5555-5555-5555-555555555555',
    'f3333333-3333-3333-3333-333333333333',
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
    'q6666666-6666-6666-6666-666666666666',
    'f3333333-3333-3333-3333-333333333333',
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
    'q7777777-7777-7777-7777-777777777777',
    'f1111111-1111-1111-1111-111111111111',
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
    'q8888888-8888-8888-8888-888888888888',
    'f2222222-2222-2222-2222-222222222222',
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
    'q9999999-9999-9999-9999-999999999999',
    'f3333333-3333-3333-3333-333333333333',
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
    'qa111111-1111-1111-1111-111111111111',
    'f1111111-1111-1111-1111-111111111111',
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
