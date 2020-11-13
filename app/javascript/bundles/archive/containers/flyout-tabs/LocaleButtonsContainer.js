import { connect } from 'react-redux';

import LocaleButtons from '../../components/flyout-tabs/LocaleButtons';
import { setLocale } from '../../actions/archiveActionCreators';
import { getProject } from '../../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        currentLocale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setLocale: locale => dispatch(setLocale(locale)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LocaleButtons);
