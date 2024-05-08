import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
  missingWarn: false, // 消除警告
  fallbackWarn: false, // 消除警告
})
const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('./modules/*.json'))
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.json$/)?.[1], loadLocale]),
)
export const loadedLanguages = Object.keys(localesMap)

function setI18nLanguage(lang) {
  i18n.global.locale.value = lang
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}
export async function loadLanguageAsync(lang, defaultLang = 'en') {
  const loadLocale = localesMap[lang] || localesMap[defaultLang]
  const messages = await loadLocale()
  i18n.global.setLocaleMessage(lang, messages.default)

  if (i18n.global.locale.value !== lang)
    localStorage.setItem('lang', lang)

  return setI18nLanguage(lang)
}
loadLanguageAsync(localStorage.getItem('lang') || (navigator.language || 'en').toLocaleLowerCase().split('-')[0])
