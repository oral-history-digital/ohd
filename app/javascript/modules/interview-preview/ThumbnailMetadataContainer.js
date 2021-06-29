import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getInterviewee, getCurrentProject } from 'modules/data';
import ThumbnailMetadata from './ThumbnailMetadata';

const mapStateToProps = (state, props) => ({
    locale: getLocale(state),
    project: getCurrentProject(state),
    translations: getTranslations(state),
    interviewee: getInterviewee(state, props),
});


export default connect(mapStateToProps)(ThumbnailMetadata);
