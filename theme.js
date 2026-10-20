/* Tema de color: automático (el del sistema), claro u oscuro. Se recuerda en el dispositivo. */
const KEY = 'mates1eso.theme';
export const THEMES = [['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Oscuro']];
export function getTheme() {
  try {
    const t = localStorage.getItem(KEY);
    return THEMES.some(([id]) => id === t) ? t : 'auto';
  } catch (e) {
    return 'auto';
  }
}
export function applyTheme(t = getTheme()) {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}
export function nextTheme() {
  const t = THEMES[(THEMES.findIndex(([id]) => id === getTheme()) + 1) % THEMES.length][0];
  try {
    if (t === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, t);
  } catch (e) {
    /* sin almacenamiento: el cambio dura hasta recargar */
  }
  applyTheme(t);
  return t;
}
export const themeLabel = () => THEMES.find(([id]) => id === getTheme())[1];
