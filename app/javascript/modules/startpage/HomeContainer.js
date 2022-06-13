import { connect } from 'react-redux';

import Home from './Home';
import { getCurrentProject, getProjectTranslation, getShowFeaturedInterviews,
    getShowStartPageVideo, getInstitutions, getIsCampscapesProject } from 'modules/data';

const mapStateToProps = state => ({
    project: getCurrentProject(state),
    projectTranslation: getProjectTranslation(state),
    showStartPageVideo: getShowStartPageVideo(state),
    showFeaturedInterviews: getShowFeaturedInterviews(state),
    institutions: getInstitutions(state),
    isCampscapesProject: getIsCampscapesProject(state),
});

export default connect(mapStateToProps)(Home);
