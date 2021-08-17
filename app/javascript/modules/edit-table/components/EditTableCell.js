import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { SubmitOnBlurForm } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { formatTimecode } from 'modules/interview-helpers';
import { sendTimeChangeRequest } from 'modules/media-player';
import { RegistryReferencesContainer } from 'modules/registry-references';
import { Annotations } from 'modules/annotations';

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
            <button
                type="button"
                id={`segment_${segment.id}`}
                className="EditTable-button"
                onClick={() => dispatch(sendTimeChangeRequest(segment.tape_nbr, segment.time))}
            >
                {`${segment.tape_nbr} – ${formatTimecode(segment.time)}`}
            </button>
        );
    case 'text_orig':
        return (
            <SubmitOnBlurForm
                data={segment}
                scope="segment"
                locale={originalLocale}
                attribute="text"
                type="textarea"
            />
        );
    case 'text_translated':
        return (
            <SubmitOnBlurForm
                data={segment}
                scope="segment"
                locale={translationLocale}
                attribute="text"
                type="textarea"
            />
        );
    case 'mainheading_orig':
        return (
            <SubmitOnBlurForm
                data={segment}
                scope="segment"
                locale={originalLocale}
                attribute="mainheading"
                type="input"
            />
        );
    case 'mainheading_translated':
        return (
            <SubmitOnBlurForm
                data={segment}
                scope="segment"
                locale={translationLocale}
                attribute="mainheading"
                type="input"
            />
        );
    case 'subheading_orig':
        return (
            <SubmitOnBlurForm
                data={segment}
                scope="segment"
                locale={originalLocale}
                attribute="subheading"
                type="input"
            />
        );
    case 'subheading_translated':
        return (
            <SubmitOnBlurForm
                data={segment}
                scope="segment"
                locale={translationLocale}
                attribute="subheading"
                type="input"
            />
        );
    case 'registry_references':
        return (
            <RegistryReferencesContainer
                refObject={segment}
                parentEntryId={1}
                locale={locale}
            />
        );
    case 'annotations':
        return (
            <Annotations
                segment={segment}
                contentLocale={locale}
            />
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
