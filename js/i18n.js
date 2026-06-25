// Sistema de Internacionalização
class I18nManager {
  constructor() {
    this.currentLang = this.getStoredLanguage() || this.detectBrowserLanguage();
    this.translations = {};
    this.supportedLanguages = ['pt', 'en', 'es'];
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language.slice(0, 2);
    return this.supportedLanguages.includes(browserLang) ? browserLang : 'pt';
  }

  getStoredLanguage() {
    return localStorage.getItem('preferred-language');
  }

  setLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) {
      console.error(`Language ${lang} not supported`);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('preferred-language', lang);
    document.documentElement.setAttribute('lang', this.getLangAttribute(lang));
    this.updatePageContent();
    this.updateMetaTags();
  }

  getLangAttribute(lang) {
    const langMap = {
      'pt': 'pt-BR',
      'en': 'en-US',
      'es': 'es'
    };
    return langMap[lang] || 'pt-BR';
  }

  async loadTranslations(lang) {
    try {
      const response = await fetch(`./i18n/${lang}.json`);
      this.translations[lang] = await response.json();
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  }

  async init() {
    // Carrega traduções do idioma atual
    await this.loadTranslations(this.currentLang);

    // Pre-carrega outros idiomas em background
    this.supportedLanguages.forEach(lang => {
      if (lang !== this.currentLang) {
        this.loadTranslations(lang);
      }
    });

    this.setLanguage(this.currentLang);
    this.setupLanguageSelector();
  }

  translate(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value;
  }

  updatePageContent() {
    // Atualiza todos os elementos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.translate(key);
    });

    // Atualiza placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.setAttribute('placeholder', this.translate(key));
    });

    // Atualiza títulos (title attribute)
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.setAttribute('title', this.translate(key));
    });

    // Atualiza aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      element.setAttribute('aria-label', this.translate(key));
    });
  }

  updateMetaTags() {
    const description = this.translate('meta.description');
    const keywords = this.translate('meta.keywords');

    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
    document.title = this.translate('meta.title');
  }

  setupLanguageSelector() {
    // Marca o botão ativo
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === this.currentLang);
      btn.addEventListener('click', () => {
        this.setLanguage(btn.getAttribute('data-lang-btn'));
        
        // Atualiza botões ativos
        document.querySelectorAll('[data-lang-btn]').forEach(b => {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });
  }
}

// Inicializa o sistema
const i18n = new I18nManager();
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
