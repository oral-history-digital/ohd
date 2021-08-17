import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';

import { SubmitOnBlurForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import { sendTimeChangeRequest } from 'modules/media-player';
import { RegistryReferencesContainer } from 'modules/registry-references';
import { Annotations } from 'modules/annotations';

function headingHasData(heading) {
    return heading && heading.trim().length > 0;
}

export default function EditTableCell({
    type,
    segment,
    originalLocale,
    translationLocale,
}) {
    const dispatch = useDispatch();
    const { locale } = useI18n();

    switch (type) {
    case 'timecode':
        return (
            <div className="EditTable-cell EditTable-cell--narrow">
                <button
                    type="button"
                    id={`segment_${segment.id}`}
                    className="EditTable-button"
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
                    'has-data': headingHasData(segment.text[originalLocale])
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
                    'has-data': headingHasData(segment.text[translationLocale])
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
    case 'mainheading_orig':
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': headingHasData(segment.mainheading[originalLocale])
                })}
            >
                <SubmitOnBlurForm
                    data={segment}
                    scope="segment"
                    locale={originalLocale}
                    attribute="mainheading"
                    type="input"
                />
            </div>
        );
    case 'mainheading_translated':
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': headingHasData(segment.mainheading[translationLocale])
                })}
            >
                <SubmitOnBlurForm
                    data={segment}
                    scope="segment"
                    locale={translationLocale}
                    attribute="mainheading"
                    type="input"
                />
            </div>
        );
    case 'subheading_orig':
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': headingHasData(segment.subheading[originalLocale])
                })}
            >
                <SubmitOnBlurForm
                    data={segment}
                    scope="segment"
                    locale={originalLocale}
                    attribute="subheading"
                    type="input"
                />
            </div>
        );
    case 'subheading_translated':
        return (
            <div
                className={classNames('EditTable-cell', {
                    'has-data': headingHasData(segment.subheading[translationLocale])
                })}
            >
                <SubmitOnBlurForm
                    data={segment}
                    scope="segment"
                    locale={translationLocale}
                    attribute="subheading"
                    type="input"
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
                <RegistryReferencesContainer
                    refObject={segment}
                    parentEntryId={1}
                    locale={locale}
                />
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
                    contentLocale={locale}
                />
            </div>
        );
    default:
    }
}

EditTableCell.propTypes = {
    type: PropTypes.string.isRequired,
    segment: PropTypes.object.isRequired,
    originalLocale: PropTypes.string.isRequired,
    translationLocale: PropTypes.string,
};
