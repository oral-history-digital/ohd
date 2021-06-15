import { connect } from 'react-redux';

import { getMediaTime } from 'modules/media-player';
import ResultList from './ResultList';

const mapStateToProps = (state) => ({
    mediaTime: getMediaTime(state),
});

export default connect(mapStateToProps)(ResultList);
