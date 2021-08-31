import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getInterviewee, getCurrentProject, getProjects, getLanguages, getPeopleStatus, fetchData  } from 'modules/data';
import { getIsLoggedIn } from 'modules/account';
import ThumbnailMetadata from './ThumbnailMetadata';

const mapStateToProps = (state, props) => ({
    locale: getLocale(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    languages: getLanguages(state), // needed for humanReadable function
    isLoggedIn: getIsLoggedIn(state),
    peopleStatus: getPeopleStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ThumbnailMetadata);
