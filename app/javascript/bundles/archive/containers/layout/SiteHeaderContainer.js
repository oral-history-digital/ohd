import { connect } from 'react-redux';

import SiteHeader from '../../components/layout/SiteHeader';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
});

export default connect(mapStateToProps)(SiteHeader);
