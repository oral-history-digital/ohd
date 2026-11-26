import buildFormData from 'modules/api/buildFormData';

import { getCsrfToken } from '../../../utils';

/**
 * Posts an import file and settings to a project-scoped read-only endpoint.
 * @param {string} pathBase - Project and locale prefix.
 * @param {string} resource - Import resource name.
 * @param {string} action - Read-only action to request.
 * @param {Object} params - Scoped multipart form values.
 * @param {AbortSignal} signal - Cancels obsolete requests.
 * @returns {Promise<Response>} Server response for the caller to interpret.
 */
export function postImportRequest(pathBase, resource, action, params, signal) {
    const body = new FormData();
    buildFormData(body, params);
    return fetch(`${pathBase}/${resource}/${action}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'X-CSRF-Token': getCsrfToken(),
        },
        body,
        signal,
    });
}
