import { connect } from 'react-redux';

import Home from './Home';
import { getProjectTranslation, getShowFeaturedInterviews,
    getShowStartPageVideo, getInstitutions, getIsCampscapesProject } from 'modules/data';

const mapStateToProps = state => ({
    projectTranslation: getProjectTranslation(state),
    showStartPageVideo: getShowStartPageVideo(state),
    showFeaturedInterviews: getShowFeaturedInterviews(state),
    institutions: getInstitutions(state),
    isCampscapesProject: getIsCampscapesProject(state),
});

export default connect(mapStateToProps)(Home);
