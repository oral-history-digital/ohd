import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import VizSensor from 'react-visibility-sensor/visibility-sensor';

import { RegistryReferencesContainer } from 'modules/registry-references';
import { Annotations } from 'modules/annotations';
import { SubmitOnBlurForm } from 'modules/forms';
import { formatTimecode } from 'modules/interview-helpers';
import permittedColumns from './permittedColumns';

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

    function columnElement(columnName) {
        switch (columnName) {
            case 'timecode': {
              return (
                    <div
                        id={`segment_${segment.id}`}
                        className={classNames('segment', active ? 'active' : 'inactive')}
                        onClick={() => sendTimeChangeRequest(segment.tape_nbr, segment.time)}
                    >
                        {`${segment.tape_nbr} - ${formatTimecode(segment.time)}`}
                    </div>
              );
            }
            case 'text_orig': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={originalLocale}
                        attribute='text'
                        type='textarea'
                    />
                );
            }
            case 'text_translated': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={translationLocale}
                        attribute='text'
                        type='textarea'
                    />
                );
            }
            case 'mainheading_orig': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={originalLocale}
                        attribute='mainheading'
                        type='input'
                    />
                );
            }
            case 'mainheading_translated': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={translationLocale}
                        attribute='mainheading'
                        type='input'
                    />
                );
            }
            case 'subheading_orig': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={originalLocale}
                        attribute='subheading'
                        type='input'
                    />
                );
            }
            case 'subheading_translated': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={translationLocale}
                        attribute='subheading'
                        type='input'
                    />
                );
            }
            case 'registry_references': {
                return (
                    <RegistryReferencesContainer
                        refObject={segment}
                        parentEntryId={1}
                        locale={locale}
                    />
                );
            }
            case 'annotations': {
                return (
                    <Annotations segment={segment} contentLocale={locale} />
                );
            }
        }
    }

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
                    columns.map(column => (
                        <td key={column}>
                            {isVisible && columnElement(column)}
                        </td>
                    ))
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
