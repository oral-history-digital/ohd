import { useState } from 'react';

import { useAuthorization } from 'modules/auth';
import { DEFAULT_LOCALES } from 'modules/constants';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { useDispatch } from 'react-redux';

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

    function getLinkData(explanation) {
        switch (explanation) {
            case 'bulk_metadata':
                return [
                    `${pathBase}/metadata-import-template.csv`,
                    'metadata-import-template.csv',
                ];
            case 'bulk_registry_entries':
                return [
                    `/registry-entries-import-template.csv`,
                    'registry-entries-import-template.csv',
                ];
            case 'bulk_photos':
                return [
                    `/photos-import-template.csv`,
                    'photos-import-template.csv',
                ];
            default:
                return null;
        }
    }

    const linkData = getLinkData(explanation);

    return showForm ? (
        <div>
            <div>
                <p className="explanation">
                    {t(`upload.explanation.${explanation}`)}
                </p>
                {linkData && (
                    <p className="u-mt u-mb">
                        <a
                            className="Button Button--secondaryAction"
                            href={linkData[0]}
                            download
                        >
                            {linkData[1]}
                        </a>
                    </p>
                )}
            </div>
            <Form
                scope="upload"
                onSubmit={(params) => {
                    dispatch(
                        submitData({ locale, projectId, project }, params)
                    );
                    setShowForm(false);
                }}
                submitText="edit.upload.upload"
                helpTextCode="import_form"
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'type',
                        values: uploadTypes,
                        handlechangecallback: handleUploadTypeChange,
                        withEmpty: true,
                        validate: (v) => v !== '',
                        individualErrorMsg: 'empty',
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
            <p>{t('edit.upload.processing')}</p>
            <button
                type="button"
                className="Button return-to-upload"
                onClick={returnToForm}
            >
                {t('edit.upload.return')}
            </button>
        </div>
    );
}
