import Image from "next/image";
import { cn } from "@/lib/utils";

type StoreLogoProps = {
  size?: number;
  className?: string;
  showRing?: boolean;
};

export function StoreLogo({ size = 48, className, showRing = true }: StoreLogoProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full",
        showRing && "bg-white p-1 shadow-md ring-2 ring-gold/60",
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="Chi7a Store"
        width={size}
        height={size}
        className="h-auto w-auto rounded-full"
        priority
        quality={100}
      />
    </div>
  );
}
