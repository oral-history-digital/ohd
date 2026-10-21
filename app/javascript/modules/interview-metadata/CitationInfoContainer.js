import {
    FetchProjectResource,
    getCollectionsForCurrentProject,
    getCurrentInterview,
} from 'modules/data';
import { useSelector } from 'react-redux';

import CitationInfo from './CitationInfo';

/**
 * Loads project collections before showing the current interview's citation.
 * @returns {React.ReactElement} Citation or collection loading indicator.
 */
export default function CitationInfoContainer() {
    const interview = useSelector(getCurrentInterview);
    const collections = useSelector(getCollectionsForCurrentProject);
    return (
        <FetchProjectResource resource="collections">
            <CitationInfo interview={interview} collections={collections} />
        </FetchProjectResource>
    );
}
