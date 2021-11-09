import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, getLocale  } from 'modules/archive';
import { searchInArchive } from 'modules/search';
import { getProjects } from 'modules/data';
import { sendTimeChangeRequest } from 'modules/media-player';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import UserContent from './UserContent';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
    searchInArchive,
    setArchiveId,
    hideFlyoutTabs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserContent);
