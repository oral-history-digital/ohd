import { connect } from 'react-redux';

import SiteHeader from '../../components/layout/SiteHeader';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    translations: state.archive.translations,
});

export default connect(mapStateToProps)(SiteHeader);
