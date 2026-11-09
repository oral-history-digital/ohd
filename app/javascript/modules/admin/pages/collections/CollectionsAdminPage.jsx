import { useState } from 'react';

import {
    getCollectionsForCurrentProject,
    getCollectionsStatus,
} from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject, useProjectIdentity } from 'modules/routes';
import { getCollectionsQuery } from 'modules/search';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useSWRConfig } from 'swr';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

const collectionFields = [
    {
        attribute: 'name',
        multiLocale: true,
        baseLocales: ['de', 'en'],
    },
    {
        attribute: 'shortname',
    },
    {
        attribute: 'publication_date',
        validate: function (v) {
            return /^\d{4}$/.test(v);
        },
    },
    {
        attribute: 'workflow_state',
        elementType: 'select',
        values: ['public', 'unshared'],
        optionsScope: 'workflow_states',
    },
    {
        attribute: 'homepage',
        multiLocale: true,
        baseLocales: ['de', 'en'],
    },
    {
        attribute: 'responsibles',
        multiLocale: true,
        baseLocales: ['de', 'en'],
        elementType: 'textarea',
        htmlOptions: { maxLength: 255 },
    },
    {
        attribute: 'notes',
        multiLocale: true,
        baseLocales: ['de', 'en'],
        elementType: 'richTextEditor',
    },
];

/**
 * Saves collection metadata and edited logo variants together.
 * @param {Object} props - Collection data, initial values, and dialog callbacks.
 * @returns {React.ReactElement} Collection editor.
 */
function CollectionForm({ data, values, onSubmit, onCancel }) {
    const { t } = useI18n();
    const { project } = useProject();
    const pathBase = usePathBase();
    const { mutate } = useSWRConfig();
    const { submitData } = useAdminDataActions();
    const [removedLogos, setRemovedLogos] = useState({});
    const logos = Object.values(data?.logos || {});
    const locales = [
        ...new Set([
            ...(project?.available_locales || []),
            'de',
            'en',
            ...logos.map((logo) => logo.locale || ''),
        ]),
    ];
    const logoFields = data
        ? locales.map((locale) => {
              const key = locale || '_default';
              const logo = logos.find((item) => (item.locale || '') === locale);

              return {
                  attribute: `logo_file_${key}`,
                  elementType: 'fileInput',
                  label: `${t('activerecord.models.logo.one')} (${locale || t('without_translation')})`,
                  accept: 'image/*',
                  preview: 'image',
                  currentFiles:
                      logo && !removedLogos[key]
                          ? {
                                name: logo.filename,
                                url: logo.thumb_src || logo.src,
                                contentType: 'image/*',
                            }
                          : [],
                  onRemoveCurrent: () =>
                      setRemovedLogos((previous) => ({
                          ...previous,
                          [key]: true,
                      })),
              };
          })
        : [];

    /**
     * Saves the collection and refreshes its explorer details when logos change.
     * @param {{collection: Object}} params - Collection form values.
     */
    function handleSubmit({ collection }) {
        const payload = { ...collection };
        const changes = {};
        for (const locale of data ? locales : []) {
            const key = locale || '_default';
            const field = `logo_file_${key}`;
            if (payload[field]) changes[key] = { file: payload[field] };
            else if (removedLogos[key]) changes[key] = { remove: true };
            delete payload[field];
        }
        const logosChanged = Object.keys(changes).length > 0;
        if (logosChanged) payload.logo_changes = changes;

        submitData({ pathBase }, { collection: payload }, undefined, () => {
            if (logosChanged) {
                mutate(
                    (key) =>
                        typeof key === 'string' &&
                        key.endsWith(`/collections/${data.id}.json?lite=1`),
                    undefined,
                    { revalidate: true }
                );
            }
            onSubmit?.();
        });
    }

    return (
        <Form
            data={data}
            values={values}
            scope="collection"
            helpTextCode="collection_form"
            submitText="submit"
            onCancel={onCancel}
            onSubmit={handleSubmit}
            elements={[...collectionFields, ...logoFields]}
        />
    );
}

CollectionForm.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.number.isRequired,
        logos: PropTypes.object,
    }),
    values: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
};

/**
 * Lists project-scoped resources without loading project details.
 * @returns {React.ReactElement} Administration list or pending project identity.
 */
export default function CollectionsAdminPage() {
    const { projectDbId } = useProjectIdentity();
    const data = useSelector(getCollectionsForCurrentProject);
    const dataStatus = useSelector(getCollectionsStatus);
    const collectionsQuery = useSelector(getCollectionsQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    if (!projectDbId) return <Spinner />;

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={{
                ...collectionsQuery,
                // Always fetch collections scoped to the current project in admin.
                for_projects: projectDbId,
            }}
            outerScope="project"
            outerScopeId={projectDbId}
            scope="collection"
            sortAttribute="name"
            sortAttributeTranslated
            detailsAttributes={[
                'name',
                'homepage',
                'responsibles',
                'notes',
                'doi_status',
            ]}
            initialFormValues={{ project_id: projectDbId }}
            form={CollectionForm}
            hideRegisterDoiAction={false}
            joinedData={{}}
            helpTextCode="collection_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
