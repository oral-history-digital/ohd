import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { DEFAULT_LOCALES } from 'modules/constants';
import { useAuthorization } from 'modules/auth';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';

export default function UploadsForm() {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const { isAuthorized } = useAuthorization();
    const { project, projectId } = useProject();
    const locales = project ? project.available_locales : DEFAULT_LOCALES;
    const uploadTypes = project?.upload_types;

    const [showForm, setShowForm] = useState(true);
    const [explanation, setExplanation] = useState('introduction');

    function handleUploadTypeChange(name, value) {
        setExplanation(value);
    }

    function returnToForm() {
        setShowForm(true);
    }

    if (!isAuthorized({ type: 'Upload' }, 'create')) {
        return null;
    }

    let link;
    switch (explanation) {
    case 'bulk_metadata':
        link = (<a href={`${pathBase}/metadata-import-template.csv`} download>{`metadata-import-template.csv`}</a>);
        break;
    case 'bulk_registry_entries':
        link = (<a href={`/registry-entries-import-template.csv`} download>{`registry-entries-import-template.csv`}</a>);
        break;
    case 'bulk_photos':
        link = (<a href={`/photos-import-template.csv`} download>{`photos-import-template.csv`}</a>);
        break;
    default:
        link = null;
    }

    return showForm ? (
        <div>
            <div>
                <p className="explanation">
                    {t(`upload.explanation.${explanation}`)}
                </p>
                {link}
            </div>
            <Form
                scope='upload'
                onSubmit={(params) => {
                    dispatch(submitData({ locale, projectId, project }, params));
                    setShowForm(false);
                }}
                submitText='edit.upload.upload'
                helpTextCode="import_form"
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'type',
                        values: uploadTypes,
                        handlechangecallback: handleUploadTypeChange,
                        withEmpty: true,
                        validate: (v) => v !== '',
                        individualErrorMsg: 'empty'
                    },
                    {
                        elementType: 'select',
                        attribute: 'lang',
                        values: locales,
                        withEmpty: true,
                        validate: (v) => /\w{2}/.test(v),
                    },
                    {
                        attribute: 'data',
                        elementType: 'input',
                        type: 'file',
                        validate: (v) => v instanceof File,
                    },
                ]}
            />
        </div>
    ) : (
        <div>
            <p>
                {t('edit.upload.processing')}
            </p>
            <button
                type="button"
                className='Button return-to-upload'
                onClick={returnToForm}
            >
                {t('edit.upload.return')}
            </button>
        </div>
    );
}
