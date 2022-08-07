const defaultLocale = "en";
const supportedLocales = ["en", "it"];
let activeLocale = defaultLocale;
let translations = {};

document.addEventListener("DOMContentLoaded", () => {
    let initialLocale = window.localStorage.getItem('lang');
    if (initialLocale === null)
        // Retrieve the first supported locale
        initialLocale = browserLocales().find(isSupported) || defaultLocale;

    setLocale(initialLocale);
});

function isSupported(locale) {
    return supportedLocales.indexOf(locale) > -1;
}

// Load translations for the given locale and translate the page
async function setLocale(newLocale) {

    if (newLocale === activeLocale) return;

    const newTranslations = await fetchTranslationsFor(newLocale);
    activeLocale = newLocale;
    translations = newTranslations;
    document.documentElement.lang = newLocale;

    // Swap flags
    const activeFlag = document.querySelector(`.country-flag[data-lang="${newLocale}"]`);
    const oldActiveFlag = document.querySelector('#lang-selection > .country-flag');
    document.getElementById('lang-selection').prepend(activeFlag);
    document.getElementById('more-langs').prepend(oldActiveFlag);

    // Replace text of each element with a data-i18n attribute with the corresponding translation
    document
        .querySelectorAll("[data-i18n]")
        .forEach((element) => {
            const key = element.getAttribute("data-i18n");
            element.innerText = translations[key];
        });
}

// Retrieve translations from JSON file
async function fetchTranslationsFor(newLocale) {
    const response = await fetch(`/lang/${newLocale}.json`);
    return await response.json();
}

/**
 * Retrieve user-preferred locales from the browser
 * returns ["en", "fr"] instead of ["en-US", "fr-FR"]
 * @returns array | undefined
 */
function browserLocales() {
    return navigator.languages.map((locale) => locale.split("-")[0]);
}