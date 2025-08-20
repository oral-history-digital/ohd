import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPencilAlt, FaTimes, FaAngleUp, FaAngleDown } from 'react-icons/fa';

import { Form } from 'modules/forms';
import { underscore } from 'modules/strings';
import { admin, AuthorizedContent } from 'modules/auth';
import ContentField from './ContentField';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useProjectAccessStatus } from 'modules/auth';

export default function SingleValueWithForm ({
    readOnly,
    elementType,
    type,
    multiLocale,
    value,
    validate,
    values,
    withEmpty,
    individualErrorMsg,
    optionsScope,
    obj,
    noLabel,
    linkUrls,
    collapse,
    children,
    attribute,
    data,
    onlyStatus,
    noStatusCheckbox,
    hideEmpty=false,
    user,
    editView,
    translations,
    languages,
    submitData,
}) {

    const [editing, setEditing] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [collapsed, setCollapsed] = useState(collapse);
    const isStringValue = typeof value === 'string';

    const { t, locale } = useI18n();
    const { project, projectId } = useProject();
    const { projectAccessGranted } = useProjectAccessStatus(project);

    const metadataField = Object.values(project.metadata_fields).find(m => m.name === attribute);

    const label = metadataField?.label?.[locale] ||
            t(`activerecord.attributes.${underscore(obj.type)}.${attribute}`);

    const formElements = [];
    const formElement = {
        elementType: elementType,
        type: type,
        multiLocale: multiLocale,
        attribute: attribute,
        label: label,
        validate: validate,
        data: obj,
        values: values,
        withEmpty: withEmpty,
        individualErrorMsg: individualErrorMsg,
        optionsScope: optionsScope,
    };

    const statusCheckbox = {
        elementType: 'input',
        attribute: `public_attributes][${attribute}`,
        value: obj.properties?.public_attributes?.[attribute]?.toString() === 'true',
        labelKey: 'activerecord.attributes.default.publish',
        type: 'checkbox',
    };

    formElements.push(formElement);
    if (!noStatusCheckbox) {
        formElements.push(statusCheckbox);
    }

    const form = () => (
        <Form
            scope={underscore(obj.type)}
            onSubmit={(params) => {
                submitData({project, projectId, locale}, params, {updateStateBeforeSubmit: true});
                setEditing(false)
            }}
            onCancel={() => setEditing(false)}
            formClasses='default single-value'
            className="ContentField"
            data={obj}
            elements={formElements}
        />
    );

    const show = () => {
        if (
            admin({user, editView, project}, obj, 'update') && typeof metadataField !== 'undefined' ||
            (
                (
                    (projectAccessGranted && metadataField?.use_in_details_view) ||
                    (!projectAccessGranted && metadataField?.display_on_landing_page)
                ) && (
                    obj.properties?.public_attributes?.[attribute]?.toString() === 'true' &&
                    !(hideEmpty && !value)
                )
            )
        ) {
            return (
                <ContentField
                    noLabel={noLabel}
                    label={label}
                    value={isStringValue && collapsed ? value?.substring(0,500) : value}
                    linkUrls={linkUrls}
                >
                    {
                        !readOnly && (
                            <>
                                {
                                    collapse && (
                                        <button
                                            type="button"
                                            className="Button Button--transparent Button--icon"
                                            title={t(collapsed ? 'show' : 'hide')}
                                            onClick={() => setCollapsed(!collapsed)}
                                        >
                                            {
                                                collapsed ?
                                                    <FaAngleDown className="Icon Icon--editorial" /> :
                                                    <FaAngleUp className="Icon Icon--editorial" />
                                            }
                                        </button>
                                    )
                                }
                                {children}
                                <AuthorizedContent object={obj} action="update">
                                    <button
                                        type="button"
                                        className="Button Button--transparent Button--icon"
                                        title={t(`edit.default.${editing ? 'cancel' : 'edit'}`)}
                                        onClick={() => setEditing(!editing)}
                                    >
                                        {
                                            editing ?
                                                <FaTimes className="Icon Icon--editorial" /> :
                                                <FaPencilAlt className="Icon Icon--editorial" />
                                        }
                                    </button>
                                </AuthorizedContent>
                            </>
                        )
                    }
                </ContentField>
            )
        } else {
            return null;
        }
    }

    return(
        (admin({user, editView, project}, obj, 'update') && editing) ? form() : show()
    );
}

SingleValueWithForm.propTypes = {
    obj: PropTypes.object,
    attribute: PropTypes.string,
    elementType: PropTypes.string,
    type: PropTypes.string,
    readOnly: PropTypes.bool,
    linkUrls: PropTypes.bool,
};
