import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      tone: {
        default: "bg-surface-2 text-muted",
        strong: "bg-primary/10 text-primary",
        mixed: "bg-watch/10 text-watch",
        anecdotal: "bg-surface-2 text-faint",
        quiet: "bg-calm/12 text-calm",
        watch: "bg-watch/12 text-watch",
        elevated: "bg-watch/16 text-watch",
        high: "bg-high/12 text-high",
        peak: "bg-high/18 text-high",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}
