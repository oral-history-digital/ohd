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
import { checkTextDir } from '../../transcript/utils';
import fieldHasData from './fieldHasData';

export default function EditTableCell({ type, segment, originalLocale }) {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    let alpha3Locale, attribute;

    // Determine text direction for the textarea
    const textDir = checkTextDir(segment.text[originalLocale] || '');
    const uniqueId = `segment_${segment.id}_${originalLocale}`;

    useEffect(() => {
        const textarea = document.getElementById(uniqueId);
        textarea.setAttribute('dir', textDir);
        textarea.style.direction = textDir;
        textarea.style.textAlign = textDir === 'rtl' ? 'right' : 'left';
    }, [textDir, uniqueId]);

    if (/translation|heading|annotation/.test(type)) {
        alpha3Locale = type.split('_').pop();
        attribute = type.split('_').shift();
        attribute = attribute === 'translation' ? 'text' : attribute;

        if (attribute === 'annotation') {
            return (
                <div
                    className={classNames('EditTable-cell', {
                        'has-data': segment.annotations_count !== 0,
                    })}
                >
                    <Annotations
                        segment={segment}
                        contentLocale={alpha3Locale}
                    />
                </div>
            );
        } else {
            return (
                <div
                    className={classNames('EditTable-cell', {
                        'has-data': fieldHasData(
                            segment[attribute][alpha3Locale]
                        ),
                    })}
                >
                    <SubmitOnBlurForm
                        data={segment}
                        scope="segment"
                        locale={alpha3Locale}
                        attribute={attribute}
                        type="input"
                    />
                </div>
            );
        }
    }

    switch (type) {
        case 'timecode':
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
        case 'transcript':
            return (
                <div
                    id={uniqueId}
                    className={classNames('EditTable-cell', {
                        'has-data': fieldHasData(segment.text[originalLocale]),
                    })}
                >
                    <SubmitOnBlurForm
                        data={segment}
                        scope="segment"
                        locale={originalLocale}
                        attribute="text"
                        type="textarea"
                    />
                </div>
            );
        case 'registry_references':
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
        default:
            console.debug('EditTableCell default', type);
    }
}

EditTableCell.propTypes = {
    type: PropTypes.string.isRequired,
    segment: PropTypes.object.isRequired,
    originalLocale: PropTypes.string.isRequired,
};
