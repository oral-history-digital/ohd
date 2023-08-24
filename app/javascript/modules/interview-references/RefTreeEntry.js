import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Disclosure } from 'modules/ui';
import isTranscriptResultList from './isTranscriptResultList';
import RefTreeEntryList from './RefTreeEntryList';
import TranscriptResultList from './TranscriptResultList';

export default function RefTreeEntry({
    entry,
    index,
}) {
    const { locale } = useI18n();

    const title = entry.desc
        ? `${entry.desc[locale]} (${entry.leafe_count})`
        : (index + 1);

    return (
        <Disclosure title={title}>
        {
            isTranscriptResultList(entry.children) ? (
                <TranscriptResultList transcriptResults={entry.children} />
            ) : (
                <RefTreeEntryList entries={entry.children} />
            )
        }
        </Disclosure>
    );
}

RefTreeEntry.propTypes = {
    entry: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};
