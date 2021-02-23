import { connect } from 'react-redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getProjects } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: state.archive.translations,
    account: state.data.accounts.current,
    editView: true,
    scope: 'external_link',
    detailsAttributes: ['name', 'url'],
    formElements: [
        {
            attribute: "internal_name"
        },
        {
            attribute: 'name',
            multiLocale: true,
        },
        {
            attribute: 'url',
            multiLocale: true,
        },
    ],
});

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
