import { getCsrfToken } from '../../utils';

export default {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    /**
     * Reads the token when headers are used so page changes do not leave it stale.
     *
     * @returns {string} The current Rails authenticity token.
     */
    get 'X-CSRF-Token'() {
        return getCsrfToken();
    },
};
