import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@reach/disclosure';
import { useProjectAccessStatus } from 'modules/auth';
import { getCollectionsForCurrentProject } from 'modules/data';
import { SingleValueWithForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { sanitizeHtml } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaInfo } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import CatalogLink from './CatalogLink';

/**
 * Shows the interview's collection and editing controls allowed by project access.
 *
 * @param {Object} props - Collection display properties.
 * @param {Object} props.interview - Interview with an optional collection ID.
 * @returns {React.ReactElement|null} Collection details, request status, or nothing for an unshared collection.
 */
export default function InterviewCollectionInfo({ interview }) {
    const { locale, t } = useI18n();
    const { project, isLoading, error } = useProject({});
    const collections = useSelector(getCollectionsForCurrentProject);
    const { projectAccessGranted } = useProjectAccessStatus(project);

    const collection = collections?.[interview.collection_id];
    const titleText = t('modules.interview_metadata.show_collection_desc');

    if (collection?.workflow_state === 'unshared') return null;

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;

    return (
        <SingleValueWithForm
            elementType="select"
            obj={interview}
            values={collections}
            withEmpty={true}
            //validate={function(v){return /^\d+$/.test(v)}}
            individualErrorMsg="empty"
            attribute="collection_id"
            value={collection?.name[locale]}
            projectAccessGranted={projectAccessGranted}
            hideEmpty
        >
            {collection && (
                <Disclosure>
                    <DisclosureButton className="Button">
                        <FaInfo title={titleText} aria-label={titleText} />
                    </DisclosureButton>
                    <CatalogLink type="collection" id={collection.id} />
                    <DisclosurePanel>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: sanitizeHtml(
                                    collection.notes[locale],
                                    'RICH_TEXT'
                                ),
                            }}
                        />
                    </DisclosurePanel>
                </Disclosure>
            )}
        </SingleValueWithForm>
    );
}

InterviewCollectionInfo.propTypes = {
    interview: PropTypes.object.isRequired,
};
