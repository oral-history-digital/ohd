import { fetchData } from 'modules/data';
import {
    getRegistryNameTypesQuery,
    resetQuery,
    setQueryParams,
} from 'modules/search';
import { hideSidebar } from 'modules/sidebar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import DataSearchForm from './DataSearchForm';

const mapStateToProps = (state) => ({
    query: getRegistryNameTypesQuery(state),
    scope: 'registry_name_type',
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
