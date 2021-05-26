import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

import { useAuthorization } from 'modules/auth';
import { Annotations } from 'modules/annotations';
import { RegistryReferencesContainer } from 'modules/registry-references';

export default function SegmentPopup({
    contentLocale,
    data,
    openReference,
    popupType,
    userContents,
    setOpenReference,
}) {
    const { isAuthorized } = useAuthorization();

    const userAnnotations = data
        .user_annotation_ids
        .map(id => userContents?.[id])
        .filter(annotation => typeof annotation !== 'undefined');

    const hasReferences = data.registry_references_count > 0;

    return (
        <div className="SegmentPopup">
            <div className="SegmentPopup-inner">
                <div className="SegmentPopup-annotations">
                    {
                        popupType === 'annotations' && (data.annotations_count > 0 || isAuthorized({type: 'Annotation', interview_id: data.interview_id}, 'create')) && (
                            <Annotations
                                segment={data}
                                contentLocale={contentLocale}
                            />
                        )
                    }
                    {
                        popupType === 'annotations' && userAnnotations.map(userAnnotation => (
                            <p
                                key={userAnnotation.id}
                                className=""
                            >
                                {userAnnotation.description}
                            </p>
                        ))
                    }
                </div>
                <div className="SegmentPopup-references RegistryReferences">
                    {
                        popupType === 'references' && (hasReferences || isAuthorized({type: 'RegistryReference', interview_id: data.interview_id}, 'create')) && (
                            <RegistryReferencesContainer
                                refObject={data}
                                lowestAllowedRegistryEntryId={1}
                                inTranscript={true}
                                locale={contentLocale}
                                setOpenReference={setOpenReference}
                            />
                        )
                    }

                    {
                        openReference && (
                            <div className="SegmentPopup-glossary">
                                <button
                                    type="button"
                                    className="IconButton SegmentPopup-collapse"
                                    onClick={() => setOpenReference(null)}
                                >
                                    <FaTimes className="IconButton-icon" />
                                </button>
                                <div className="SegmentPopup-term">
                                    {openReference.name[contentLocale]}
                                </div>
                                <div className="SegmentPopup-explanation">
                                    {openReference.notes[contentLocale]}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

SegmentPopup.propTypes = {
    contentLocale: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    openReference: PropTypes.object,
    popupType: PropTypes.string,
    userContents: PropTypes.object,
    setOpenReference: PropTypes.func.isRequired,
};
