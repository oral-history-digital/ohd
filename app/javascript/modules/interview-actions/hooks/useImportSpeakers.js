import { useEffect, useState } from 'react';

import { postImportRequest } from '../utils';

/**
 * Reads speaker labels when a file changes and discards obsolete responses.
 * @param {string} pathBase - Project and locale prefix.
 * @param {string} resource - Import resource name.
 * @param {string} scope - Multipart parameter scope.
 * @param {string} archiveId - Public destination interview identifier.
 * @param {File|null} file - Selected upload.
 * @returns {Object} Speaker options, loading state, and a manual-fallback error flag.
 */
export function useImportSpeakers(pathBase, resource, scope, archiveId, file) {
    const [result, setResult] = useState({
        options: null,
        isLoading: false,
        error: false,
    });

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        setResult({ options: null, isLoading: Boolean(file), error: false });

        if (file) {
            postImportRequest(
                pathBase,
                resource,
                'speakers',
                { [scope]: { archive_id: archiveId, data: file } },
                controller.signal
            )
                .then(async (response) => {
                    const json = await response.json();
                    if (
                        response.status !== 200 ||
                        !Array.isArray(json.speakers) ||
                        !json.speakers.every(
                            (label) => typeof label === 'string'
                        )
                    ) {
                        throw new Error('Invalid speaker response');
                    }
                    if (active) {
                        setResult({
                            options: json.speakers,
                            isLoading: false,
                            error: false,
                        });
                    }
                })
                .catch(() => {
                    if (active) {
                        setResult({
                            options: null,
                            isLoading: false,
                            error: true,
                        });
                    }
                });
        }

        return () => {
            active = false;
            controller.abort();
        };
    }, [pathBase, resource, scope, archiveId, file]);

    return result;
}
