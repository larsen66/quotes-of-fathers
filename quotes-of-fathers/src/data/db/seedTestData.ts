import { db } from "./db";
import { setInitialSyncCompleted } from "./repositories/syncStateRepo";

/**
 * Добавляет тестовые данные в базу для разработки и тестирования
 * без необходимости подключения к Firebase
 */
export function seedTestData() {
  try {
    // Добавляем тестовых отцов
    const testFathers = [
      {
        id: "test-father-1",
        name_ka: "იოანე ზლატოუსტი",
        name_ru: "Иоанн Златоуст",
        bio_ka: "წმინდა იოანე ზლატოუსტი (დაახლოებით 349-407) იყო კონსტანტინოპოლის არქიეპისკოპოსი და ერთ-ერთი უდიდესი ქრისტიანული მოძღვარი.",
        bio_ru: "Святой Иоанн Златоуст (ок. 349-407) был архиепископом Константинополя и одним из величайших христианских учителей.",
        avatarLocalPath: "file:///test/avatar1.jpg",
        profileLocalPath: null,
        order: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "test-father-2",
        name_ka: "ბასილი დიდი",
        name_ru: "Василий Великий",
        bio_ka: "წმინდა ბასილი დიდი (დაახლოებით 330-379) იყო კესარიის ეპისკოპოსი და ერთ-ერთი კაპადოკიელი მამა.",
        bio_ru: "Святой Василий Великий (ок. 330-379) был епископом Кесарии и одним из каппадокийских отцов.",
        avatarLocalPath: "file:///test/avatar2.jpg",
        profileLocalPath: null,
        order: 2,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "test-father-3",
        name_ka: "გრიგოლ ღვთისმეტყველი",
        name_ru: "Григорий Богослов",
        bio_ka: "წმინდა გრიგოლ ღვთისმეტყველი (დაახლოებით 329-390) იყო კონსტანტინოპოლის პატრიარქი და თეოლოგი.",
        bio_ru: "Святой Григорий Богослов (ок. 329-390) был патриархом Константинополя и богословом.",
        avatarLocalPath: "file:///test/avatar3.jpg",
        profileLocalPath: null,
        order: 3,
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const father of testFathers) {
      db.runSync(
        `INSERT OR REPLACE INTO fathers
         (id, name_ka, name_ru, bio_ka, bio_ru, avatarLocalPath, profileLocalPath, "order", updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          father.id,
          father.name_ka,
          father.name_ru,
          father.bio_ka,
          father.bio_ru,
          father.avatarLocalPath,
          father.profileLocalPath,
          father.order,
          father.updatedAt,
        ]
      );
    }

    // Добавляем тестовые цитаты
    const testQuotes = [
      {
        id: "test-quote-1",
        fatherId: "test-father-1",
        text_ka: "თუ გსურთ ღმერთის სიყვარული, შეიყვარეთ თქვენი მოყვასი.",
        text_ru: "Если хотите любви Божией, возлюбите ближнего своего.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 дня назад
        updatedAt: new Date().toISOString(),
      },
      {
        id: "test-quote-2",
        fatherId: "test-father-1",
        text_ka: "ღვთის სიტყვა არის სინათლე, რომელიც განათებს ყველა ადამიანს.",
        text_ru: "Слово Божие есть свет, просвещающий всякого человека.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 дня назад
        updatedAt: new Date().toISOString(),
      },
      {
        id: "test-quote-3",
        fatherId: "test-father-2",
        text_ka: "მოწყალება უფრო დიდია, ვიდრე სამართალი.",
        text_ru: "Милость больше, чем справедливость.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // вчера
        updatedAt: new Date().toISOString(),
      },
      {
        id: "test-quote-4",
        fatherId: "test-father-2",
        text_ka: "ღმერთი არის სიყვარული, და ვინც ცხოვრობს სიყვარულში, ცხოვრობს ღმერთში.",
        text_ru: "Бог есть любовь, и пребывающий в любви пребывает в Боге.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date().toISOString(), // сегодня
        updatedAt: new Date().toISOString(),
      },
      {
        id: "test-quote-5",
        fatherId: "test-father-3",
        text_ka: "ღმერთი გახდა ადამიანი, რათა ადამიანი გახდეს ღმერთი.",
        text_ru: "Бог стал человеком, чтобы человек стал Богом.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 дня назад
        updatedAt: new Date().toISOString(),
      },
      {
        id: "test-quote-6",
        fatherId: "test-father-3",
        text_ka: "წმინდა სული არის ღვთისმეტყველების მასწავლებელი.",
        text_ru: "Святой Дух есть учитель богословия.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 дней назад
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const quote of testQuotes) {
      db.runSync(
        `INSERT OR REPLACE INTO quotes
         (id, fatherId, text_ka, text_ru, source_ka, source_ru,
          quoteDate, isPublished, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quote.id,
          quote.fatherId,
          quote.text_ka,
          quote.text_ru,
          quote.source_ka,
          quote.source_ru,
          quote.quoteDate,
          quote.isPublished,
          quote.createdAt,
          quote.updatedAt,
        ]
      );
    }

    // Помечаем, что начальная синхронизация завершена
    setInitialSyncCompleted(true);

    console.log("✅ Тестовые данные успешно добавлены в базу");
  } catch (error) {
    console.error("❌ Ошибка при добавлении тестовых данных:", error);
    throw error;
  }
}

