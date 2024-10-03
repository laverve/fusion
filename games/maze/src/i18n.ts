import { addTranslations } from "@laverve/i18n-provider";
import { I18N_NAMESPACE } from "./types";

import enUS from "./locales/en-US.json";
import ruRU from "./locales/ru-RU.json";
import ukUA from "./locales/uk-UA.json";

addTranslations("en", I18N_NAMESPACE, enUS);
addTranslations("uk", I18N_NAMESPACE, ukUA);
addTranslations("ru", I18N_NAMESPACE, ruRU);
