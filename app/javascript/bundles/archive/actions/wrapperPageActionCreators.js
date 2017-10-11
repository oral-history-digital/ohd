/* eslint-disable import/prefer-default-export */

import { 
  SET_LOCALE
} from '../constants/archiveConstants';

export const setLocale = (locale) => ({
  type: SET_LOCALE,
  locale: locale,
});


