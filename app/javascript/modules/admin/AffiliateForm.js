import { useState } from 'react';

import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

export default function AffiliateForm({
    data,
    scope,
    onSubmit,
    onCancel,
    values,
}) {
    const { locale } = useI18n();
    const { project, projectId } = useProject();
    const dispatch = useDispatch();

    const [isPersonal, setIsPersonal] = useState(
        data?.name_type === 'Personal'
    );

    const handleNameTypeChange = (name, value) => {
        setIsPersonal(value === 'Personal');
    };

    return (
        <Form
            scope={scope}
            onSubmit={(params) => {
                dispatch(
                    submitData(
                        { locale, projectId, project },
                        params,
                        {},
                        typeof onSubmit === 'function' ? onSubmit : undefined
                    )
                );
            }}
            onCancel={onCancel}
            data={data}
            values={values}
            elements={[
                {
                    attribute: 'name',
                    hidden: isPersonal,
                    multiLocale: true,
                    baseLocales: ['de', 'en'],
                },
                {
                    attribute: 'first_name',
                    hidden: !isPersonal,
                    multiLocale: true,
                    baseLocales: ['de', 'en'],
                },
                {
                    attribute: 'last_name',
                    hidden: !isPersonal,
                    multiLocale: true,
                    baseLocales: ['de', 'en'],
                },
                {
                    attribute: 'name_type',
                    elementType: 'select',
                    values: ['Organizational', 'Personal'],
                    withEmpty: true,
                    handlechangecallback: handleNameTypeChange,
                },
            ]}
        />
    );
}

AffiliateForm.propTypes = {
    data: PropTypes.object,
    scope: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
