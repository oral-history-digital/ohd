import { connect } from 'react-redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getCurrentProject, getNormDataProviders } from 'modules/data';
import NormDatumForm from './NormDatumForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        normDataProviders: getNormDataProviders(state),
        translations: getTranslations(state),
    }
}

export default connect(mapStateToProps)(NormDatumForm);
