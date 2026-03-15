import { useTrackPageView } from 'modules/analytics';

import {
    Hero,
    HomepageProjects,
    PanelInterviews,
    PanelRegister,
} from './components';

export default function Homepage() {
    useTrackPageView();

    return (
        <div className="Homepage project-index">
            <Hero />
            <div className="Grid Grid--2">
                <PanelInterviews />
                <PanelRegister />
            </div>
            <HomepageProjects className="u-mt-large" />
        </div>
    );
}
