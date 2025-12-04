import PropTypes from 'prop-types';

import RefTreeEntryList from './RefTreeEntryList';
import TranscriptResultList from './TranscriptResultList';

export default function RefTreeChildren({ entries }) {
    const refTreeEntries = entries.filter((entry) => entry.type === 'node');
    const transcriptResults = entries.filter((entry) => entry.type === 'leafe');

    return (
        <>
            <RefTreeEntryList entries={refTreeEntries} />
            <TranscriptResultList transcriptResults={transcriptResults} />
        </>
    );
}

RefTreeChildren.propTypes = {
    entries: PropTypes.array.isRequired,
};
