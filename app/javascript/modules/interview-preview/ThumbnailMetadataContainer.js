import { connect } from 'react-redux';

import { getLocale, getTranslations } from 'modules/archive';
import { getInterviewee, getCurrentProject, getLanguages } from 'modules/data';
import ThumbnailMetadata from './ThumbnailMetadata';

const mapStateToProps = (state, props) => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    languages: getLanguages(state), // needed for humanReadable function
});


export default connect(mapStateToProps)(ThumbnailMetadata);
