import {
    InstitutionTile,
    deleteData,
    fetchData,
    getInstitutions,
    getInstitutionsStatus,
    getStatuses,
    submitData,
} from 'modules/data';
import { getCookie } from 'modules/persistence';
import { getInstitutionsQuery, setQueryParams } from 'modules/search';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LogosContainer from './LogosContainer';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => ({
    editView: getCookie('editView') === 'true',
    data: getInstitutions(state),
    dataStatus: getInstitutionsStatus(state),
    statuses: getStatuses(state),
    otherDataToLoad: ['institution', 'collection'],
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
    helpTextCode: 'institution_form',
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
            setQueryParams,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
