import panelImg from 'assets/images/panel-interviews.jpg';

import panelData from '../data/dummy-data-panel-interview.json';
import HomepagePanel from './HomepagePanel';

export function PanelInterviews() {
    return (
        <HomepagePanel image={panelImg} data={panelData} variant="interviews" />
    );
}

export default PanelInterviews;
