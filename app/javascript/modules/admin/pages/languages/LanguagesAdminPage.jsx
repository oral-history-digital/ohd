import { useCallback } from 'react';

import {
    deleteData,
    fetchData,
    getLanguages,
    getLanguagesStatus,
    submitData,
} from 'modules/data';
import { getLanguagesQuery, setQueryParams } from 'modules/search';
import { useDispatch, useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';

export default function LanguagesAdminPage() {
    const dispatch = useDispatch();
    const data = useSelector(getLanguages);
    const dataStatus = useSelector(getLanguagesStatus);
    const query = useSelector(getLanguagesQuery);
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
            scope="language"
            detailsAttributes={['code', 'name']}
            formElements={[
                {
                    attribute: 'code',
                },
                {
                    attribute: 'name',
                    multiLocale: true,
                },
            ]}
            joinedData={{}}
            helpTextCode="language_form"
            fetchData={fetchAdminData}
            deleteData={deleteAdminData}
            submitData={submitAdminData}
            setQueryParams={updateQueryParams}
        />
    );
}
