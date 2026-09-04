import { getProjectLocales } from 'modules/data';
import { useSelector } from 'react-redux';

import DataList from './DataList';
import { useAdminDataActions } from './hooks';

export default function Logos() {
    const locales = useSelector(getProjectLocales);
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    return (
        <DataList
            editView
            scope="logo"
            detailsAttributes={['src', 'locale']}
            formElements={[
                {
                    attribute: 'locale',
                    elementType: 'select',
                    values: locales,
                    withEmpty: true,
                },
                {
                    attribute: 'file',
                    elementType: 'fileInput',
                    preview: 'image',
                },
            ]}
            helpTextCode="logo_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
