import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import RefTreeEntry from './RefTreeEntry';

export default function RefTreeEntryList({ entries }) {
    const { locale } = useI18n();

    function sortedEntries() {
        const result = [...entries];
        result.sort(entryComparator);
        return result;
    }

    function entryComparator(entryA, entryB) {
        const labelA = entryA.desc[locale];
        const labelB = entryB.desc[locale];
        return labelA.localeCompare(labelB);
    }

    return sortedEntries().map((entry, index) => (
        <RefTreeEntry key={entry.id} entry={entry} index={index} />
    ));
}

RefTreeEntryList.propTypes = {
    entries: PropTypes.array.isRequired,
};
