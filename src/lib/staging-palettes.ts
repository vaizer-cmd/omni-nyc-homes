export type Palette = {
  id: string;
  label: string;
  /** CSS custom properties to set on document.documentElement (HSL "H S% L%" strings). */
  vars: Record<string, string>;
};

export const palettes: Palette[] = [
  {
    id: "corporate-blue",
    label: "Corporate Blue",
    vars: {
      "--navy": "220 73% 14%",
      "--navy-light": "220 50% 28%",
      "--cream": "0 0% 98%",
      "--background": "0 0% 98%",
      "--foreground": "220 73% 14%",
      "--card": "0 0% 100%",
      "--card-foreground": "220 73% 14%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "220 73% 14%",
      "--primary": "220 73% 14%",
      "--primary-foreground": "0 0% 98%",
      "--secondary": "0 0% 95%",
      "--secondary-foreground": "220 73% 14%",
      "--muted": "0 0% 95%",
      "--muted-foreground": "220 10% 45%",
      "--accent": "25 64% 45%",
      "--accent-foreground": "220 73% 14%",
      "--gold": "25 64% 45%",
      "--gold-light": "30 98% 69%",
      "--ring": "220 73% 14%",
      "--accent-green": "146 71% 35%",
      "--accent-orange-dark": "25 64% 45%",
      "--accent-purple": "299 75% 29%",
      "--accent-blue": "206 61% 44%",
      "--accent-orange-light": "30 98% 69%",
      "--accent-yellow": "51 72% 57%",
    },
  },
  {
    id: "default",
    label: "Default (site colors)",
    vars: {},
  },
];

export const DEFAULT_PALETTE_ID = palettes[0].id;
