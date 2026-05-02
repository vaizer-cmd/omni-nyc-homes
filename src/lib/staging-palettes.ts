export type Palette = {
  id: string;
  label: string;
  /** CSS custom properties to set on document.documentElement (HSL "H S% L%" strings). */
  vars: Record<string, string>;
};

/**
 * Corporate-Blue palette colors (HSL strings, same hex set everywhere):
 *   navy        #0A1C3F → 220 73% 14%
 *   green       #1A9850 → 146 71% 35%
 *   orange-dk   #BD672A → 25 64% 45%
 *   purple      #801382 → 299 75% 29%
 *   blue        #2C7BB6 → 206 61% 44%
 *   orange-lt   #FDAE61 → 30 98% 69%
 *   yellow      #E0C741 → 51 72% 57%
 *   background  #FAFAFA → 0 0% 98%
 */

const corporateBlueBase: Record<string, string> = {
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
  "--ring": "220 73% 14%",
  // accent role — overridden per-variant below
  "--gold": "25 64% 45%",
  "--gold-light": "30 98% 69%",
  "--accent": "25 64% 45%",
  "--accent-foreground": "220 73% 14%",
  // additional swatches available to all Corporate-Blue variants
  "--accent-green": "146 71% 35%",
  "--accent-orange-dark": "25 64% 45%",
  "--accent-purple": "299 75% 29%",
  "--accent-blue": "206 61% 44%",
  "--accent-orange-light": "30 98% 69%",
  "--accent-yellow": "51 72% 57%",
};

/** Build a Corporate-Blue variant with a different accent color. */
const withAccent = (
  accent: string,
  accentLight: string,
  accentForeground: string = "0 0% 98%",
): Record<string, string> => ({
  ...corporateBlueBase,
  "--gold": accent,
  "--gold-light": accentLight,
  "--accent": accent,
  "--accent-foreground": accentForeground,
  "--ring": accent,
});

/** Dark-mode usage of the same Corporate-Blue palette. */
const darkModeVars: Record<string, string> = {
  ...corporateBlueBase,
  "--background": "220 73% 14%",
  "--cream": "220 73% 14%",
  "--foreground": "0 0% 98%",
  "--card": "220 55% 18%",
  "--card-foreground": "0 0% 98%",
  "--popover": "220 55% 18%",
  "--popover-foreground": "0 0% 98%",
  "--primary": "0 0% 98%",
  "--primary-foreground": "220 73% 14%",
  "--secondary": "220 45% 25%",
  "--secondary-foreground": "0 0% 98%",
  "--muted": "220 45% 25%",
  "--muted-foreground": "220 15% 75%",
  "--border": "220 30% 30%",
  "--input": "220 30% 30%",
};

export const palettes: Palette[] = [
  {
    id: "corporate-blue",
    label: "Corporate Blue · Orange Accent",
    vars: { ...corporateBlueBase },
  },
  {
    id: "corporate-blue-green",
    label: "Corporate Blue · Green Accent",
    vars: withAccent("146 71% 35%", "146 50% 55%"),
  },
  {
    id: "corporate-blue-purple",
    label: "Corporate Blue · Purple Accent",
    vars: withAccent("299 75% 29%", "299 50% 50%"),
  },
  {
    id: "corporate-blue-blue",
    label: "Corporate Blue · Blue Accent",
    vars: withAccent("206 61% 44%", "206 60% 60%"),
  },
  {
    id: "corporate-blue-yellow",
    label: "Corporate Blue · Yellow Accent",
    vars: withAccent("51 72% 57%", "51 80% 70%", "220 73% 14%"),
  },
  {
    id: "corporate-blue-light-orange",
    label: "Corporate Blue · Light Orange Accent",
    vars: withAccent("30 98% 69%", "30 95% 80%", "220 73% 14%"),
  },
  {
    id: "corporate-blue-dark",
    label: "Corporate Blue · Dark Mode",
    vars: darkModeVars,
  },
  {
    id: "default",
    label: "Default (site colors)",
    vars: {},
  },
];

export const DEFAULT_PALETTE_ID = palettes[0].id;
