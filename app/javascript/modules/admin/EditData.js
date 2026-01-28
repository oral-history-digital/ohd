import { useState } from 'react';

import { useHumanReadable, useSensitiveData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { isEmptyHtml, sanitizeHtml } from 'modules/utils';
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

    function handleSave(params) {
        submitData(
            { locale, projectId, project },
            params,
            { updateStateBeforeSubmit: true }, // Optimistic UI update
            () => {
                setEditing(false);
            }
        );
    }

    return editing ? (
        <Form
            data={data}
            helpTextCode={helpTextCode}
            values={initialFormValues}
            scope={scope}
            onSubmit={(params) => {
                handleSave(params);
            }}
            onCancel={toggleEditing}
            submitText="submit"
            elements={formElements}
        />
    ) : (
        <form className="default">
            <dl className="DescriptionList">
                {formElements.map((element) => (
                    <div
                        key={element.key}
                        className={`DescriptionList-group ${element.className || ''}`}
                    >
                        <dt className="DescriptionList-term">
                            {t(
                                element.labelKey ||
                                    `activerecord.attributes.${scope}.${element.attribute}`
                            )}
                        </dt>
                        <dd className="DescriptionList-description">
                            {element.elementType === 'richTextEditor'
                                ? (() => {
                                      const content = humanReadable({
                                          obj: data,
                                          attribute: element.attribute,
                                          collapsed: true,
                                      });
                                      const sanitized = sanitizeHtml(
                                          content,
                                          'RICH_TEXT'
                                      );
                                      return isEmptyHtml(sanitized) ? (
                                          '---'
                                      ) : (
                                          <div
                                              dangerouslySetInnerHTML={{
                                                  __html: sanitized,
                                              }}
                                          />
                                      );
                                  })()
                                : humanReadable({
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
    sensitiveAttributes: PropTypes.array,
    submitData: PropTypes.func.isRequired,
};
