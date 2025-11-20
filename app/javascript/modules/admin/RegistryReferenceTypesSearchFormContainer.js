import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    resetQuery,
    setQueryParams,
    getRegistryReferenceTypesQuery,
} from 'modules/search';
import { fetchData } from 'modules/data';
import { hideSidebar } from 'modules/sidebar';
import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getRegistryReferenceTypesQuery(state),
    scope: 'registry_reference_type',
    searchableAttributes: [
        { attributeName: 'name' },
        { attributeName: 'code' },
    ],
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            setQueryParams,
            resetQuery,
            hideSidebar,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(DataSearchForm);
