import PropTypes from 'prop-types';
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@reach/disclosure';
import { FaInfo } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { SingleValueWithFormContainer } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { getCollectionsForCurrentProject } from 'modules/data';
import { useProjectAccessStatus } from 'modules/auth';
import CollectionLink from './CollectionLink';

export default function InterviewCollectionInfo({ interview }) {
    const { locale, t } = useI18n();
    const { project } = useProject();
    const collections = useSelector(getCollectionsForCurrentProject);
    const { projectAccessGranted } = useProjectAccessStatus(project);

    const collection = collections?.[interview.collection_id];
    const titleText = t('modules.interview_metadata.show_collection_desc');

    return (
        <SingleValueWithFormContainer
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
                    <CollectionLink collectionId={collection.id} />
                    <DisclosurePanel>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: collection.notes[locale],
                            }}
                        />
                    </DisclosurePanel>
                </Disclosure>
            )}
        </SingleValueWithFormContainer>
    );
}

InterviewCollectionInfo.propTypes = {
    interview: PropTypes.object.isRequired,
};
