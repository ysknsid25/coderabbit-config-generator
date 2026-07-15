import { useState } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return { dark, toggle };
}
