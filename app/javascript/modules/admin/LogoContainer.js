import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getProjects, getCurrentAccount } from 'modules/data';
import { getLocale, getLocales, getProjectId, getTranslations } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    account: getCurrentAccount(state),
    editView: true,
    //
    scope: 'uploaded_file',
    detailsAttributes: ['src', 'locale'],
    formElements: [
        {
            attribute: "locale",
            elementType: 'select',
            values: getLocales(state),
            withEmpty: true,
        },
        {
            attribute: 'file',
            elementType: 'input',
            type: 'file',
        },
        {
            attribute: 'type',
            hidden: true,
        },
        {
            attribute: 'ref_type',
            hidden: true,
        },
        {
            attribute: 'ref_id',
            hidden: true,
        },
    ],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
