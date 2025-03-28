import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import { Fetch } from 'modules/data';
import { SubmitOnBlurForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import { sendTimeChangeRequest } from 'modules/media-player';
import { RegistryReferencesContainer } from 'modules/registry-references';
import { Annotations } from 'modules/annotations';
import fieldHasData from './fieldHasData';
import { ALPHA2_TO_ALPHA3 } from 'modules/constants';

export default function EditTableCell({
    type,
    segment,
    originalLocale,
    translationLocale,
}) {
    const dispatch = useDispatch();
    const { locale } = useI18n();
    const alpha3Locales = Object.values(ALPHA2_TO_ALPHA3);
    let alpha3Locale, attribute;

    if (/heading/.test(type)) {
        alpha3Locale = type.split('_').pop();
        attribute = type.split('_').shift();
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': fieldHasData(segment.mainheading[alpha3Locale])
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

    switch (type) {
    case 'timecode':
        return (
            <div className="EditTable-cell">
                <button
                    type="button"
                    id={`segment_${segment.id}`}
                    className="Button EditTable-button"
                    onClick={() => dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time))}
                >
                    {segment.tape_nbr} – {formatTimecode(segment.time)}
                </button>
            </div>
        );
    case 'text_orig':
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': fieldHasData(segment.text[originalLocale])
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
    case 'text_translated':
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': fieldHasData(segment.text[translationLocale])
                })}
            >
                <SubmitOnBlurForm
                    data={segment}
                    scope="segment"
                    locale={translationLocale}
                    attribute="text"
                    type="textarea"
                />
            </div>
        );
    case 'registry_references':
            console.log('registry_references');
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': segment.registry_references_count !== 0,
                })}
            >
                <Fetch
                    fetchParams={['registry_entries', null, null, `ref_object_type=Segment&ref_object_id=${segment.id}`]}
                    testDataType='registry_entries'
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
    case 'annotations':
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': segment.annotations_count !== 0,
                })}
            >
                <Annotations
                    segment={segment}
                    contentLocale={originalLocale}
                />
            </div>
        );
    case 'annotations_translated':
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': segment.annotations_count !== 0,
                })}
            >
                <Annotations
                    segment={segment}
                    contentLocale={translationLocale}
                />
            </div>
        );
    default:
            console.log('EditTableCell default', type);
    }
}

EditTableCell.propTypes = {
    type: PropTypes.string.isRequired,
    segment: PropTypes.object.isRequired,
    originalLocale: PropTypes.string.isRequired,
    translationLocale: PropTypes.string,
};
