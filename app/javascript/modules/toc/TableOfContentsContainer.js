import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getHeadingsFetched, getHeadings } from 'modules/data';
import { getArchiveId } from 'modules/archive';
import { getIsIdle } from 'modules/media-player';
import TableOfContents from './TableOfContents';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    headingsFetched: getHeadingsFetched(state),
    headings: getHeadings(state),
    isIdle: getIsIdle(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);
