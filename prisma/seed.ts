import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "iPhones", nameAr: "آيفون", slug: "iphones", order: 1 },
  { name: "Android", nameAr: "أندرويد", slug: "android", order: 2 },
  { name: "Tablets", nameAr: "أجهزة لوحية", slug: "tablets", order: 3 },
  { name: "Laptops", nameAr: "حواسيب محمولة", slug: "laptops", order: 4 },
  { name: "PC", nameAr: "حاسوب مكتبي", slug: "pc", order: 5 },
  { name: "Power Banks", nameAr: "باور بانك", slug: "power-banks", order: 6 },
  { name: "Headphones", nameAr: "سماعات", slug: "headphones", order: 7 },
  { name: "Smartwatches", nameAr: "ساعات ذكية", slug: "smartwatches", order: 8 },
  { name: "Gaming", nameAr: "ألعاب", slug: "gaming", order: 9 },
  { name: "Camping", nameAr: "تخييم", slug: "camping", order: 10 },
  { name: "Scooters", nameAr: "سكوتر", slug: "scooters", order: 11 },
  { name: "Electric Bikes", nameAr: "دراجات كهربائية", slug: "electric-bikes", order: 12 },
  { name: "Bikes", nameAr: "دراجات", slug: "bikes", order: 13 },
  { name: "Cars", nameAr: "سيارات", slug: "cars", order: 14 },
];

type ProductSeed = {
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  featured: boolean;
  cat: string;
  image: string | null;
};

