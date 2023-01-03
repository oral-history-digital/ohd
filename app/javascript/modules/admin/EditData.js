import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';

import { Form } from 'modules/forms';
import { humanReadable } from 'modules/data';
import { useI18n } from 'modules/i18n';

export default function EditData({
    data,
    formElements,
    helpTextCode,
    initialFormValues,
    translations,
    locale,
    projectId,
    projects,
    scope,
    submitData,
}) {
    const [editing, setEditing] = useState(false);
    const { t } = useI18n();

    function toggleEditing() {
        setEditing(prev => !prev);
    }

    return editing ?
        (
            <Form
                data={data}
                helpTextCode={helpTextCode}
                values={initialFormValues}
                scope={scope}
                onSubmit={params => {
                    submitData({ locale, projectId, projects }, params);
                    toggleEditing();
                }}
                onCancel={toggleEditing}
                submitText="submit"
                elements={formElements}
            />
        ) :
        (
            <>
                {formElements.map(element => (
                    <p key={element.key}>
                        <span className="flyout-content-label">
                            {t(`activerecord.attributes.${scope}.${element.attribute}`)}:
                        </span>
                        <span className="flyout-content-data">
                            {humanReadable(data, element.attribute, { translations, locale }, { collapsed: true })}
                        </span>
                    </p>
                ))}
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t('edit.default.edit')}
                    onClick={toggleEditing}
                >
                    {
                        editing ?
                            <FaTimes className="Icon Icon--editorial" /> :
                            <FaPencilAlt className="Icon Icon--editorial" />
                    }
                </button>
            </>
        );
}

EditData.propTypes = {
    data: PropTypes.object.isRequired,
    formElements: PropTypes.array.isRequired,
    helpTextCode: PropTypes.string,
    initialFormValues: PropTypes.array,
    locale: PropTypes.string.isRequired,
    locales: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    translations: PropTypes.array.isRequired,
    submitData: PropTypes.func.isRequired,
};
