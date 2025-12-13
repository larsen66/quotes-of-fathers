import { Paths, copyAsync, File } from "expo-file-system";
import { db } from "./db";
import { setInitialSyncCompleted } from "./repositories/syncStateRepo";

/**
 * Создает изображения для демо-данных
 * Использует изображения отцов из assets
 */
async function createPlaceholderImages(): Promise<{ [key: string]: string }> {
  const imagePaths: { [key: string]: string } = {};
  
  try {
    // Используем require для статических изображений
    // В React Native require() возвращает числовой ID ресурса
    // Для Expo нужно использовать Image.resolveAssetSource для получения URI
    
    const { Image } = require("react-native");
    
    // Массив изображений отцов (4 изображения, будут повторяться для 5 отцов)
    // Пробуем разные пути к изображениям
    const fatherImageRequires = [
      () => require("../../../../assets/father-1.png"),
      () => require("../../../../assets/father-2.png"),
      () => require("../../../../assets/father-3.png"),
      () => require("../../../../assets/father-4.png"),
    ];
    
    // Альтернативные пути (если первый не сработает)
    const altFatherImageRequires = [
      () => require("../../../assets/father-1.png"),
      () => require("../../../assets/father-2.png"),
      () => require("../../../assets/father-3.png"),
      () => require("../../../assets/father-4.png"),
    ];
    
    let resolvedImages: string[] = [];
    let imageRequires = fatherImageRequires;
    
    // Пробуем разрешить изображения через require
    for (const imgRequire of imageRequires) {
      try {
        const img = imgRequire();
        const imgSource = Image.resolveAssetSource(img);
        if (imgSource?.uri) {
          resolvedImages.push(imgSource.uri);
        }
      } catch (e) {
        // Пробуем альтернативные пути
        continue;
      }
    }
    
    // Если не удалось через первый путь, пробуем альтернативный
    if (resolvedImages.length === 0) {
      imageRequires = altFatherImageRequires;
      for (const imgRequire of imageRequires) {
        try {
          const img = imgRequire();
          const imgSource = Image.resolveAssetSource(img);
          if (imgSource?.uri) {
            resolvedImages.push(imgSource.uri);
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    if (resolvedImages.length === 0) {
      throw new Error("Не удалось найти изображения отцов");
    }
    
    // Создаем уникальные пути для каждого отца
    const fatherIds = ["demo-father-1", "demo-father-2", "demo-father-3", "demo-father-4", "demo-father-5"];
    const documentDir = Paths.document;
    
    for (let i = 0; i < fatherIds.length; i++) {
      const fatherId = fatherIds[i];
      // Используем изображения циклически (для 5 отцов используем 4 изображения, повторяя первое)
      const imageIndex = i % resolvedImages.length;
      const sourceImageUri = resolvedImages[imageIndex];
      
      const avatarFile = new File(documentDir, `avatar_${fatherId}.png`);
      const profileFile = new File(documentDir, `profile_${fatherId}.png`);
      
      try {
        // Копируем изображение как avatar и profile
        await copyAsync({
          from: sourceImageUri,
          to: avatarFile.uri,
        });
        
        await copyAsync({
          from: sourceImageUri,
          to: profileFile.uri,
        });
        
        imagePaths[`avatar_${fatherId}`] = avatarFile.uri;
        imagePaths[`profile_${fatherId}`] = profileFile.uri;
      } catch (copyError) {
        // Если не удалось скопировать, используем оригинальный URI
        imagePaths[`avatar_${fatherId}`] = sourceImageUri;
        imagePaths[`profile_${fatherId}`] = sourceImageUri;
      }
    }
  } catch (error) {
    console.warn("⚠️ Не удалось создать изображения отцов, используем fallback:", error);
    // Fallback: используем простые пути (изображения могут не отображаться, но приложение не упадет)
    const fatherIds = ["demo-father-1", "demo-father-2", "demo-father-3", "demo-father-4", "demo-father-5"];
    const documentDir = Paths.document;
    for (const fatherId of fatherIds) {
      const avatarFile = new File(documentDir, `avatar_${fatherId}.png`);
      const profileFile = new File(documentDir, `profile_${fatherId}.png`);
      imagePaths[`avatar_${fatherId}`] = avatarFile.uri;
      imagePaths[`profile_${fatherId}`] = profileFile.uri;
    }
  }
  
  return imagePaths;
}

/**
 * Добавляет демо-данные в базу для разработки и тестирования
 * без необходимости подключения к Firebase
 */
export async function seedDemoData() {
  try {
    console.log("🌱 Начинаем заполнение демо-данными...");
    
    // Создаем placeholder изображения
    const images = await createPlaceholderImages();
    
    // Очищаем существующие данные (опционально, можно закомментировать)
    db.runSync("DELETE FROM quotes");
    db.runSync("DELETE FROM fathers");
    db.runSync("DELETE FROM favorites");
    
    // Добавляем демо-отцов
    const demoFathers = [
      {
        id: "demo-father-1",
        name_ka: "იოანე ზლატოუსტი",
        name_ru: "Иоанн Златоуст",
        bio_ka: "წმინდა იოანე ზლატოუსტი (დაახლოებით 349-407) იყო კონსტანტინოპოლის არქიეპისკოპოსი და ერთ-ერთი უდიდესი ქრისტიანული მოძღვარი. მისი ქადაგებები და თხზულებები დღესაც არის ქრისტიანული სულიერების საფუძველი.",
        bio_ru: "Святой Иоанн Златоуст (ок. 349-407) был архиепископом Константинополя и одним из величайших христианских учителей. Его проповеди и сочинения до сих пор являются основой христианской духовности.",
        avatarLocalPath: images["avatar_demo-father-1"],
        profileLocalPath: images["profile_demo-father-1"],
        order: 1,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-father-2",
        name_ka: "ბასილი დიდი",
        name_ru: "Василий Великий",
        bio_ka: "წმინდა ბასილი დიდი (დაახლოებით 330-379) იყო კესარიის ეპისკოპოსი და ერთ-ერთი კაპადოკიელი მამა. მან დიდი წვლილი შეიტანა ქრისტიანული თეოლოგიის განვითარებაში.",
        bio_ru: "Святой Василий Великий (ок. 330-379) был епископом Кесарии и одним из каппадокийских отцов. Он внес большой вклад в развитие христианского богословия.",
        avatarLocalPath: images["avatar_demo-father-2"],
        profileLocalPath: images["profile_demo-father-2"],
        order: 2,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-father-3",
        name_ka: "გრიგოლ ღვთისმეტყველი",
        name_ru: "Григорий Богослов",
        bio_ka: "წმინდა გრიგოლ ღვთისმეტყველი (დაახლოებით 329-390) იყო კონსტანტინოპოლის პატრიარქი და თეოლოგი. მისი თეოლოგიური ნაშრომები დღესაც სწავლობენ.",
        bio_ru: "Святой Григорий Богослов (ок. 329-390) был патриархом Константинополя и богословом. Его богословские труды изучают до сих пор.",
        avatarLocalPath: images["avatar_demo-father-3"],
        profileLocalPath: images["profile_demo-father-3"],
        order: 3,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-father-4",
        name_ka: "იოანე დამასკელი",
        name_ru: "Иоанн Дамаскин",
        bio_ka: "წმინდა იოანე დამასკელი (დაახლოებით 675-749) იყო ბიზანტიელი თეოლოგი და ფილოსოფოსი. მან შექმნა მნიშვნელოვანი თეოლოგიური ნაშრომები.",
        bio_ru: "Святой Иоанн Дамаскин (ок. 675-749) был византийским богословом и философом. Он создал важные богословские труды.",
        avatarLocalPath: images["avatar_demo-father-4"],
        profileLocalPath: images["profile_demo-father-4"],
        order: 4,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-father-5",
        name_ka: "მაქსიმე აღმსარებელი",
        name_ru: "Максим Исповедник",
        bio_ka: "წმინდა მაქსიმე აღმსარებელი (დაახლოებით 580-662) იყო ბიზანტიელი მონაზონი, თეოლოგი და ფილოსოფოსი. მან დიდი წვლილი შეიტანა ქრისტიანული აზროვნების განვითარებაში.",
        bio_ru: "Святой Максим Исповедник (ок. 580-662) был византийским монахом, богословом и философом. Он внес большой вклад в развитие христианской мысли.",
        avatarLocalPath: images["avatar_demo-father-5"],
        profileLocalPath: images["profile_demo-father-5"],
        order: 5,
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const father of demoFathers) {
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

    // Добавляем демо-цитаты
    const demoQuotes = [
      {
        id: "demo-quote-1",
        fatherId: "demo-father-1",
        text_ka: "თუ გსურთ ღმერთის სიყვარული, შეიყვარეთ თქვენი მოყვასი.",
        text_ru: "Если хотите любви Божией, возлюбите ближнего своего.",
        source_ka: "ქადაგებები",
        source_ru: "Проповеди",
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-2",
        fatherId: "demo-father-1",
        text_ka: "ღვთის სიტყვა არის სინათლე, რომელიც განათებს ყველა ადამიანს.",
        text_ru: "Слово Божие есть свет, просвещающий всякого человека.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-3",
        fatherId: "demo-father-1",
        text_ka: "მოწყალება და სიყვარული - ეს არის ქრისტიანობის საფუძველი.",
        text_ru: "Милость и любовь - это основа христианства.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-4",
        fatherId: "demo-father-2",
        text_ka: "მოწყალება უფრო დიდია, ვიდრე სამართალი.",
        text_ru: "Милость больше, чем справедливость.",
        source_ka: "წერილები",
        source_ru: "Письма",
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-5",
        fatherId: "demo-father-2",
        text_ka: "ღმერთი არის სიყვარული, და ვინც ცხოვრობს სიყვარულში, ცხოვრობს ღმერთში.",
        text_ru: "Бог есть любовь, и пребывающий в любви пребывает в Боге.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-6",
        fatherId: "demo-father-2",
        text_ka: "სიყვარული არის ყველა ღვთისმშობლის ბრძანებათა შესრულება.",
        text_ru: "Любовь есть исполнение всех заповедей Божиих.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-7",
        fatherId: "demo-father-3",
        text_ka: "ღმერთი გახდა ადამიანი, რათა ადამიანი გახდეს ღმერთი.",
        text_ru: "Бог стал человеком, чтобы человек стал Богом.",
        source_ka: "თეოლოგიური ნაშრომები",
        source_ru: "Богословские труды",
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-8",
        fatherId: "demo-father-3",
        text_ka: "წმინდა სული არის ღვთისმეტყველების მასწავლებელი.",
        text_ru: "Святой Дух есть учитель богословия.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-9",
        fatherId: "demo-father-3",
        text_ka: "ღვთისმეტყველება არის ღმერთის შესწავლა და გაგება.",
        text_ru: "Богословие есть изучение и понимание Бога.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-10",
        fatherId: "demo-father-4",
        text_ka: "სიყვარული ღმერთისა არის ყველაზე დიდი ძალა სამყაროში.",
        text_ru: "Любовь Божия есть величайшая сила во вселенной.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-11",
        fatherId: "demo-father-4",
        text_ka: "წმინდა წერილი არის ღვთის სიტყვა ადამიანებისთვის.",
        text_ru: "Священное Писание есть слово Божие для людей.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-12",
        fatherId: "demo-father-5",
        text_ka: "წმინდა ცხოვრება არის ღმერთთან კავშირის გზა.",
        text_ru: "Святая жизнь есть путь соединения с Богом.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 11).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "demo-quote-13",
        fatherId: "demo-father-5",
        text_ka: "მონანიება არის ღმერთისკენ დაბრუნების პირველი ნაბიჯი.",
        text_ru: "Покаяние есть первый шаг возвращения к Богу.",
        source_ka: null,
        source_ru: null,
        quoteDate: null,
        isPublished: 1,
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const quote of demoQuotes) {
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

    console.log("✅ Демо-данные успешно добавлены в базу");
    console.log(`   - Отцов: ${demoFathers.length}`);
    console.log(`   - Цитат: ${demoQuotes.length}`);
    
    return { success: true, fathersCount: demoFathers.length, quotesCount: demoQuotes.length };
  } catch (error) {
    console.error("❌ Ошибка при добавлении демо-данных:", error);
    throw error;
  }
}

/**
 * Старая функция для обратной совместимости
 * @deprecated Используйте seedDemoData вместо этого
 */
export function seedTestData() {
  return seedDemoData();
}

