import { useTrackPageView } from 'modules/analytics';
import { useGetHomepageSettings } from 'modules/data';

import {
    Hero,
    HomepageProjects,
    PanelInterviews,
    PanelRegister,
} from './components';
import HomepageSkeleton from './components/HomepageSkeleton';

export default function Homepage() {
    const { data, loading } = useGetHomepageSettings();
    useTrackPageView();

    if (loading) return <HomepageSkeleton />;

    return (
        <div className="Homepage project-index" data-testid="homepage-root">
            <Hero data={data?.blocks?.hero} />
            <div className="Grid Grid--2" data-testid="homepage-panels-grid">
                <PanelInterviews data={data?.blocks?.panel_interview} />
                <PanelRegister data={data?.blocks?.panel_register} />
            </div>
            <HomepageProjects className="u-mt-xlarge" />
        </div>
    );
}
