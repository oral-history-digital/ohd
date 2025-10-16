import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { submitFormDataWithFetch } from 'modules/api';

import { getArchiveId } from 'modules/archive';
import { getCurrentInterview, submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import useMutateMaterials from '../hooks/useMutateMaterials';

export default function MaterialForm({
    material,
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
    const mutateMaterials = useMutateMaterials(archiveId);
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
            {
                elementType: 'select',
                attribute: 'workflow_state',
                values: ['unshared', 'public'],
                value: material?.workflow_state || 'unshared',
                optionsScope: 'workflow_states',
            },
        ];

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
        mutateMaterials(async (materials) => {
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
            scope="material"
            helpTextCode="material_form"
            oldOnSubmit={(params) => {
                dispatch(submitData({ projectId, project, locale }, params));
            }}
            onSubmit={createOrUpdateMaterial}
            onCancel={onCancel}
            data={material}
            values={{
                interview_id: interview?.id,
                id: material?.id,
            }}
            elements={elements()}
            fetching={isFetching}
        />
    );
}

MaterialForm.propTypes = {
    material: PropTypes.object,
    withUpload: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};
