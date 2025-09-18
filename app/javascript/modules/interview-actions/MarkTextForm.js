import { useState } from 'react';

import { Form, SingleTextInputFormContainer } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';

export default function MarkTextForm({
    submitData,
    interview,
    archiveId,
    markTextStatus,
}) {

    const { t, locale } = useI18n();
    const { project } = useProject();
    const [showForm, setShowForm] = useState(true);

    const showMarkedText = (value) => {
        return (
            <span>{value.text_to_mark}: {value.replacement}</span>
        )
    }

    const form = () => {
        if (showForm) {
            return (
                <Form
                    scope='mark_text'
                    onSubmit={function(params){submitData({project, locale}, params); setShowForm(false)}}
                    helpTextCode="mark_text_form"
                    values={{
                        id: interview.archive_id
                    }}
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'locale',
                            values: interview.alpha3s.reduce((acc, alpha3) => {
                                acc[alpha3] = {name: t(alpha3)};
                                return acc;
                            }, {}),
                            doNotTranslate: true,
                            withEmpty: true,
                            validate: function(v){return v !== ''},
                            individualErrorMsg: 'empty'
                        },
                    ]}

                    nestedScopeProps={[{
                        formComponent: SingleTextInputFormContainer,
                        formProps: {},
                        parent: interview,
                        scope: 'text',
                        elementRepresentation: showMarkedText,
                    }]}
                />
            )
        }
    }

    const msg = () => {
        let text = markTextStatus[`for_interviews_${archiveId}`] ?
            t('edit.text.' + markTextStatus[`for_interviews_${archiveId}`]) :
            t('edit.mark_text.explanation')
        if (
            //markTextStatus[`for_interviews_${archiveId}`]
            //!showForm
            true
        ) {
            return (
                <div>
                    <p>
                        {text}
                    </p>
                </div>
            )
        }
    }

    return (
        <div>
            {msg()}
            {form()}
        </div>
    )
}
