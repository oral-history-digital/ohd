import panelImg from 'assets/images/panel-register.jpg';

import panelData from '../data/dummy-data-panel-register.json';
import HomepagePanel from './HomepagePanel';

export function PanelRegister() {
    return (
        <HomepagePanel image={panelImg} data={panelData} variant="register" />
    );
}

export default PanelRegister;
