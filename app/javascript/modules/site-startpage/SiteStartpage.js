import { useTrackPageView } from 'modules/analytics';

import StartpageArchives from './StartpageArchives';
import StartpageIntroduction from './StartpageIntroduction';

export default function SiteStartpage() {
    useTrackPageView();

    return (
        <div className="wrapper-content project-index">
            <StartpageIntroduction />

            <StartpageArchives className="u-mt-large" />
        </div>
    );
}
