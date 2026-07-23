import { useEffect, useRef } from 'react';

import { useShouldTrack, useTrackSiteSearch } from 'modules/analytics';
import { useSearchParams } from 'modules/query-string';

/**
 * Tracks the fulltext search term of the archive search.
 *
 * The search term is read from the URL instead of from the submit handler of
 * the search form, so that searches that do not go through the form are
 * tracked as well, e.g. shared links, reloads, browser history navigation and
 * saved searches from the workbook.
 */
export default function useTrackArchiveSearch() {
    const { fulltext, fulltextIsSet } = useSearchParams();
    const trackSiteSearch = useTrackSiteSearch();
    const shouldTrack = useShouldTrack();
    const lastTrackedTerm = useRef(null);

    useEffect(() => {
        if (!fulltextIsSet || !shouldTrack) {
            // The user data is fetched asynchronously after login, so tracking
            // can become possible after the search term has already been set.
            return;
        }

        if (lastTrackedTerm.current === fulltext) {
            // Do not track again when only filters or sorting have changed.
            return;
        }

        lastTrackedTerm.current = fulltext;
        trackSiteSearch(fulltext);
    }, [fulltext, fulltextIsSet, shouldTrack]);
}
