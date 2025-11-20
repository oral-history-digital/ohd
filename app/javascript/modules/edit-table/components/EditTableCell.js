import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Annotations } from 'modules/annotations';
import { Fetch } from 'modules/data';
import { SubmitOnBlurForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import { sendTimeChangeRequest } from 'modules/media-player';
import { RegistryReferencesContainer } from 'modules/registry-references';
import fieldHasData from './fieldHasData';

export default function EditTableCell({ type, segment, originalLocale }) {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    let alpha3Locale, attribute;

    if (/annotation/.test(type)) {
        alpha3Locale = type.split('_').pop();
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': segment.annotations_count !== 0,
                })}
            >
                <Annotations segment={segment} contentLocale={alpha3Locale} />
            </div>
        );
    } else if (/transcript|translation|heading/.test(type)) {
        alpha3Locale =
            type === 'transcript' ? originalLocale : type.split('_').pop();
        attribute = /heading/.test(type) ? type.split('_').shift() : 'text';
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': fieldHasData(segment[attribute][alpha3Locale]),
                })}
            >
                <SubmitOnBlurForm
                    data={segment}
                    scope="segment"
                    locale={alpha3Locale}
                    attribute={attribute}
                    type={attribute === 'heading' ? 'input' : 'textarea'}
                />
            </div>
        );
    } else if (type === 'timecode') {
        return (
            <div className="EditTable-cell">
                <button
                    type="button"
                    id={`segment_${segment.id}`}
                    className="Button EditTable-button"
                    onClick={() =>
                        dispatch(
                            sendTimeChangeRequest(
                                segment.tape_nbr,
                                segment.time
                            )
                        )
                    }
                >
                    {segment.tape_nbr} – {formatTimecode(segment.time)}
                </button>
            </div>
        );
    } else if ('registry_references') {
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': segment.registry_references_count !== 0,
                })}
            >
                <Fetch
                    fetchParams={[
                        'registry_entries',
                        null,
                        null,
                        `ref_object_type=Segment&ref_object_id=${segment.id}`,
                    ]}
                    testDataType="registry_entries"
                    testIdOrDesc={`ref_object_type_Segment_ref_object_id_${segment.id}`}
                >
                    <RegistryReferencesContainer
                        refObject={segment}
                        parentEntryId={1}
                        locale={locale}
                    />
                </Fetch>
            </div>
        );
    } else {
    }
}

EditTableCell.propTypes = {
    type: PropTypes.string.isRequired,
    segment: PropTypes.object.isRequired,
    originalLocale: PropTypes.string.isRequired,
};
