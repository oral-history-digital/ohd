import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { submitFormDataWithFetch } from 'modules/api';

import { getArchiveId } from 'modules/archive';
import { getCurrentInterview, submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import useMutatePDFMaterials from '../hooks/useMutatePDFMaterials';

export default function PDFForm({
    pdf,
    withUpload = false,
    onSubmit,
    onCancel,
}) {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    const pathBase = usePathBase();
    const { projectId, project } = useProject();
    const archiveId = useSelector(getArchiveId);
    const interview = useSelector(getCurrentInterview);
    const mutatePDFMaterials = useMutatePDFMaterials(archiveId);
    const [isFetching, setIsFetching] = useState(false);

    function elements() {
        let elements = [
            {
                attribute: 'title',
                multiLocale: true,
            },
            {
                attribute: 'description',
                multiLocale: true,
            },
        ];

        if (pdf?.id) {
            elements.push({
                elementType: 'select',
                attribute: 'workflow_state',
                values: ['unshared', 'public'],
                value: pdf.workflow_state || 'unshared',
                optionsScope: 'workflow_states',
            });
        }

        if (withUpload) {
            elements.push({
                attribute: 'data',
                elementType: 'input',
                type: 'file',
                accept: 'application/pdf',
                validate: function (v) {
                    return v instanceof File;
                },
            });
        }

        return elements;
    }

    async function createOrUpdateMaterial(params) {
        mutatePDFMaterials(async (materials) => {
            setIsFetching(true);
            const result = await submitFormDataWithFetch(pathBase, params);
            const updatedMaterial = result.data;

            // Other stuff that needs to be done after result is returned.
            setIsFetching(false);

            const updatedMaterials = {
                ...materials,
                data: {
                    ...materials.data,
                    [updatedMaterial.id]: updatedMaterial,
                },
            };
            return updatedMaterials;
        });

        if (typeof onSubmit === 'function') {
            onSubmit();
        }
    }

    return (
        <Form
            scope="pdf"
            helpTextCode="pdf_form"
            oldOnSubmit={(params) => {
                console.log(params);
                dispatch(submitData({ projectId, project, locale }, params));
            }}
            onSubmit={createOrUpdateMaterial}
            onCancel={onCancel}
            data={pdf}
            values={{
                interview_id: interview?.id,
                id: pdf?.id,
            }}
            elements={elements()}
            fetching={isFetching}
        />
    );
}

PDFForm.propTypes = {
    pdf: PropTypes.object,
    withUpload: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
