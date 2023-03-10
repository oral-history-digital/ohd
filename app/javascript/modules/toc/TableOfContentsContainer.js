import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentProject, getHeadingsFetched, getHeadings, getPreparedHeadings } from 'modules/data';
import { getLocale, getProjectId, getArchiveId } from 'modules/archive';
import { getIsIdle } from 'modules/media-player';
import TableOfContents from './TableOfContents';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    archiveId: getArchiveId(state),
    headingsFetched: getHeadingsFetched(state),
    headings: getHeadings(state),
    preparedHeadings: getPreparedHeadings(state),
    isIdle: getIsIdle(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);
