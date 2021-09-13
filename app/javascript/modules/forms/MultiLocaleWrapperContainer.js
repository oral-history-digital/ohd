import { connect } from 'react-redux';

import { getLocale, getLocales, getTranslations } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import MultiLocaleWrapper from './MultiLocaleWrapper';

const mapStateToProps = (state) => {
    const project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        translations: getTranslations(state),
    }
}

export default connect(mapStateToProps)(MultiLocaleWrapper);
