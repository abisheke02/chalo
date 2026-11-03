'use client';

import { useEffect, useRef, useState } from 'react';
import { Palette, Check, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onClickOutside);
      document.addEventListener('keydown', onEsc);
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const lightThemes = themes.filter((t) => t.mode === 'light');
  const darkThemes = themes.filter((t) => t.mode === 'dark');

  function ThemeRow({ t }: { t: (typeof themes)[number] }) {
    const isActive = t.id === theme;
    return (
      <button
        type="button"
        role="menuitemradio"
        aria-checked={isActive}
        onClick={() => {
          setTheme(t.id);
          setOpen(false);
        }}
        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition-colors ${
          isActive ? 'bg-primary/10' : 'hover:bg-muted'
        }`}
      >
        <span className="flex shrink-0 rounded-md overflow-hidden border border-border">
          {t.swatch.map((c, i) => (
            <span key={i} className="w-2.5 h-5 block" style={{ backgroundColor: c }} />
          ))}
        </span>
        <span className="flex-1 min-w-0 text-sm font-medium text-popover-foreground truncate">{t.name}</span>
        {isActive && <Check className="w-4 h-4 text-primary shrink-0" />}
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card text-foreground/70 hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-popover shadow-xl z-50 overflow-hidden"
        >
          <div className="max-h-[70vh] overflow-y-auto p-2">
            {/* Light group */}
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <Sun className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Light Themes
              </span>
            </div>
            {lightThemes.map((t) => (
              <ThemeRow key={t.id} t={t} />
            ))}

            <div className="my-1.5 h-px bg-border" />

            {/* Dark group */}
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <Moon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Dark Themes
              </span>
            </div>
            {darkThemes.map((t) => (
              <ThemeRow key={t.id} t={t} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
