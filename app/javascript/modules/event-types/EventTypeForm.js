import { useState} from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { submitDataWithFetch } from 'modules/api';
import { getCurrentProject } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';

const formElements = [
    {
        attribute: 'code',
        required: true,
    },
    {
        attribute: 'name',
        multiLocale: true,
    },
];

export default function EventTypeForm({
    data,
    onSubmit,
    onCancel
}) {
    const [isFetching, setIsFetching] = useState(false);
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);

    return (
        <Form
            data={data}
            values={{ project_id: project.id }}
            scope="event_type"
            onSubmit={async (params) => {
                console.log(params)
            }}
            onCancel={onCancel}
            submitText="submit"
            elements={formElements}
            fetching={isFetching}
        />
    );
}

EventTypeForm.propTypes = {
    data: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
