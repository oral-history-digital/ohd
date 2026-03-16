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
        <div className="Homepage project-index" data-testid="homepage-root">
            <Hero />
            <div className="Grid Grid--2" data-testid="homepage-panels-grid">
                <PanelInterviews />
                <PanelRegister />
            </div>
            <HomepageProjects className="u-mt-large" />
        </div>
    );
}
