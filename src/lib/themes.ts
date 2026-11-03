/**
 * Theme catalog — deliberately NOT a 'use client' module, so it can be
 * imported from both client components (ThemeProvider, ThemeSwitcher, the
 * /theme preview page) and server-only code (the theme API route, the
 * root layout) without tripping the "can't call a client export from the
 * server" RSC boundary error.
 */

export type ThemeMode = 'light' | 'dark';
export type ThemeId =
  | 'light' | 'slate' | 'pastel' | 'arctic' | 'mint' | 'lavender' | 'rose'
  | 'sandstone' | 'sky' | 'sage' | 'cloud' | 'ivory' | 'blush'
  | 'midnight' | 'dark' | 'obsidian' | 'forest' | 'purple' | 'crimson'
  | 'ocean' | 'carbon' | 'dracula' | 'nord' | 'emeraldnight' | 'sunsetdark';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  mode: ThemeMode;
  /** Swatch colors [background, brand, accent] for the picker preview. */
  swatch: [string, string, string];
}

export const THEMES: ThemeOption[] = [
  { id: 'light', name: 'Clean Light', mode: 'light', swatch: ['#ffffff', '#026dde', '#f59e0b'] },
  { id: 'slate', name: 'Corporate Slate', mode: 'light', swatch: ['#f1f5f9', '#0f4c81', '#d97706'] },
  { id: 'pastel', name: 'Soft Pastel', mode: 'light', swatch: ['#fdf9f4', '#6d8ae8', '#ef9f7d'] },
  { id: 'arctic', name: 'Arctic', mode: 'light', swatch: ['#f4f9fc', '#0aa2c0', '#f59e0b'] },
  { id: 'mint', name: 'Mint Fresh', mode: 'light', swatch: ['#f3fbf6', '#059669', '#f59e0b'] },
  { id: 'lavender', name: 'Lavender', mode: 'light', swatch: ['#f8f6fd', '#7c3aed', '#ec4899'] },
  { id: 'rose', name: 'Rose', mode: 'light', swatch: ['#fdf5f7', '#e11d48', '#0891b2'] },
  { id: 'sandstone', name: 'Sandstone', mode: 'light', swatch: ['#faf6f0', '#b45309', '#0d9488'] },
  { id: 'sky', name: 'Sky', mode: 'light', swatch: ['#f2f8ff', '#0284c7', '#f59e0b'] },
  { id: 'sage', name: 'Sage', mode: 'light', swatch: ['#f6f8f4', '#4d7c0f', '#ca8a04'] },
  { id: 'cloud', name: 'Cloud Gray', mode: 'light', swatch: ['#f5f6f8', '#4f46e5', '#0ea5e9'] },
  { id: 'ivory', name: 'Ivory Gold', mode: 'light', swatch: ['#fdfbf5', '#a16207', '#0369a1'] },
  { id: 'blush', name: 'Blush Coral', mode: 'light', swatch: ['#fdf6f4', '#ea580c', '#0891b2'] },
  { id: 'midnight', name: 'Midnight Blue', mode: 'dark', swatch: ['#010b2a', '#3b8ff0', '#f59e0b'] },
  { id: 'dark', name: 'Elegant Dark', mode: 'dark', swatch: ['#0f1115', '#3b8ff0', '#f59e0b'] },
  { id: 'obsidian', name: 'Obsidian', mode: 'dark', swatch: ['#000000', '#3b82f6', '#f59e0b'] },
  { id: 'forest', name: 'Deep Forest', mode: 'dark', swatch: ['#0a1710', '#34d399', '#fbbf24'] },
  { id: 'purple', name: 'Royal Purple', mode: 'dark', swatch: ['#160f26', '#a78bfa', '#f472b6'] },
  { id: 'crimson', name: 'Crimson Night', mode: 'dark', swatch: ['#1a0d10', '#f87171', '#fbbf24'] },
  { id: 'ocean', name: 'Ocean Deep', mode: 'dark', swatch: ['#04191f', '#22d3ee', '#f59e0b'] },
  { id: 'carbon', name: 'Carbon', mode: 'dark', swatch: ['#141414', '#60a5fa', '#f59e0b'] },
  { id: 'dracula', name: 'Dracula', mode: 'dark', swatch: ['#282a36', '#bd93f9', '#ff79c6'] },
  { id: 'nord', name: 'Nord', mode: 'dark', swatch: ['#2e3440', '#88c0d0', '#ebcb8b'] },
  { id: 'emeraldnight', name: 'Emerald Night', mode: 'dark', swatch: ['#08211a', '#10d9a0', '#fbbf24'] },
  { id: 'sunsetdark', name: 'Sunset Dark', mode: 'dark', swatch: ['#1e1218', '#fb7185', '#fbbf24'] },
];
