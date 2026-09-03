import { useCallback } from 'react';

import {
    deleteData,
    fetchData,
    getTranslationValues,
    getTranslationValuesStatus,
    submitData,
} from 'modules/data';
import { getTranslationValuesQuery, setQueryParams } from 'modules/search';
import { useDispatch, useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';

export default function TranslationValuesAdminPage() {
    const dispatch = useDispatch();
    const data = useSelector(getTranslationValues);
    const dataStatus = useSelector(getTranslationValuesStatus);
    const query = useSelector(getTranslationValuesQuery);
    const fetchAdminData = useCallback(
        (...args) => dispatch(fetchData(...args)),
        [dispatch]
    );
    const deleteAdminData = useCallback(
        (...args) => dispatch(deleteData(...args)),
        [dispatch]
    );
    const submitAdminData = useCallback(
        (...args) => dispatch(submitData(...args)),
        [dispatch]
    );
    const updateQueryParams = useCallback(
        (...args) => dispatch(setQueryParams(...args)),
        [dispatch]
    );

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={query}
            scope="translation_value"
            detailsAttributes={['key', 'value']}
            formElements={[
                {
                    attribute: 'key',
                    validate: function (v) {
                        return /^[-A-Za-z1-9._]+$/.test(v);
                    },
                },
                {
                    attribute: 'value',
                    multiLocale: true,
                },
            ]}
            joinedData={{}}
            helpTextCode="translation_value_form"
            fetchData={fetchAdminData}
            deleteData={deleteAdminData}
            submitData={submitAdminData}
            setQueryParams={updateQueryParams}
        />
    );
}
