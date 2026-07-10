import {
  Smartphone,
  Apple,
  Tablet,
  Laptop,
  Monitor,
  BatteryCharging,
  Headphones,
  Watch,
  Gamepad2,
  Tent,
  CircleDot,
  Zap,
  Bike,
  Car,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  iphones: Apple,
  android: Smartphone,
  tablets: Tablet,
  laptops: Laptop,
  pc: Monitor,
  "power-banks": BatteryCharging,
  headphones: Headphones,
  smartwatches: Watch,
  gaming: Gamepad2,
  camping: Tent,
  scooters: CircleDot,
  "electric-bikes": Zap,
  bikes: Bike,
  cars: Car,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICON_MAP[slug] ?? Smartphone;
}

export const CATEGORY_GROUPS = [
  {
    title: "الهواتف",
    titleEn: "Phones",
    slugs: ["iphones", "android", "tablets"],
  },
  {
    title: "الحاسوب",
    titleEn: "Computers",
    slugs: ["laptops", "pc"],
  },
  {
    title: "الإكسسوارات",
    titleEn: "Accessories",
    slugs: ["power-banks", "headphones", "smartwatches"],
  },
  {
    title: "الألعاب",
    titleEn: "Gaming",
    slugs: ["gaming"],
  },
  {
    title: "التنقل",
    titleEn: "Mobility",
    slugs: ["scooters", "electric-bikes", "bikes", "cars"],
  },
  {
    title: "الهواء الطلق",
    titleEn: "Outdoor",
    slugs: ["camping"],
  },
] as const;

export const CATEGORY_BADGES: Record<string, string> = {
  iphones: "جديد",
  android: "عرض خاص",
  camping: "موسم التخييم",
  cars: "متاح أحياناً",
};
