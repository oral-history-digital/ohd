import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

import { Annotations } from 'modules/annotations';
import { useAuthorization } from 'modules/auth';
import { Fetch } from 'modules/data';
import { RegistryReferencesContainer } from 'modules/registry-references';
import { useWorkbook } from 'modules/workbook';
import { useProject } from 'modules/routes';

export default function SegmentPopup({
    contentLocale,
    data,
    openReference,
    popupType,
    setOpenReference,
}) {
    const { isAuthorized } = useAuthorization();
    const { project } = useProject();
    const { savedSegments: workbookAnnotations } = useWorkbook();

    const annotationsForSegment = workbookAnnotations?.filter(annotation =>
        data.user_annotation_ids.includes(annotation.id));

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
                        popupType === 'annotations' && annotationsForSegment?.map(userAnnotation => (
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
                            <Fetch
                                fetchParams={['registry_entries', null, null, `ref_object_type=Segment&ref_object_id=${data.id}`]}
                                testDataType='registry_entries'
                                testIdOrDesc={`ref_object_type_Segment_ref_object_id_${data.id}`}
                            >
                                <Fetch
                                    fetchParams={['registry_entries', project.root_registry_entry_id]}
                                    testDataType='registry_entries'
                                    testIdOrDesc={project.root_registry_entry_id}
                                >
                                    <RegistryReferencesContainer
                                        refObject={data}
                                        inTranscript={true}
                                        contentLocale={contentLocale}
                                        setOpenReference={setOpenReference}
                                    />
                                </Fetch>
                            </Fetch>
                        )
                    }

                    {
                        openReference && (
                            <div className="SegmentPopup-glossary">
                                <button
                                    type="button"
                                    className="Button Button--transparent Button--icon SegmentPopup-collapse"
                                    onClick={() => setOpenReference(null)}
                                >
                                    <FaTimes className="Icon" />
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
    setOpenReference: PropTypes.func.isRequired,
};
