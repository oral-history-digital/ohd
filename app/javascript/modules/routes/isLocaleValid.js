import { SYSTEM_LOCALES } from 'modules/constants';

export default function isLocaleValid(locale) {
  return SYSTEM_LOCALES.includes(locale);
}
