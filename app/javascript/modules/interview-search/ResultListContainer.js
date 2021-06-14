import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId } from 'modules/archive';
import { getMediaTime } from 'modules/media-player';
import ResultList from './ResultList';

const mapStateToProps = (state) => ({
    mediaTime: getMediaTime(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ResultList);
