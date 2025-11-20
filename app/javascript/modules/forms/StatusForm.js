import { useState } from 'react';

import { AuthorizedContent } from 'modules/auth';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

export default function StatusForm({ data, scope, attribute, value }) {
    const { project, projectId } = useProject();
    const { t, locale } = useI18n();
    const dispatch = useDispatch();

    const [submitted, setSubmitted] = useState(false);
    const [editing, setEditing] = useState(false);

    return editing ? (
        <Form
            scope={scope}
            onSubmit={(params) => {
                dispatch(
                    submitData({ project, projectId, locale }, params, {
                        updateStateBeforeSubmit: true,
                    })
                );
                setEditing(false);
            }}
            onCancel={() => setEditing(false)}
            data={data}
            formClasses="default single-value"
            className="ContentField"
            elements={[
                {
                    elementType: 'input',
                    attribute: attribute,
                    value: value,
                    labelKey: 'activerecord.attributes.default.publish',
                    type: 'checkbox',
                },
            ]}
        />
    ) : (
        <AuthorizedContent object={data} action="update">
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                title={t(`edit.default.${editing ? 'cancel' : 'edit'}`)}
                onClick={() => setEditing(!editing)}
            >
                {editing ? (
                    <FaTimes className="Icon Icon--editorial" />
                ) : (
                    <FaPencilAlt className="Icon Icon--editorial" />
                )}
            </button>
        </AuthorizedContent>
    );
}
