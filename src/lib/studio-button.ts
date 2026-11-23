import { cva, type VariantProps } from "class-variance-authority";

// Studio 01 buttons: sharp corners, 1px ink border, mono uppercase label,
// instant ink inversion on hover. Works on <a> and <button>.
// Every size keeps a 44px touch target below lg; `sm` tightens on desktop.
export const studioButton = cva(
  "inline-flex items-center justify-center gap-gutter-sm rounded-xs border border-primary font-label uppercase whitespace-nowrap transition-colors duration-100 ease-state-change disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-on-ink hover:bg-primary hover:text-on-primary",
        secondary:
          "bg-transparent text-primary hover:bg-primary hover:text-on-primary",
        surface:
          "bg-surface text-primary hover:bg-primary hover:text-on-primary",
      },
      size: {
        lg: "min-h-11 px-gutter-lg py-gutter-md text-label-lg",
        md: "min-h-11 px-gutter-md py-gutter-sm text-label-lg",
        sm: "min-h-11 px-gutter-md py-gutter-xs text-label-sm lg:min-h-8",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);
export type StudioButtonProps = VariantProps<typeof studioButton>;
