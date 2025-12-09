import { getLocale } from 'modules/archive';
import { connect } from 'react-redux';

import FormComponent from './FormComponent';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
});

export default connect(mapStateToProps)(FormComponent);
