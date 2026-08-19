import { createContext, useContext, useState, useLayoutEffect, useMemo, useCallback } from 'react';

const DEFAULT_ATMOSPHERE = {
  id: 'base',
  accent: '#7fb2ff',
  ink: '#eaf1ff',
  from: '#070c16',
  mid: '#12233f',
  to: '#050810',
  mood: 'cool',
  image: null,
};

const AtmosphereContext = createContext(null);

export function AtmosphereProvider({ children }) {
  const [atmosphere, setAtmosphereState] = useState(DEFAULT_ATMOSPHERE);

  const setAtmosphere = useCallback((next) => {
    if (!next) return;
    setAtmosphereState((prev) => {
      const merged = { ...DEFAULT_ATMOSPHERE, ...next };
      if (merged.id === prev.id && merged.accent === prev.accent) return prev;
      return merged;
    });
  }, []);

  const resetAtmosphere = useCallback(() => {
    setAtmosphereState(DEFAULT_ATMOSPHERE);
  }, []);

  // Push accent + atmosphere colours onto :root as CSS custom properties so
  // the entire UI (accents, glows, focus rings) reacts to the active section.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', atmosphere.accent);
    root.style.setProperty('--accent-ink', atmosphere.ink);
    root.style.setProperty('--atmos-from', atmosphere.from);
    root.style.setProperty('--atmos-mid', atmosphere.mid);
    root.style.setProperty('--atmos-to', atmosphere.to);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', atmosphere.to);
  }, [atmosphere]);

  const value = useMemo(
    () => ({ atmosphere, setAtmosphere, resetAtmosphere }),
    [atmosphere, setAtmosphere, resetAtmosphere]
  );

  return <AtmosphereContext.Provider value={value}>{children}</AtmosphereContext.Provider>;
}

export function useAtmosphere() {
  const ctx = useContext(AtmosphereContext);
  if (!ctx) throw new Error('useAtmosphere must be used within an AtmosphereProvider');
  return ctx;
}

/** Build an atmosphere object from a section's `atmosphere` config. */
export function atmosphereFromSection(section) {
  if (!section) return DEFAULT_ATMOSPHERE;
  const a = section.atmosphere || {};
  return {
    id: section.id,
    accent: a.accent || DEFAULT_ATMOSPHERE.accent,
    ink: a.ink || DEFAULT_ATMOSPHERE.ink,
    from: a.from || DEFAULT_ATMOSPHERE.from,
    mid: a.mid || DEFAULT_ATMOSPHERE.mid,
    to: a.to || DEFAULT_ATMOSPHERE.to,
    mood: a.mood || 'cool',
    image: a.image || null,
  };
}

export { DEFAULT_ATMOSPHERE };
