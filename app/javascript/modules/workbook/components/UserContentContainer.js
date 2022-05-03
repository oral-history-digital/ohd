import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, getLocale, getTranslations  } from 'modules/archive';
import { getProjects } from 'modules/data';
import { sendTimeChangeRequest } from 'modules/media-player';
import { hideSidebar, setSidebarTabsIndex } from 'modules/sidebar';
import UserContent from './UserContent';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
    setArchiveId,
    hideSidebar,
    setSidebarTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
