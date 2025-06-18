export let currentLanguage = localStorage.getItem("settings-Language") || "English";
export let languages = {
    Afrikaans: "af",
    ButterDog: "butterdog",
    English: "en",
    Español: "es",
    Emoji: "emoji",
};
export let currentLanguageData;

const defaultLang = "en";

export async function getElementLanguageData(name) {
    while (currentLanguageData == null) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    return currentLanguageData[name] || null;
}

export function unsafeGetElementLanguageData(name) {
    return currentLanguageData[name] || null;
}

export async function updateLanguageElements() {
    const elements = document.querySelectorAll("[data-lang], [data-lang-title], [data-lang-placeholder]");
    elements.forEach(async (element) => {
        const key = element.getAttribute("data-lang");
        const titleKey = element.getAttribute("data-lang-title");
        const placeholderKey = element.getAttribute("data-lang-placeholder");
        if (key) {
            const text = await getElementLanguageData(key);
            if (text) {
                element.innerText = text;
            }
        }
        if (titleKey) {
            const text = await getElementLanguageData(titleKey);
            if (text) {
                element.setAttribute("title", text);
            }
        }
        if (placeholderKey) {
            const text = await getElementLanguageData(placeholderKey);
            if (text) {
                element.setAttribute("placeholder", text);
            }
        }
    });
    console.log("Successfully updated page language");
}

let _defaultLangLoadAttempts = 5;
export async function updateLanguage(lang = defaultLang) {
    // Fetch the language JSON file
    const langShort = languages[lang] || lang;
    const langJSON = `locales/${langShort}.json`;
    return fetch(langJSON)
        .then(response => response.json())
        .then(data => {
            console.log("Language data loaded");
            currentLanguageData = data;
            updateLanguageElements();
        })
        .catch(error => {
            console.error('Error loading language file:', error);
            try {
                if (_defaultLangLoadAttempts > 0) {
                    _defaultLangLoadAttempts -= 1;
                    notify({Text: "Error loading the language file. Retrying with English (Attempt " + (5 - _defaultLangLoadAttempts) + " / 5)", ShowTime: 4000});
                    setTimeout(updateLanguage, 1000, defaultLang);
                } else {
                    notify({Text: "Failed to load language file, max attempts reached. (Check your internet connection?)", ShowTime: 8000});
                }
            } catch (err) {}
        });
}

const userLang = navigator.language.toLowerCase().split('-')[0];
const index = Object.values(languages).indexOf(userLang);

if (index !== -1) {
    const keyAtIndex = Object.keys(languages)[index];
    if (currentLanguage !== keyAtIndex) {
        currentLanguage = keyAtIndex;
    }
}

window.getElementLanguageData = getElementLanguageData;