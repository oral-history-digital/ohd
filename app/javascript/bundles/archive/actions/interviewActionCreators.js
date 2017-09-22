/* eslint-disable import/prefer-default-export */

import { LOAD_INTERVIEW} from '../constants/archiveConstants';

export const loadInterview = (interview) => ({
  type: LOAD_INTERVIEW,
  interview,
});
