const THEME_STORAGE_KEY = 'mental-health-theme:v2';

const themeInitializer = `(function () {
  try {
    var STORAGE_KEY = '${THEME_STORAGE_KEY}';
    var THEMES = ['theme-light', 'theme-dark', 'theme-simple'];
    var root = document.documentElement;
    var body = document.body;
    if (!root || !body) {
      return;
    }

    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      stored = null;
    }

    var isStoredTheme = typeof stored === 'string' && THEMES.indexOf(stored) !== -1;
    var prefersDark = false;
    try {
      prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      prefersDark = false;
    }

    var theme = isStoredTheme ? stored : (prefersDark ? 'theme-dark' : 'theme-light');

    for (var i = 0; i < THEMES.length; i++) {
      root.classList.remove(THEMES[i]);
      body.classList.remove(THEMES[i]);
    }

    root.classList.add(theme);
    body.classList.add(theme);

    var normalized = theme.replace('theme-', '');
    root.dataset.theme = normalized;
    body.dataset.theme = normalized;
  } catch (error) {
    // Silently ignore theme initialisation errors
  }
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />;
}
