import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-gold text-white shadow-[var(--shadow-sm)] hover:bg-gold-dark hover:shadow-[var(--shadow-md)]",
        dark: "bg-ink text-white hover:bg-ink/90",
        outline: "border border-border bg-white text-foreground hover:border-gold/60 hover:text-gold-dark",
        ghost: "text-foreground hover:bg-gold/10 hover:text-gold-dark",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1fb457] shadow-[var(--shadow-sm)]",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
