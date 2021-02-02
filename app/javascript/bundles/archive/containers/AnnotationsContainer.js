import { connect } from 'react-redux';

import Annotations from '../components/Annotations';
import { openArchivePopup } from 'modules/ui';
import { fetchData } from 'modules/data';
import { getLocale, getTranslations } from 'modules/archive';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Annotations);
