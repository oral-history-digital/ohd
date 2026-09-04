import {
    InstitutionTile,
    getInstitutions,
    getInstitutionsStatus,
    getStatuses,
} from 'modules/data';
import { getCookie } from 'modules/persistence';
import { getInstitutionsQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../components';
import Logos from '../components/Logos';
import { useAdminDataActions } from '../hooks';

export default function InstitutionsAdminPage() {
    const data = useSelector(getInstitutions);
    const dataStatus = useSelector(getInstitutionsStatus);
    const statuses = useSelector(getStatuses);
    const query = useSelector(getInstitutionsQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    return (
        <PaginatedAdminRecordList
            editView={getCookie('editView') === 'true'}
            data={data}
            dataStatus={dataStatus}
            statuses={statuses}
            otherDataToLoad={['institution', 'collection']}
            resultPagesCount={dataStatus.resultPagesCount}
            query={query}
            scope="institution"
            detailsAttributes={['name', 'description']}
            formElements={[
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
                    values: data,
                    withEmpty: true,
                },
            ]}
            joinedData={{ logo: Logos }}
            showComponent={InstitutionTile}
            helpTextCode="institution_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
