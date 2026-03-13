import { useTrackPageView } from 'modules/analytics';
import { useHideSidebarOnMount } from 'modules/sidebar';

import {
    Hero,
    PanelInterviews,
    PanelRegister,
    StartpageArchives,
} from './components';

export default function SiteStartpage() {
    useTrackPageView();
    useHideSidebarOnMount();

    return (
        <div className="Startpage project-index">
            <Hero />
            <div className="Grid Grid--2">
                <PanelInterviews />
                <PanelRegister />
            </div>
            <StartpageArchives className="u-mt-large" />
        </div>
    );
}
