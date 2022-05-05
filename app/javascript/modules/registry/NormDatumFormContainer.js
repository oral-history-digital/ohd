import { connect } from 'react-redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getProjects, getNormDataProviders } from 'modules/data';
import NormDatumForm from './NormDatumForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        normDataProviders: getNormDataProviders(state),
        translations: getTranslations(state),
    }
}

export default connect(mapStateToProps)(NormDatumForm);
