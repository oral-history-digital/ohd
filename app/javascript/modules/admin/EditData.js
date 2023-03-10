import { useState, Fragment } from 'react';
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
    project,
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
                    submitData({ locale, projectId, project }, params);
                    toggleEditing();
                }}
                onCancel={toggleEditing}
                submitText="submit"
                elements={formElements}
            />
        ) :
        (
            <>
                <dl className="DescriptionList">
                    {formElements.map(element => (
                        <Fragment key={element.key}>
                            <dt>
                                {t(`activerecord.attributes.${scope}.${element.attribute}`)}
                            </dt>
                            <dd>
                                {humanReadable(data, element.attribute, { translations, locale }, { collapsed: true })}
                            </dd>
                        </Fragment>
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
    project: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    translations: PropTypes.array.isRequired,
    submitData: PropTypes.func.isRequired,
};
