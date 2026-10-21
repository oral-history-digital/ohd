import { useState } from 'react';

import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

/**
 * Creates or edits a person or organization, with translated name fields.
 * @param {Object} props - Affiliate record, resource scope, initial values, and save/cancel callbacks.
 * @returns {React.ReactElement} Affiliate form with fields for the selected name type.
 */
export default function AffiliateForm({
    data,
    scope,
    onSubmit,
    onCancel,
    values,
}) {
    const pathBase = usePathBase();
    const dispatch = useDispatch();

    const [isPersonal, setIsPersonal] = useState(
        data?.name_type === 'Personal'
    );

    const handleNameTypeChange = (_, value) => {
        setIsPersonal(value === 'Personal');
    };

    return (
        <Form
            scope={scope}
            onSubmit={(params) => {
                dispatch(
                    submitData(
                        { pathBase },
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
    values: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
