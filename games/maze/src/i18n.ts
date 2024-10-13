import i18next from "i18next";

import enUS from "./locales/en.json";
import ruRU from "./locales/ru.json";
import ukUA from "./locales/uk.json";

export const i18n = i18next.createInstance();

i18n.init({
    partialBundledLanguages: true,
    supportedLngs: ["en", "ru", "uk"],
    fallbackLng: "en",
    lng: undefined,
    fallbackNS: "default",
    defaultNS: "default",
    ns: "default"
});

i18n.addResourceBundle("en", "default", enUS);
i18n.addResourceBundle("ru", "default", ruRU);
i18n.addResourceBundle("uk", "default", ukUA);
