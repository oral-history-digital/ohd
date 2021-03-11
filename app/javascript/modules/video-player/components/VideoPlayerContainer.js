import {connect} from 'react-redux';

import { getFlyoutTabsVisible } from 'modules/flyout-tabs';
import { getCurrentInterviewee } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import { getTranscriptScrollEnabled } from 'modules/interview';
import VideoPlayer from './VideoPlayer';

const mapStateToProps = state => ({
    flyoutTabsVisible: getFlyoutTabsVisible(state),
    interviewee: getCurrentInterviewee(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
});

export default connect(mapStateToProps)(VideoPlayer);
