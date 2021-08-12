import { useState } from 'react';
import PropTypes from 'prop-types';
import VizSensor from 'react-visibility-sensor/visibility-sensor';

import permittedColumns from './permittedColumns';

import { TimecodeCell, OriginalTextCell, OriginalMainheadingCell, OriginalSubheadingCell,
    TranslationTextCell, TranslationMainheadingCell, TranslationSubheadingCell,
    RegistryReferencesCell, AnnotationsCell } from './cells-components';

const columnToComponent = {
    timecode:               TimecodeCell,
    text_orig:              OriginalTextCell,
    text_translated:        TranslationTextCell,
    mainheading_orig:       OriginalMainheadingCell,
    mainheading_translated: TranslationMainheadingCell,
    subheading_orig:        OriginalSubheadingCell,
    subheading_translated:  TranslationSubheadingCell,
    registry_references:    RegistryReferencesCell,
    annotations:            AnnotationsCell,
};

const mapColumnToComponent = column => columnToComponent[column];

export default function SegmentEditView({
    segment,
    active,
    originalLocale,
    translationLocale,
    locale,
    account,
    editView,
    project,
    interview,
    selectedInterviewEditViewColumns,
    sendTimeChangeRequest,
}) {
    const [isVisible, setIsVisible] = useState(false);

    const columns = selectedInterviewEditViewColumns.filter(
        v => permittedColumns({ account, editView, project }, interview.id).includes(v)
    );

    return (
        <VizSensor
            partialVisibility
            onChange={setIsVisible}
        >
            <tr className="segment-row">
                {
                    columns.map(column => {
                        const CellComponent = mapColumnToComponent(column);

                        return (
                            <td key={column}>
                                {
                                    isVisible && (
                                        <CellComponent
                                            segment={segment}
                                            originalLocale={originalLocale}
                                            translationLocale={translationLocale}
                                            locale={locale}
                                            active={active}
                                            sendTimeChangeRequest={sendTimeChangeRequest}
                                        />
                                    )
                                }
                            </td>
                        );
                    })
                }
            </tr>
        </VizSensor>
    );
}

SegmentEditView.propTypes = {
    segment: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    originalLocale: PropTypes.string.isRequired,
    translationLocale: PropTypes.string.isRequired,
    selectedInterviewEditViewColumns: PropTypes.array.isRequired,
    interview: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
