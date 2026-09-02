/**
 * Demo catalogue for the seed script.
 *
 * Images come from picsum.photos using a stable `seed` so every product keeps
 * the same picture between runs. If the demo machine happens to be offline the
 * frontend falls back to a generated placeholder card, so nothing looks broken.
 */
const image = (seed) => `https://picsum.photos/seed/${seed}/800/800`;

export const CATEGORIES = {
  ELECTRONICS: 'کالای دیجیتال',
  HOME: 'خانه و آشپزخانه',
  CLOTHING: 'پوشاک',
  BOOKS: 'کتاب و لوازم‌التحریر',
  SPORTS: 'ورزش و سفر',
  BEAUTY: 'زیبایی و سلامت',
};

export const PRODUCTS = [
  {
    name: 'لپ‌تاپ ۱۴ اینچی پرو مدل ایکس‌بوک',
    description:
      'لپ‌تاپ سبک و باریک با نمایشگر ۱۴ اینچی رتینا، پردازندهٔ هشت هسته‌ای، ۱۶ گیگابایت حافظهٔ رم و ۵۱۲ گیگابایت حافظهٔ داخلی SSD. بدنهٔ آلومینیومی یکپارچه و باتری با دوام تا ۱۲ ساعت، آن را به همراهی مناسب برای دانشجویان و برنامه‌نویسان تبدیل کرده است.',
    price: 68_900_000,
    stock: 12,
    category: CATEGORIES.ELECTRONICS,
    imageUrl: image('laptop-pro-14'),
  },
  {
    name: 'گوشی هوشمند نوا ۱۲ با حافظهٔ ۲۵۶ گیگابایت',
    description:
      'گوشی هوشمند با نمایشگر ۶.۷ اینچی AMOLED و نرخ نوسازی ۱۲۰ هرتز، دوربین سه‌گانهٔ ۵۰ مگاپیکسلی با تثبیت‌کنندهٔ نوری تصویر و باتری ۵۰۰۰ میلی‌آمپرساعتی با پشتیبانی از شارژ سریع ۶۵ وات.',
    price: 32_400_000,
    stock: 25,
    category: CATEGORIES.ELECTRONICS,
    imageUrl: image('smartphone-nova12'),
  },
  {
    name: 'هدفون بی‌سیم حذف نویز مدل اکو سایلنت',
    description:
      'هدفون روگوشی بلوتوث ۵.۳ با فناوری حذف نویز فعال، تا ۴۰ ساعت پخش موسیقی با یک بار شارژ، بالشتک‌های نرم مموری‌فوم و میکروفون دوگانه برای تماس‌های شفاف.',
    price: 3_250_000,
    stock: 40,
    category: CATEGORIES.ELECTRONICS,
    imageUrl: image('headphones-echo'),
  },
  {
    name: 'ساعت هوشمند اسپرت سری ۵',
    description:
      'ساعت هوشمند با صفحهٔ AMOLED دایره‌ای، سنجش ضربان قلب و اکسیژن خون، بیش از ۱۰۰ حالت ورزشی، مقاومت در برابر آب تا ۵۰ متر و باتری با دوام ۱۴ روزه.',
    price: 4_850_000,
    stock: 30,
    category: CATEGORIES.ELECTRONICS,
    imageUrl: image('smartwatch-sport5'),
  },
  {
    name: 'کیبورد مکانیکی گیمینگ با نور پس‌زمینه',
    description:
      'کیبورد مکانیکی تمام‌سایز با سوییچ‌های آبی، نورپردازی RGB قابل تنظیم، بدنهٔ فلزی مقاوم و قابلیت تعویض کلیدها. مناسب برای بازی و تایپ طولانی‌مدت.',
    price: 2_180_000,
    stock: 35,
    category: CATEGORIES.ELECTRONICS,
    imageUrl: image('keyboard-mech-rgb'),
  },
  {
    name: 'پاوربانک ۲۰۰۰۰ میلی‌آمپرساعت شارژ سریع',
    description:
      'شارژر همراه با ظرفیت واقعی ۲۰۰۰۰ میلی‌آمپرساعت، دو خروجی USB و یک درگاه Type-C دوطرفه با توان ۲۲.۵ وات، همراه با نمایشگر دیجیتال درصد باتری.',
    price: 1_390_000,
    stock: 60,
    category: CATEGORIES.ELECTRONICS,
    imageUrl: image('powerbank-20000'),
  },
  {
    name: 'سرویس قابلمه گرانیتی ۹ پارچه',
    description:
      'سرویس پخت‌وپز ۹ پارچه با پوشش گرانیتی نچسب و بدون PFOA، درب‌های شیشه‌ای سکوریت با دریچهٔ بخار و دسته‌های نسوز. مناسب برای انواع اجاق‌گاز از جمله صفحه‌های القایی.',
    price: 5_650_000,
    stock: 18,
    category: CATEGORIES.HOME,
    imageUrl: image('cookware-granite9'),
  },
  {
    name: 'چای‌ساز و کتری برقی استیل',
    description:
      'چای‌ساز رومیزی با بدنهٔ استیل ضدزنگ، قوری چینی نشکن ۱.۲ لیتری، عملکرد دو مرحله‌ای جوش و دم، خاموشی خودکار و محافظت در برابر جوش بدون آب.',
    price: 2_780_000,
    stock: 22,
    category: CATEGORIES.HOME,
    imageUrl: image('teamaker-steel'),
  },
  {
    name: 'جاروبرقی رباتیک هوشمند نقشه‌بردار',
    description:
      'جاروبرقی رباتیک با حسگر لیزری نقشه‌برداری، قدرت مکش ۴۰۰۰ پاسکال، مخزن آب برای طی کشیدن هم‌زمان، کنترل از طریق اپلیکیشن موبایل و بازگشت خودکار به پایگاه شارژ.',
    price: 14_900_000,
    stock: 9,
    category: CATEGORIES.HOME,
    imageUrl: image('robot-vacuum'),
  },
  {
    name: 'فرش ماشینی طرح سنتی ۶ متری',
    description:
      'فرش ماشینی ۷۰۰ شانه با تراکم ۲۵۵۰، نخ اکریلیک هیت‌ست شده و طرح سنتی لچک‌ترنج در رنگ‌بندی کرم و لاجوردی. ابعاد ۲ در ۳ متر، مناسب پذیرایی.',
    price: 8_450_000,
    stock: 7,
    category: CATEGORIES.HOME,
    imageUrl: image('persian-rug-6m'),
  },
  {
    name: 'ست ملحفه و روبالشتی نخی دو نفره',
    description:
      'ست چهار تکه شامل ملحفهٔ کش‌دار، لحاف‌دوزی و دو روبالشتی از جنس نخ پنبهٔ ۱۰۰٪ با بافت ساتن. ضدحساسیت، قابل شست‌وشو در ماشین لباسشویی و بدون آب‌رفتگی.',
    price: 1_980_000,
    stock: 26,
    category: CATEGORIES.HOME,
    imageUrl: image('bedding-cotton-set'),
  },
  {
    name: 'پیراهن مردانه آستین بلند کتان',
    description:
      'پیراهن مردانه با پارچهٔ کتان نخی خنک و قابل تنفس، برش رگولار فیت، یقهٔ کلاسیک و دکمه‌های صدفی. مناسب برای محیط کار و استفادهٔ روزمره در فصول گرم.',
    price: 1_290_000,
    stock: 45,
    category: CATEGORIES.CLOTHING,
    imageUrl: image('mens-linen-shirt'),
  },
  {
    name: 'مانتو زنانه جلو باز مدل کیمونو',
    description:
      'مانتو زنانهٔ جلو باز با پارچهٔ کرپ مازراتی درجه یک، آستین سه‌ربع و برش آزاد. طراحی ساده و شیک که پوشیدن آن را برای محیط کار و مهمانی مناسب می‌کند.',
    price: 2_150_000,
    stock: 20,
    category: CATEGORIES.CLOTHING,
    imageUrl: image('womens-kimono-coat'),
  },
  {
    name: 'کفش کتانی روزمره مدل ایر لایت',
    description:
      'کفش کتانی سبک با رویهٔ مش قابل تنفس، کفی طبی مموری‌فوم و زیرهٔ فوم فشرده با جذب ضربهٔ بالا. مناسب پیاده‌روی طولانی و استفادهٔ روزمره.',
    price: 2_890_000,
    stock: 33,
    category: CATEGORIES.CLOTHING,
    imageUrl: image('sneakers-airlight'),
  },
  {
    name: 'شال نخی طرح‌دار بهاره',
    description:
      'شال نخی با بافت سبک و لطیف، طرح گل‌های ریز بهاری در رنگ‌بندی متنوع، ابعاد ۱۹۰ در ۷۰ سانتی‌متر و دورد‌وزی تمیز. مناسب چهار فصل.',
    price: 690_000,
    stock: 55,
    category: CATEGORIES.CLOTHING,
    imageUrl: image('spring-scarf'),
  },
  {
    name: 'کتاب «کیمیاگر» اثر پائولو کوئیلو',
    description:
      'ترجمهٔ فارسی رمان جهانی کیمیاگر، داستان سفر چوپانی اسپانیایی به دنبال گنج و کشف افسانهٔ شخصی خویش. چاپ جلد سخت با کاغذ بالکی و صفحه‌آرایی خوانا.',
    price: 245_000,
    stock: 80,
    category: CATEGORIES.BOOKS,
    imageUrl: image('book-alchemist'),
  },
  {
    name: 'دفتر یادداشت جلد چرمی ۲۰۰ برگ',
    description:
      'دفتر یادداشت با جلد چرم مصنوعی مقاوم، صحافی دوخت نخ که امکان باز شدن کامل صفحات را می‌دهد، کاغذ کرم ۸۰ گرمی و بند نگهدارندهٔ کشی و نشانه‌گذار پارچه‌ای.',
    price: 420_000,
    stock: 70,
    category: CATEGORIES.BOOKS,
    imageUrl: image('leather-notebook'),
  },
  {
    name: 'کوله‌پشتی لپ‌تاپ ضدآب مسافرتی',
    description:
      'کوله‌پشتی با پارچهٔ پلی‌استر ضدآب، محفظهٔ اختصاصی و ضربه‌گیر برای لپ‌تاپ تا ۱۵.۶ اینچ، درگاه شارژ USB، جیب مخفی ضدسرقت و بندهای ارگونومیک مش‌دار.',
    price: 1_650_000,
    stock: 38,
    category: CATEGORIES.SPORTS,
    imageUrl: image('laptop-backpack'),
  },
  {
    name: 'مت یوگا حرفه‌ای ضدلغزش ۶ میلی‌متری',
    description:
      'مت یوگا با ضخامت ۶ میلی‌متر از جنس TPE دولایه و بدون بو، سطح ضدلغزش در دو رو، خطوط راهنمای تراز بدن و بند حمل پارچه‌ای. ابعاد ۱۸۳ در ۶۱ سانتی‌متر.',
    price: 890_000,
    stock: 42,
    category: CATEGORIES.SPORTS,
    imageUrl: image('yoga-mat-pro'),
  },
  {
    name: 'فلاسک استیل دوجداره ۷۵۰ میلی‌لیتر',
    description:
      'فلاسک استیل ضدزنگ ۳۰۴ با عایق خلأ دوجداره که نوشیدنی را تا ۱۲ ساعت گرم و تا ۲۴ ساعت سرد نگه می‌دارد. درب ضدنشتی، بدنهٔ پودری مات و مناسب کوهنوردی و سفر.',
    price: 780_000,
    stock: 50,
    category: CATEGORIES.SPORTS,
    imageUrl: image('thermos-flask'),
  },
  {
    name: 'ست مراقبت پوست ویتامین ث',
    description:
      'ست سه مرحله‌ای شامل سرم ویتامین ث ۲۰٪، کرم آبرسان روزانه و ضدآفتاب SPF50 بدون چربی. مناسب انواع پوست برای روشن‌سازی و کاهش لک‌های تیره.',
    price: 1_540_000,
    stock: 28,
    category: CATEGORIES.BEAUTY,
    imageUrl: image('skincare-vitc-set'),
  },
  {
    name: 'سشوار حرفه‌ای یون‌ساز ۲۲۰۰ وات',
    description:
      'سشوار پرقدرت ۲۲۰۰ وات با فناوری یونیزه برای کاهش وز مو، سه سطح حرارت و دو سطح سرعت، دکمهٔ باد سرد و دو سری نازل باریک و دیفیوزر.',
    price: 2_340_000,
    stock: 24,
    category: CATEGORIES.BEAUTY,
    imageUrl: image('hairdryer-ionic'),
  },
];

export default PRODUCTS;
