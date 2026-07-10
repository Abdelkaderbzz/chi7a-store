import { getCategoryIcon } from "@/lib/category-icons";

interface CategoryIconProps {
  slug: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({ slug, size = 20, className }: CategoryIconProps) {
  const Icon = getCategoryIcon(slug);
  return <Icon size={size} className={className} strokeWidth={1.75} />;
}
