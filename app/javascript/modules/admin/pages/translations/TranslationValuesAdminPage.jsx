import { getTranslationValues, getTranslationValuesStatus } from 'modules/data';
import { getTranslationValuesQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function TranslationValuesAdminPage() {
    const data = useSelector(getTranslationValues);
    const dataStatus = useSelector(getTranslationValuesStatus);
    const query = useSelector(getTranslationValuesQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

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
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
