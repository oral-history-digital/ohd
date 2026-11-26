import { useState } from 'react';

import { getArchiveId } from 'modules/archive';
import {
    getCurrentInterview,
    getMarkTextStatus,
    submitData,
} from 'modules/data';
import { Form, SingleTextInputForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { useDispatch, useSelector } from 'react-redux';

/**
 * Submits text replacements for the interview's selected transcript language.
 *
 * @returns {React.ReactElement} Replacement form and status message.
 */
export default function MarkTextForm() {
    const archiveId = useSelector(getArchiveId);
    const interview = useSelector(getCurrentInterview);
    const markTextStatus = useSelector(getMarkTextStatus);
    const dispatch = useDispatch();
    const { t } = useI18n();
    const pathBase = usePathBase();
    const [showForm, setShowForm] = useState(true);

    const showMarkedText = (value) => {
        return (
            <span>
                {value.text_to_mark}: {value.replacement}
            </span>
        );
    };

    const form = () => {
        if (showForm) {
            return (
                <Form
                    scope="mark_text"
                    onSubmit={function (params) {
                        dispatch(submitData({ pathBase }, params));
                        setShowForm(false);
                    }}
                    helpTextCode="mark_text_form"
                    values={{
                        id: interview.archive_id,
                    }}
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'locale',
                            values: interview.alpha3s.reduce((acc, alpha3) => {
                                acc[alpha3] = { name: t(alpha3) };
                                return acc;
                            }, {}),
                            doNotTranslate: true,
                            withEmpty: true,
                            validate: function (v) {
                                return v !== '';
                            },
                            individualErrorMsg: 'empty',
                        },
                    ]}
                    nestedScopeProps={[
                        {
                            formComponent: SingleTextInputForm,
                            formProps: {},
                            parent: interview,
                            scope: 'text',
                            elementRepresentation: showMarkedText,
                        },
                    ]}
                />
            );
        }
    };

    const msg = () => {
        let text = markTextStatus[`for_interviews_${archiveId}`]
            ? t('edit.text.' + markTextStatus[`for_interviews_${archiveId}`])
            : t('edit.mark_text.explanation');
        return (
            <div>
                <p>{text}</p>
            </div>
        );
    };

    return (
        <div>
            {msg()}
            {form()}
        </div>
    );
}
