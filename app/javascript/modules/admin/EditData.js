import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt } from 'react-icons/fa';

import { Form } from 'modules/forms';
import { humanReadable, useSensitiveData } from 'modules/data';
import { useProject } from 'modules/routes';
import { useI18n } from 'modules/i18n';

export default function EditData({
    data,
    formElements,
    sensitiveAttributes = [],
    helpTextCode,
    initialFormValues,
    translations,
    scope,
    submitData,
}) {
    const [editing, setEditing] = useState(false);
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    useSensitiveData(data, sensitiveAttributes);

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
                    submitData({ locale, projectId, project }, params);
                    toggleEditing();
                }}
                onCancel={toggleEditing}
                submitText="submit"
                elements={formElements}
            />
        ) :
        (
            <form className='default'>
                <dl className="DescriptionList">
                    {formElements.map(element => (
                        <div key={element.key} className={element.className}>
                            <dt>
                                {t(element.labelKey || `activerecord.attributes.${scope}.${element.attribute}`)}
                            </dt>
                            <dd>
                                {humanReadable(data, element.attribute, { translations, locale }, { collapsed: true })}
                            </dd>
                        </div>
                    ))}
                </dl>
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    onClick={toggleEditing}
                >
                    <FaPencilAlt className="Icon Icon--editorial" />
                    {' '}
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
    translations: PropTypes.array.isRequired,
    submitData: PropTypes.func.isRequired,
};
