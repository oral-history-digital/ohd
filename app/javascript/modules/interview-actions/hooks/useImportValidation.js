import { useCallback, useEffect, useRef, useState } from 'react';

import buildFormData from 'modules/api/buildFormData';

import { getCsrfToken } from '../../../utils';

/**
 * Checks uploads on demand and cancels obsolete checks after edits or unmounting.
 * @param {string} pathBase - Current project and locale route prefix.
 * @param {string} resource - Import resource, such as transcripts.
 * @param {Function} prepareParams - Converts form values to the import payload.
 * @returns {Object} Status, structured issues, an async check, and a reset callback.
 */
export function useImportValidation(pathBase, resource, prepareParams) {
    const [result, setResult] = useState({ status: 'idle', issues: [] });
    const pending = useRef({ sequence: 0 });

    /** Cancels requests and invalidates even responses that ignore abort. */
    const cancel = useCallback(() => {
        pending.current.sequence += 1;
        pending.current.controller?.abort();
    }, []);

    useEffect(() => {
        setResult({ status: 'idle', issues: [] });
        return cancel;
    }, [cancel, pathBase, resource]);

    /** Clears feedback when form values change without sending another request. */
    const reset = useCallback(() => {
        cancel();
        setResult({ status: 'idle', issues: [] });
    }, [cancel]);

    /**
     * Checks a submitted snapshot before the caller queues its import.
     * @param {Object} values - Locally validated form values, including the File.
     * @returns {Promise<boolean>} Whether this check passed and is still current.
     */
    const check = useCallback(
        async (values) => {
            cancel();
            const sequence = pending.current.sequence;
            const controller = new AbortController();
            pending.current.controller = controller;
            setResult({ status: 'checking', issues: [] });
            try {
                const body = new FormData();
                buildFormData(body, prepareParams(values));
                const response = await fetch(
                    `${pathBase}/${resource}/validate`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'X-CSRF-Token': getCsrfToken(),
                        },
                        body,
                        signal: controller.signal,
                    }
                );
                const json = await response.json();
                if (
                    !(
                        [200, 422].includes(response.status) &&
                        typeof json.valid === 'boolean' &&
                        Array.isArray(json.issues)
                    ) ||
                    (json.valid &&
                        (response.status !== 200 || json.issues.length))
                ) {
                    throw new Error('Invalid pre-check response');
                }
                if (sequence !== pending.current.sequence) return false;
                setResult({
                    status: json.valid ? 'idle' : 'invalid',
                    issues: json.issues,
                });
                return json.valid;
            } catch (error) {
                if (
                    sequence === pending.current.sequence &&
                    error.name !== 'AbortError'
                ) {
                    setResult({ status: 'error', issues: [] });
                }
                return false;
            }
        },
        [cancel, pathBase, resource, prepareParams]
    );

    return { ...result, check, reset };
}
