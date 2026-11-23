import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge the Studio 01 type and spacing tokens from index.css,
// otherwise `text-label-md` is read as a color and dropped next to `text-primary`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display-lg', 'display-lg-mobile', 'display-md', 'display-md-mobile',
        'headline-md', 'title-lg', 'title-md', 'body-lg', 'body-md', 'body-sm',
        'label-lg', 'label-md', 'label-sm',
      ],
      spacing: [
        'gutter-xs', 'gutter-sm', 'gutter-md', 'gutter-lg', 'gutter-xl',
        'section', 'page-margin', 'header', 'halo', 'halo-mobile', 'mascot-mobile',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
