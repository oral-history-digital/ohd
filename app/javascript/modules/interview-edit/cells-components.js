import classNames from 'classnames';

import { SubmitOnBlurForm } from 'modules/forms';
import { formatTimecode } from 'modules/interview-helpers';
import { RegistryReferencesContainer } from 'modules/registry-references';
import { Annotations } from 'modules/annotations';

export const TimecodeCell = ({ segment, active, sendTimeChangeRequest }) => (
    <div
        id={`segment_${segment.id}`}
        className={classNames('segment', active ? 'active' : 'inactive')}
        onClick={() => sendTimeChangeRequest(segment.tape_nbr, segment.time)}
    >
        {`${segment.tape_nbr} - ${formatTimecode(segment.time)}`}
    </div>
);

export const OriginalTextCell = ({ segment, originalLocale }) => (
    <SubmitOnBlurForm
        data={segment}
        scope="segment"
        locale={originalLocale}
        attribute="text"
        type="textarea"
    />
);

export const OriginalMainheadingCell = ({ segment, originalLocale }) => (
    <SubmitOnBlurForm
        data={segment}
        scope='segment'
        locale={originalLocale}
        attribute='mainheading'
        type='input'
    />
);

export const OriginalSubheadingCell = ({ segment, originalLocale }) => (
    <SubmitOnBlurForm
        data={segment}
        scope='segment'
        locale={originalLocale}
        attribute='subheading'
        type='input'
    />
);

export const TranslationTextCell = ({ segment, translationLocale }) => (
    <SubmitOnBlurForm
        data={segment}
        scope="segment"
        locale={translationLocale}
        attribute="text"
        type="textarea"
    />
);

export const TranslationMainheadingCell = ({ segment, translationLocale }) => (
    <SubmitOnBlurForm
        data={segment}
        scope='segment'
        locale={translationLocale}
        attribute='mainheading'
        type='input'
    />
);

export const TranslationSubheadingCell = ({ segment, translationLocale }) => (
    <SubmitOnBlurForm
        data={segment}
        scope='segment'
        locale={translationLocale}
        attribute='subheading'
        type='input'
    />
);

export const RegistryReferencesCell = ({ segment, locale }) => (
    <RegistryReferencesContainer
        refObject={segment}
        parentEntryId={1}
        locale={locale}
    />
);

export const AnnotationsCell = ({ segment, locale }) => (
    <Annotations
        segment={segment}
        contentLocale={locale}
    />
);
