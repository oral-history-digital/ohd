import panelImg from 'assets/images/panel-interviews.jpg';

import panelData from '../data/dummy-data-panel-interview.json';
import StartpagePanel from './StartpagePanel';

export function PanelInterviews() {
    return (
        <StartpagePanel
            image={panelImg}
            data={panelData}
            variant="interviews"
        />
    );
}

export default PanelInterviews;
