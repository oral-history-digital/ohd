import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { setQueryParams, getInstitutionsQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getProjects, getCurrentUser,
    getInstitutions, getInstitutionsStatus, getProjectLocales,
    getProjectHasMap, InstitutionTile } from 'modules/data';
import { getCookie } from 'modules/persistence';
import DataList from './DataList';
import LogosContainer from './LogosContainer';
import { INDEX_INSTITUTIONS } from 'modules/sidebar';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    user: getCurrentUser(state),
    editView: getCookie('editView') === 'true',
    data: getInstitutions(state),
    dataStatus: getInstitutionsStatus(state),
    resultPagesCount: getInstitutionsStatus(state).resultPagesCount,
    query: getInstitutionsQuery(state),
    scope: 'institution',
    detailsAttributes: ['name', 'description'],
    formElements: [
        {
            attribute: 'name',
            multiLocale: true,
        },
        {
            attribute: 'shortname',
        },
        {
            attribute: 'description',
            elementType: 'textarea',
            multiLocale: true,
        },
        {
            attribute: 'street',
        },
        {
            attribute: 'zip',
        },
        {
            attribute: 'city',
        },
        {
            attribute: 'country',
        },
        {
            attribute: 'latitude',
        },
        {
            attribute: 'longitude',
        },
        {
            attribute: 'isil',
        },
        {
            attribute: 'gnd',
        },
        {
            attribute: 'website',
        },
        {
            attribute: 'parent_id',
            elementType: 'select',
            values: getInstitutions(state),
            withEmpty: true,
        },
    ],
    joinedData: { logo: LogosContainer },
    showComponent: InstitutionTile,
    helpTextCode: 'institution_form'
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

//export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
export default connect(mapStateToProps, mapDispatchToProps)(DataList);
