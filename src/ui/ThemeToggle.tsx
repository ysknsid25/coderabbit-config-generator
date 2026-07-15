import { MoonIcon, SunIcon } from './icons';
import { useTheme } from './useTheme';

export function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
    >
      {dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