const products: ProductSeed[] = [
  // iPhones — real Chi7a Store photos
  {
    slug: "iphone-17-pro",
    name: "iPhone 17 Pro 512GB",
    nameAr: "آيفون 17 برو 512 جيجا",
    description: "The iPhone 17 Pro delivers flagship performance with the A19 Pro chip, a stunning 48MP camera system, and 512GB of storage. Available in Cosmic Orange with premium titanium build quality.",
    descriptionAr: "آيفون 17 برو يقدّم أداءً استثنائياً بفضل شريحة A19 Pro وكاميرا 48 ميجابكسل ومساحة تخزين 512 جيجا. متوفر بلون البرتقالي الكوزميك مع تصميم تيتانيوم فاخر. مثالي للتصوير الاحترافي والألعاب والاستخدام اليومي المكثف.",
    price: 6299,
    featured: true,
    cat: "iphones",
    image: "/products/iphone-17-pro.jpg",
  },
  {
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro",
    nameAr: "آيفون 16 برو",
    description: "Apple's iPhone 16 Pro features the powerful A18 Pro chip, advanced camera capabilities, and a sleek titanium design. A perfect balance of performance and elegance.",
    descriptionAr: "آيفون 16 برو يتميز بشريحة A18 Pro القوية وكاميرا متطورة وتصميم تيتانيوم أنيق. يوفّر تجربة سلسة في التصوير والألعاب والتطبيقات. خيار ممتاز لمن يبحث عن أداء عالي بسعر تنافسي.",
    price: 5799,
    featured: true,
    cat: "iphones",
    image: "/products/iphone-16-pro.jpeg",
  },
  {
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    nameAr: "آيفون 15 برو",
    description: "The iPhone 15 Pro comes with 256GB storage, titanium frame, and a 48MP main camera. Super Retina XDR display for vivid colors and sharp details.",
    descriptionAr: "آيفون 15 برو بسعة 256 جيجا وإطار تيتانيوم وكاميرا رئيسية 48 ميجابكسل. شاشة Super Retina XDR بألوان حية وتفاصيل واضحة. هاتف موثوق وعملي يناسب الاستخدام اليومي والعمل.",
    price: 4999,
    featured: true,
    cat: "iphones",
    image: "/products/iphone-15-pro.jpeg",
  },
  {
    slug: "iphone-13",
    name: "iPhone 13",
    nameAr: "آيفون 13",
    description: "A reliable iPhone 13 with 128GB storage and Super Retina XDR display. Great value for everyday use, photography, and iOS ecosystem access.",
    descriptionAr: "آيفون 13 بسعة 128 جيجا وشاشة Super Retina XDR. خيار اقتصادي وموثوق للاستخدام اليومي والتصوير والوصول لنظام iOS. يوفّر أداءً ممتازاً بسعر مناسب.",
    price: 2799,
    featured: true,
    cat: "iphones",
    image: "/products/iphone-13.jpg",
  },

  // Android
  {
    slug: "poco-x7-pro",
    name: "POCO X7 Pro",
    nameAr: "بوكو X7 برو",
    description: "POCO X7 Pro packs 512GB storage, fast charging, and strong gaming performance. Ideal for power users who want flagship specs at a mid-range price.",
    descriptionAr: "بوكو X7 برو بسعة 512 جيجا وشحن سريع وأداء قوي للألعاب. مثالي لمن يريد مواصفات راقية بسعر معقول. شاشة سلسة وبطارية تدوم طوال اليوم.",
    price: 1390,
    featured: true,
    cat: "android",
    image: "/products/poco-x7-pro.jpeg",
  },
  {
    slug: "redmi-note-15",
    name: "Redmi Note 15",
    nameAr: "ريدمي نوت 15",
    description: "Redmi Note 15 features a massive 6000mAh battery and a 108MP camera. Excellent battery life and solid photography for everyday use.",
    descriptionAr: "ريدمي نوت 15 ببطارية 6000 مللي أمبير وكاميرا 108 ميجابكسل. عمر بطارية طويل وتصوير جيد للاستخدام اليومي. هاتف عملي بقيمة ممتازة مقابل السعر.",
    price: 1099,
    featured: true,
    cat: "android",
    image: "/products/redmi-note-15.jpeg",
  },
  {
    slug: "honor-magic6-pro",
    name: "Honor Magic6 Pro",
    nameAr: "هونر ماجيك 6 برو",
    description: "Honor Magic6 Pro is a flagship device with professional-grade cameras, premium build, and top-tier performance for demanding users.",
    descriptionAr: "هونر ماجيك 6 برو من الفئة الرائدة بكاميرات احترافية وتصميم فاخر وأداء عالي. مناسب للمصورين ومحبي التقنية الذين يبحثون عن أفضل تجربة أندرويد.",
    price: 3499,
    featured: true,
    cat: "android",
    image: "/products/honor-magic6-pro.jpeg",
  },
  {
    slug: "oppo-a6x",
    name: "OPPO A6x",
    nameAr: "أوبو A6x",
    description: "OPPO A6x offers a large display, huge battery, and elegant design. A budget-friendly smartphone that doesn't compromise on essentials.",
    descriptionAr: "أوبو A6x بشاشة كبيرة وبطارية ضخمة وتصميم أنيق. هاتف اقتصادي لا يتنازل عن الأساسيات. مثالي للطلاب والاستخدام اليومي والتصفح ووسائل التواصل.",
    price: 799,
    featured: true,
    cat: "android",
    image: "/products/oppo-a6x.jpg",
  },
  {
    slug: "redmi-13c-5g",
    name: "Redmi 13C 5G",
    nameAr: "ريدمي 13C 5G",
    description: "Redmi 13C 5G with 8GB RAM, 128GB storage, and 5000mAh battery. Affordable 5G connectivity for fast browsing and streaming.",
    descriptionAr: "ريدمي 13C 5G بذاكرة 8 جيجا رام و128 جيجا تخزين وبطارية 5000 مللي. اتصال 5G بسعر مناسب للتصفح السريع ومشاهدة الفيديو. خيار ذكي للميزانية المحدودة.",
    price: 899,
    featured: false,
    cat: "android",
    image: "/products/redmi-13c-5g.jpeg",
  },
  {
    slug: "samsung-galaxy-a07",
    name: "Samsung Galaxy A07",
    nameAr: "سامسونج جالاكسي A07",
    description: "Samsung Galaxy A07 is an economical phone with solid specs and Samsung reliability. Perfect as a first smartphone or backup device.",
    descriptionAr: "سامسونج جالاكسي A07 هاتف اقتصادي بمواصفات جيدة وموثوقية سامسونج المعروفة. مثالي كأول هاتف ذكي أو جهاز احتياطي. سهل الاستخدام ومناسب لجميع الأعمار.",
    price: 549,
    featured: false,
    cat: "android",
    image: "/products/samsung-a07.jpg",
  },
  {
    slug: "honor-play-10",
    name: "Honor Play 10",
    nameAr: "هونر بلاي 10",
    description: "Honor Play 10 features a 5000mAh battery and wide display. Built for entertainment, social media, and all-day usage without frequent charging.",
    descriptionAr: "هونر بلاي 10 ببطارية 5000 مللي وشاشة واسعة. مصمم للترفيه ووسائل التواصل والاستخدام طوال اليوم دون شحن متكرر. أداء مستقر وسعر جذاب.",
    price: 699,
    featured: false,
    cat: "android",
    image: "/products/honor-play-10.jpg",
  },

  // Laptops
  {
    slug: "lenovo-thinkpad",
    name: "Lenovo ThinkPad",
    nameAr: "لينوفو ثينك باد",
    description: "Lenovo ThinkPad with a powerful processor, excellent keyboard, and durable build. Ideal for work, study, and business travel.",
    descriptionAr: "لينوفو ثينك باد بمعالج قوي ولوحة مفاتيح ممتازة وهيكل متين. مثالي للعمل والدراسة والسفر. حالة ممتازة وجاهز للاستخدام الفوري من Chi7a Store.",
    price: 1599,
    featured: true,
    cat: "laptops",
    image: "/products/lenovo-thinkpad.jpg",
  },
  {
    slug: "acer-aspire-one",
    name: "Acer Aspire One",
    nameAr: "أيسر أسباير ون",
    description: "Compact Acer Aspire One netbook with a 10.1-inch display. Lightweight and portable for basic tasks, browsing, and on-the-go productivity.",
    descriptionAr: "أيسر أسباير ون حاسوب محمول صغير بشاشة 10.1 بوصة. خفيف ومحمول للمهام الأساسية والتصفح والعمل أثناء التنقل. خيار عملي للطلاب والاستخدام الخفيف.",
    price: 699,
    featured: false,
    cat: "laptops",
    image: "/products/acer-aspire-one.jpeg",
  },

  // Power banks
  {
    slug: "inkax-powerbank-30000",
    name: "Inkax Power Bank 30000mAh",
    nameAr: "باور بانك إنكاكس 30000 مللي",
    description: "Inkax 30000mAh power bank with 18W fast charging. Charges phones multiple times — essential for travel, camping, and long days away from outlets.",
    descriptionAr: "باور بانك إنكاكس بسعة 30000 مللي أمبير وشحن سريع 18W. يشحن الهاتف عدة مرات — ضروري للسفر والتخييم والأيام الطويلة بعيداً عن الكهرباء. متين وعملي.",
    price: 89,
    featured: true,
    cat: "power-banks",
    image: "/products/inkax-powerbank.jpg",
  },

  // Headphones
  {
    slug: "honor-earbuds-x7e",
    name: "Honor Choice Earbuds X7e",
    nameAr: "سماعات هونر X7e",
    description: "Honor Choice Earbuds X7e with semi-open ANC and up to 40 hours battery life. Clear sound and comfortable fit for music, calls, and workouts.",
    descriptionAr: "سماعات هونر X7e بتقنية ANC شبه مفتوحة وبطارية تصل إلى 40 ساعة. صوت واضح وارتداء مريح للموسيقى والمكالمات والرياضة. خفيفة وسهلة الحمل.",
    price: 129,
    featured: true,
    cat: "headphones",
    image: "/products/honor-earbuds.jpeg",
  },

  // Smartwatches
  {
    slug: "samsung-galaxy-watch7",
    name: "Samsung Galaxy Watch7",
    nameAr: "ساعة سامسونج جالاكسي 7",
    description: "Samsung Galaxy Watch7 with AMOLED display and comprehensive health tracking. Monitor heart rate, sleep, steps, and stay connected on your wrist.",
    descriptionAr: "ساعة سامسونج جالاكسي 7 بشاشة AMOLED وتتبع صحي متكامل. راقب نبض القلب والنوم والخطوات وابقَ متصلاً من معصمك. تصميم أنيق يناسب الاستخدام اليومي والرياضة.",
    price: 899,
    featured: true,
    cat: "smartwatches",
    image: "/products/samsung-watch7.jpg",
  },
  {
    slug: "xiaomi-smart-band",
    name: "Xiaomi Smart Band",
    nameAr: "سوار شاومي الذكي",
    description: "Xiaomi Smart Band with fitness tracking and colorful AMOLED display. Affordable wearable for steps, heart rate, and notifications.",
    descriptionAr: "سوار شاومي الذكي لتتبع اللياقة وشاشة AMOLED ملونة. سوار اقتصادي لقياس الخطوات ونبض القلب والإشعارات. خفيف ومريح للارتداء طوال اليوم.",
    price: 149,
    featured: true,
    cat: "smartwatches",
    image: "/products/xiaomi-smart-band.jpg",
  },

  // Gaming
  {
    slug: "nintendo-switch",
    name: "Nintendo Switch",
    nameAr: "نينتندو سويتش",
    description: "Nintendo Switch portable gaming console with Joy-Con controllers. Play at home on TV or on the go — hundreds of games for all ages.",
    descriptionAr: "نينتندو سويتش جهاز ألعاب محمول مع وحدات تحكم Joy-Con. العب في المنزل على التلفاز أو أثناء التنقل — مئات الألعاب لجميع الأعمار. ترفيه ممتع للعائلة والأصدقاء.",
    price: 899,
    featured: true,
    cat: "gaming",
    image: "/products/nintendo-switch.jpeg",
  },

  // Camping — chairs & tents
  {
    slug: "camping-chair",
    name: "Camping Chair",
    nameAr: "كرسي تخييم",
    description: "Comfortable and lightweight camping chair for trips and outdoor gatherings. Folds easily and supports relaxed seating anywhere.",
    descriptionAr: "كرسي تخييم مريح وخفيف للرحلات والتجمعات الخارجية. يُطوى بسهولة ويوفّر جلوساً مريحاً في أي مكان. مثالي للشواء والتخييم والسهرات في الهواء الطلق.",
    price: 59,
    featured: true,
    cat: "camping",
    image: "/products/camping-chair.avif",
  },
  {
    slug: "camping-chair-foldable",
    name: "Foldable Camping Chair",
    nameAr: "كرسي تخييم قابل للطي",
    description: "Foldable camping chair with sturdy frame. Easy to carry and store — a must-have for every camping and picnic kit.",
    descriptionAr: "كرسي تخييم قابل للطي بهيكل متين. سهل الحمل والتخزين — أساسي في كل عدة تخييم أو نزهة. يتحمل الاستخدام المتكرر ويوفّر راحة جيدة.",
    price: 79,
    featured: true,
    cat: "camping",
    image: "/products/camping-chair-1.avif",
  },
  {
    slug: "camping-chair-comfort",
    name: "Comfort Camping Chair",
    nameAr: "كرسي تخييم مريح",
    description: "Comfort camping chair with padded backrest and weather-resistant fabric. Extra comfort for long outdoor sessions.",
    descriptionAr: "كرسي تخييم مريح بمسند ظهر مبطّن وقماش مقاوم للطقس. راحة إضافية للجلوس الطويل في الهواء الطلق. مناسب للتخييم لعدة أيام والرحلات العائلية.",
    price: 99,
    featured: false,
    cat: "camping",
    image: "/products/camping-chair-11.avif",
  },
  {
    slug: "camping-chair-outdoor",
    name: "Outdoor Chair",
    nameAr: "كرسي خارجي",
    description: "Versatile outdoor chair for camping, BBQs, and day trips. Durable construction built for regular outdoor use.",
    descriptionAr: "كرسي خارجي متعدد الاستخدامات للتخييم والشواء والرحلات اليومية. تصنيع متين يتحمل الاستخدام المتكرر في الهواء الطلق. عملي واقتصادي.",
    price: 69,
    featured: false,
    cat: "camping",
    image: "/products/camping-chair-6.avif",
  },
  {
    slug: "camping-chair-portable",
    name: "Portable Camping Chair",
    nameAr: "كرسي تخييم محمول",
    description: "Ultra-light portable camping chair that folds into a compact carry bag. Perfect when space and weight matter most.",
    descriptionAr: "كرسي تخييم محمول خفيف الوزن يُطوى في حقيبة صغيرة. مثالي عندما يكون الحجم والوزن مهماً. سهل أخذه في السيارة أو على الظهر خلال الرحلات.",
    price: 49,
    featured: false,
    cat: "camping",
    image: "/products/camping-chair-7.avif",
  },
  {
    slug: "camping-tent-2person",
    name: "2-Person Camping Tent",
    nameAr: "خيمة تخييم لشخصين",
    description: "Lightweight waterproof 2-person tent with quick setup. Ideal for couples and solo campers who want a compact shelter.",
    descriptionAr: "خيمة خفيفة ومقاومة للماء لشخصين مع تركيب سريع. مثالية للأزواج والمخيمين المنفردين الذين يريدون مأوى مدمجاً. سهلة الحمل ومناسبة للمبتدئين.",
    price: 249,
    featured: true,
    cat: "camping",
    image: "/products/camping-tent-1.avif",
  },
  {
    slug: "camping-tent-4person",
    name: "4-Person Camping Tent",
    nameAr: "خيمة تخييم لـ 4 أشخاص",
    description: "Spacious 4-person tent with excellent ventilation. Room for a small family or group of friends on weekend camping trips.",
    descriptionAr: "خيمة واسعة لـ 4 أشخاص بتهوية ممتازة. مساحة كافية لعائلة صغيرة أو مجموعة أصدقاء في رحلات التخييم الأسبوعية. مريحة وعملية للاستخدام المتكرر.",
    price: 399,
    featured: true,
    cat: "camping",
    image: "/products/camping-tent-2.avif",
  },
  {
    slug: "camping-tent-family",
    name: "Family Camping Tent",
    nameAr: "خيمة عائلية",
    description: "Large family camping tent with wind-resistant design. Plenty of space for parents and kids on extended outdoor adventures.",
    descriptionAr: "خيمة عائلية كبيرة بتصميم مقاوم للرياح. مساحة واسعة للآباء والأطفال في المغامرات الخارجية الطويلة. خيار ممتاز للعائلات التي تحب التخييم.",
    price: 549,
    featured: true,
    cat: "camping",
    image: "/products/camping-tent-3.avif",
  },
  {
    slug: "camping-tent-dome",
    name: "Dome Camping Tent",
    nameAr: "خيمة قبة",
    description: "Classic dome tent with fast assembly and stable structure. A reliable choice for beginners and casual campers.",
    descriptionAr: "خيمة قبة كلاسيكية بتركيب سريع وهيكل مستقر. خيار موثوق للمبتدئين والمخيمين العاديين. تصميم بسيط يعمل في مختلف الظروف الجوية.",
    price: 299,
    featured: false,
    cat: "camping",
    image: "/products/camping-tent-4.avif",
  },
  {
    slug: "camping-tent-large",
    name: "Large Camping Tent",
    nameAr: "خيمة تخييم كبيرة",
    description: "Extra-large camping tent for groups and long trips. Maximum space and comfort for serious outdoor enthusiasts.",
    descriptionAr: "خيمة تخييم كبيرة للمجموعات والرحلات الطويلة. أقصى مساحة وراحة لعشاق الطبيعة. مناسبة للتخييم لعدة أيام مع عدد كبير من الأشخاص.",
    price: 649,
    featured: false,
    cat: "camping",
    image: "/products/camping-tent-12.avif",
  },

  // Mobility — same photo for scooter/e-bike/bike variants
  {
    slug: "electric-scooter",
    name: "Electric Scooter",
    nameAr: "سكوتر كهربائي",
    description: "Electric scooter reaching 25 km/h with a 36V battery. Eco-friendly urban transport for short commutes and fun rides.",
    descriptionAr: "سكوتر كهربائي بسرعة 25 كم/س وبطارية 36V. تنقل حضري صديق للبيئة للتنقلات القصيرة والرحلات الممتعة. اقتصادي وسهل الاستخدام في المدينة.",
    price: 1299,
    featured: true,
    cat: "scooters",
    image: "/products/mobility.jpg",
  },
  {
    slug: "ebike-500w",
    name: "E-Bike 500W",
    nameAr: "دراجة كهربائية 500W",
    description: "500W electric bike with 35 km/h top speed and lithium battery. Effortless cycling for commuting and exploring Douz and beyond.",
    descriptionAr: "دراجة كهربائية 500W بسرعة 35 كم/س وبطارية ليثيوم. ركوب خالٍ من الجهد للتنقل واستكشاف دوز والمناطق المحيطة. مثالية للعمل والرحلات اليومية.",
    price: 2499,
    featured: true,
    cat: "electric-bikes",
    image: "/products/mobility.jpg",
  },
  {
    slug: "city-bike",
    name: "City Bike",
    nameAr: "دراجة مدينة",
    description: "Practical and comfortable city bike for daily commuting. Simple, reliable, and affordable personal transport.",
    descriptionAr: "دراجة مدينة عملية ومريحة للتنقل اليومي. نقل شخصي بسيط وموثوق وبسعر مناسب. مثالية للطلاب والعمل والتنقلات القصيرة في المدينة.",
    price: 599,
    featured: false,
    cat: "bikes",
    image: "/products/mobility.jpg",
  },
];

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  await prisma.admin.upsert({
    where: { email: "admin@chi7astore.tn" },
    update: {},
    create: { email: "admin@chi7astore.tn", password, name: "Admin" },
  });

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, nameAr: cat.nameAr, order: cat.order },
      create: cat,
    });
  }

  const ids: Record<string, string> = {};
  for (const cat of categories) {
    const found = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (found) ids[cat.slug] = found.id;
  }

  for (const p of products) {
    const categoryId = ids[p.cat];
    if (!categoryId) continue;
    const data = {
      name: p.name,
      nameAr: p.nameAr,
      description: p.description,
      descriptionAr: p.descriptionAr,
      price: p.price,
      featured: p.featured,
      image: p.image,
      categoryId,
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, slug: p.slug },
    });
  }

  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      {
        title: "Latest iPhones",
        titleAr: "أحدث الآيفون",
        subtitle: "iPhone 15, 16 & 17 Pro — best prices in Douz",
        subtitleAr: "آيفون 15 و 16 و 17 برو بأفضل الأسعار في دوز",
        image: "/products/iphone-17-pro.jpg",
        link: "/categories/iphones",
        order: 1,
        active: true,
      },
      {
        title: "Chi7a Store",
        titleAr: "متميزون في خدمتكم",
        subtitle: "Your trusted electronics store in Douz",
        subtitleAr: "محلكم الموثوق للإلكترونيات في دوز",
        image: "/products/store-team.jpg",
        link: "/products",
        order: 2,
        active: true,
      },
      {
        title: "Mobility",
        titleAr: "دراجات و سكوتر كهربائية",
        subtitle: "E-bikes, scooters & bikes",
        subtitleAr: "دراجات كهربائية، سكوتر و دراجات",
        image: "/products/mobility.jpg",
        link: "/categories/scooters",
        order: 3,
        active: true,
      },
      {
        title: "Camping Gear",
        titleAr: "معدات التخييم",
        subtitle: "Tents & camping chairs",
        subtitleAr: "خيام وكراسي تخييم",
        image: "/products/camping-tent-3.avif",
        link: "/categories/camping",
        order: 4,
        active: true,
      },
    ],
  });

  console.log("✅ Database seeded with Chi7a Store product photos!");
  console.log(`📦 ${products.length} products with real images`);
  console.log("📧 Admin login: admin@chi7astore.tn / admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
