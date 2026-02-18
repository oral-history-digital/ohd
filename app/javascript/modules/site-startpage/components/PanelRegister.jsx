import panelImg from 'assets/images/panel-register.jpg';

import panelData from '../data/dummy-data-panel-register.json';
import StartpagePanel from './StartpagePanel';

export function PanelRegister() {
    return (
        <StartpagePanel image={panelImg} data={panelData} variant="register" />
    );
}

export default PanelRegister;
