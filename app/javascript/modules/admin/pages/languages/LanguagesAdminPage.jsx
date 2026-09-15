import { getLanguages, getLanguagesStatus } from 'modules/data';
import { getLanguagesQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function LanguagesAdminPage() {
    const data = useSelector(getLanguages);
    const dataStatus = useSelector(getLanguagesStatus);
    const query = useSelector(getLanguagesQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

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
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
