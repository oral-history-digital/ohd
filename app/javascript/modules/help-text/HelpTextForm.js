import { useState } from 'react';

import { submitDataWithFetch } from 'modules/api';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';

import useMutateHelpTexts from './useMutateHelpTexts';

const formElements = [
    {
        attribute: 'code',
        readOnly: true,
    },
    {
        attribute: 'description',
        readOnly: true,
    },
    {
        attribute: 'text',
        elementType: 'textarea',
        multiLocale: true,
    },
    {
        attribute: 'url',
        multiLocale: true,
    },
];

export default function HelpTextForm({ data, onSubmit, onCancel }) {
    const [isFetching, setIsFetching] = useState(false);
    const mutateHelpTexts = useMutateHelpTexts();
    const pathBase = usePathBase();

    return (
        <div>
            <h3 className="u-mt-none u-mb">{data.code}</h3>
            <Form
                data={data}
                values={{}}
                scope="help_text"
                helpTextCode="help_text_form"
                onSubmit={async (params) => {
                    setIsFetching(true);
                    await submitDataWithFetch(pathBase, params);
                    setIsFetching(false);
                    mutateHelpTexts();

                    if (typeof onSubmit === 'function') {
                        onSubmit();
                    }
                }}
                onCancel={onCancel}
                submitText="submit"
                elements={formElements}
                fetching={isFetching}
            />
        </div>
    );
}

HelpTextForm.propTypes = {
    data: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
