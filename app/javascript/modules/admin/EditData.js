import { useState } from 'react';

import { useHumanReadable, useSensitiveData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

export default function EditData({
    data,
    formElements,
    sensitiveAttributes = [],
    helpTextCode,
    initialFormValues,
    scope,
    submitData,
}) {
    const [editing, setEditing] = useState(false);
    const { t, locale } = useI18n();
    const { humanReadable } = useHumanReadable();
    const { project, projectId } = useProject();

    useSensitiveData(data, sensitiveAttributes);

    function toggleEditing() {
        setEditing((prev) => !prev);
    }

    return editing ? (
        <Form
            data={data}
            helpTextCode={helpTextCode}
            values={initialFormValues}
            scope={scope}
            onSubmit={(params) => {
                submitData({ locale, projectId, project }, params);
                toggleEditing();
            }}
            onCancel={toggleEditing}
            submitText="submit"
            elements={formElements}
        />
    ) : (
        <form className="default">
            <dl className="DescriptionList">
                {formElements.map((element) => (
                    <div key={element.key} className={element.className}>
                        <dt>
                            {t(
                                element.labelKey ||
                                    `activerecord.attributes.${scope}.${element.attribute}`
                            )}
                        </dt>
                        <dd>
                            {humanReadable({
                                obj: data,
                                attribute: element.attribute,
                                collapsed: true,
                            })}
                        </dd>
                    </div>
                ))}
            </dl>
            <button
                type="button"
                className="Button Button--transparent Button--icon"
                onClick={toggleEditing}
            >
                <FaPencilAlt className="Icon Icon--editorial" />{' '}
                {t('edit.default.edit')}
            </button>
        </form>
    );
}

EditData.propTypes = {
    data: PropTypes.object.isRequired,
    formElements: PropTypes.array.isRequired,
    helpTextCode: PropTypes.string,
    initialFormValues: PropTypes.array,
    scope: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
};
