import { connect } from 'react-redux';

import MultiLocaleWrapper from '../../components/form/MultiLocaleWrapper';
import { getProject } from '../../../../lib/utils';


const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.locales) || state.archive.locales,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MultiLocaleWrapper);
