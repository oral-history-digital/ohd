import { useState } from 'react';

import { AuthorizedContent } from 'modules/auth';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

export default function StatusForm({
    data,
    scope,
    attribute,
    value,
    labelKey = 'activerecord.attributes.default.publish',
}) {
    const { project, projectId } = useProject();
    const { t, locale } = useI18n();
    const dispatch = useDispatch();

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
                    labelKey: labelKey,
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

StatusForm.propTypes = {
    data: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    attribute: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    labelKey: PropTypes.string,
};
