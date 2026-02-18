import { useTrackPageView } from 'modules/analytics';

import {
    Hero,
    PanelInterviews,
    PanelRegister,
    StartpageArchives,
} from './components';

export default function SiteStartpage() {
    useTrackPageView();

    return (
        <div className="wrapper-content project-index">
            <Hero />
            <div className="Grid Grid--2">
                <PanelInterviews />
                <PanelRegister />
            </div>
            <StartpageArchives className="u-mt-large" />
        </div>
    );
}
